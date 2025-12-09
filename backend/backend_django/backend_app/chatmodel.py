import asyncio
from huggingface_hub import InferenceClient

class ChatbotModel:
    def __init__(self, conversation_history=None):
        self.conversation_history = conversation_history or []
        
        # Ensure async loop exists
        try:
            asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        # Create HF inference client
        self.client = InferenceClient(
            model="meta-llama/Llama-3.1-8B-Instruct",
            token="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"
        )

    def chat_with_context(self, question):
        """
        Chat with conversation context
        """
        # Build context from history
        context_messages = []
        
        # Add system message
        context_messages.append({
            "role": "system",
            "content": "You are a helpful farming assistant. Answer questions about agriculture, crops, farming techniques, and provide practical advice to farmers."
        })
        
        # Add conversation history (last 5 exchanges)
        for item in self.conversation_history[-5:]:
            context_messages.append({"role": "user", "content": item['question']})
            context_messages.append({"role": "assistant", "content": item['answer']})
        
        # Add current question
        context_messages.append({"role": "user", "content": question})
        
        response = self.client.chat.completions.create(
            messages=context_messages,
            max_tokens=300,
        )

        answer = response.choices[0].message["content"]
        
        # Update history
        self.conversation_history.append({
            "question": question,
            "answer": answer
        })
        
        return answer

    def chat(self, question):
        """
        Simple chat without context (for backward compatibility)
        """
        response = self.client.chat.completions.create(
            messages=[
                {"role": "user", "content": question}
            ],
            max_tokens=300,
        )

        answer = response.choices[0].message["content"]
        return answer

    def get_conversation_history(self):
        return self.conversation_history