import asyncio
from huggingface_hub import InferenceClient


class ChatbotModel:

    def __init__(self):
        self.messages = []

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

    # ------------------ Main Chat Function ------------------
    def chat(self, question):
        response = self.client.chat.completions.create(
            messages=[
                {"role": "user", "content": question}
            ],
            max_tokens=300,
        )

        answer = response.choices[0].message["content"]
        return answer

    # ------------------ Add Message Wrapper ------------------
    def add_message(self, message):
        response = self.chat(message)
        self.messages.append(response)

    # ------------------ Get Message History ------------------
    def get_messages(self):
        return self.messages
