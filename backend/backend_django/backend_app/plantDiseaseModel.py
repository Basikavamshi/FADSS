import torch
import torchvision.transforms as transforms
from PIL import Image
import io
from huggingface_hub import InferenceClient
import json

class PlantDiseaseModel:
    def __init__(self):
        self.client = InferenceClient(
            model="meta-llama/Llama-3.1-8B-Instruct",
            token="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"
        )
        
        # Common plant diseases
        self.diseases = [
            "Healthy", "Bacterial Blight", "Brown Spot", "Leaf Blast",
            "Early Blight", "Late Blight", "Powdery Mildew", "Leaf Curl",
            "Mosaic Virus", "Rust", "Septoria Leaf Spot"
        ]

    def predict_disease(self, image_file):
        """
        Predict plant disease from image
        For demo purposes, we'll simulate prediction
        In production, use a trained CNN model
        """
        try:
            # Open and process image
            image = Image.open(image_file)
            
            # Simulate prediction (replace with actual model inference)
            import random
            predicted_disease = random.choice(self.diseases)
            confidence = random.uniform(0.75, 0.98)
            
            # Get treatment recommendations using LLM
            recommendations = self.get_treatment_recommendations(predicted_disease, confidence)
            
            return {
                "disease_name": predicted_disease,
                "confidence": round(confidence * 100, 2),
                "recommendations": recommendations
            }
            
        except Exception as e:
            return {
                "disease_name": "Error",
                "confidence": 0.0,
                "recommendations": f"Error processing image: {str(e)}"
            }

    def get_treatment_recommendations(self, disease_name, confidence):
        """
        Get treatment recommendations using LLM
        """
        if disease_name == "Healthy":
            return "Your plant appears healthy! Continue with regular care and monitoring."
        
        prompt = f"""
        A plant has been diagnosed with {disease_name} with {confidence*100:.1f}% confidence.
        
        Provide concise treatment recommendations in the following format:
        1. Immediate Action: (2-3 lines)
        2. Organic Treatment: (2-3 lines)
        3. Chemical Treatment: (if necessary, 2-3 lines)
        4. Prevention: (2-3 lines)
        
        Keep it practical and farmer-friendly.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400
            )
            
            return response.choices[0].message["content"]
        except:
            return f"Treatment for {disease_name}: Consult with local agricultural expert for specific treatment."