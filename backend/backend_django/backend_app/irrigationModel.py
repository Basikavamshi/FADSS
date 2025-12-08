import joblib
import numpy as np
import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
import requests
from huggingface_hub import InferenceClient
import json
 
import re
class IrrigationModel():
    def __init__(self):
        self.client = InferenceClient(
            model="meta-llama/Llama-3.1-8B-Instruct",
            token="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"
        )
   
    def llm_verifier(self,crop_type,field_size,soil_moisture_level):
            prompt = """
            You are an expert irrigation and water management advisor.

            Based on the following inputs, predict an optimal irrigation schedule.

            Inputs:
            Crop Type: {crop_type}
            Field Size (in acres): {field_size}
            Current Soil Moisture Level: {soil_moisture_level}  (Low / Medium / High)

            Tasks:
            1. Determine the irrigation frequency (number of days between irrigations).
            2. Estimate the amount of water required per irrigation.
            3. Estimate irrigation duration per session.
            4. Suggest the best time of day for irrigation.
            5. Prepare a detailed weekly irrigation plan.
            

            IMPORTANT OUTPUT RULES:
            - Output ONLY valid JSON
            - Do NOT include any text outside the JSON.
            - Output must be structured.
            - Do NOT add any explanations or extra text.
            - Do NOT add symbols, units explanation, or comments.
            - Use clear numeric values or short ranges where necessary.
            - All values must be strings.
            - close all the brackets 
            - dont give incomplete data or structure
            Return JSON in the following EXACT format:
            {{
                "irrigation_frequency_days": "<value>",
                "water_amount_per_irrigation": "<value>",
                "irrigation_duration": "<value>",
                "best_time_for_irrigation": "<value>",
                "weekly_irrigation_plan": {{
                    "day_name": {{
                    "time": "<value>",
                    "water_amount": "<value>",
                    "duration": "<value>"
                    }},
                  }}
                }}
            """    

            prompt=prompt.format(crop_type=crop_type,field_size=field_size,soil_moisture_level=soil_moisture_level)

            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
      
            return response.choices[0].message["content"]
    



   

    def Predictor(self,cropType,fieldSize,soilMoistureLevel):
       
        llm_prediction=self.llm_verifier(crop_type=cropType,field_size=fieldSize,soil_moisture_level=soilMoistureLevel)
        print(llm_prediction)
        print(type(llm_prediction))
        
        data_json=json.loads(llm_prediction)
        return data_json