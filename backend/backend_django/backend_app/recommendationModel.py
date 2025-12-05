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
class RecommendationModel():
    def __init__(self):
        self.model=joblib.load(r'C:\Users\User\Desktop\FADASS\backend\backend_django\AIModel\crop_model.pkl')
        self.encoder=joblib.load(r'C:\Users\User\Desktop\FADASS\backend\backend_django\AIModel\encoders.pkl')
        self.client = InferenceClient(
            model="meta-llama/Llama-3.1-8B-Instruct",
            token="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"
        )
    def Wheather(self,lat,lon):
        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        openmeteo = openmeteo_requests.Client(session = retry_session)

        # Make sure all required weather variables are listed here
        # The order of variables in hourly or daily is important to assign them correctly below
        url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": "2025-01-01",
            "end_date": "2025-11-29",
            "hourly": ["temperature_2m", "relative_humidity_2m", "rain", "temperature_80m", "soil_temperature_18cm", "soil_moisture_9_to_27cm"],
            "timezone": "auto",
        }
        responses = openmeteo.weather_api(url, params=params)

        # Process first location. Add a for-loop for multiple locations or weather models
        response = responses[0]
        print(f"Coordinates: {response.Latitude()}°N {response.Longitude()}°E")
        print(f"Elevation: {response.Elevation()} m asl")
        print(f"Timezone: {response.Timezone()}{response.TimezoneAbbreviation()}")
        print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s")

        # Process hourly data. The order of variables needs to be the same as requested.
        hourly = response.Hourly()
        hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
        hourly_relative_humidity_2m = hourly.Variables(1).ValuesAsNumpy()
        hourly_rain = hourly.Variables(2).ValuesAsNumpy()
        hourly_temperature_80m = hourly.Variables(3).ValuesAsNumpy()
        hourly_soil_temperature_18cm = hourly.Variables(4).ValuesAsNumpy()
        hourly_soil_moisture_9_to_27cm = hourly.Variables(5).ValuesAsNumpy()

        hourly_data = {"date": pd.date_range(
            start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
            end =  pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
            freq = pd.Timedelta(seconds = hourly.Interval()),
            inclusive = "left"
        )}

        hourly_data["temperature_2m"] = hourly_temperature_2m
        hourly_data["relative_humidity_2m"] = hourly_relative_humidity_2m
        hourly_data["rain"] = hourly_rain
        hourly_data["temperature_80m"] = hourly_temperature_80m
        hourly_data["soil_temperature_18cm"] = hourly_soil_temperature_18cm
        hourly_data["soil_moisture_9_to_27cm"] = hourly_soil_moisture_9_to_27cm
        hourly_dataframe = pd.DataFrame(data = hourly_data)
        wheather_data={
            "avg_rain":hourly_rain.mean(),
            "realtive_humidity":hourly_relative_humidity_2m.mean(),
            "soil_temperature_18cm":hourly_soil_temperature_18cm.mean(),
            "soil_moisture":hourly_soil_moisture_9_to_27cm.mean()
        }
        return wheather_data
    def Adress_encoding(self,address):
        api_key = "b91f5e2087af40ea9e4a8fdfd2dbbf27"
        url = f"https://api.opencagedata.com/geocode/v1/json?q={address}&key={api_key}"

        response = requests.get(url)
        data = response.json()

        lat = data['results'][0]['geometry']['lat']
        lng = data['results'][0]['geometry']['lng']
        dataL=[lat,lng]
        return dataL
    
    def llm_verifier(self,final_crop, soil_type, season, weather,N,P,K):
            prompt = f"""
            You are an expert agricultural advisor.

            Verify the recommended crop and generate structured farming guidance.

            Crop: {final_crop}
            Soil Type: {soil_type}
            Season: {season}

            Weather Summary:
            Average Rainfall: {weather['avg_rain']}
            Average Humidity: {weather['realtive_humidity']}
            Average Temperature: {weather['soil_temperature_18cm']}

            Available NPK Values:
            N = {N}
            P = {P}
            K = {K}

            IMPORTANT RULES:
            1. Output ONLY valid JSON.
            2. Do NOT include any text outside the JSON.
            3. You must provide 5 crop blocks:
            - 1 main crop block
            - 4 alternative crop blocks
            4. Each block MUST follow the exact same structure.
            5. All values must be strings.
            6. No explanations, no extra words.

            Return JSON in the following EXACT format:

           { {"data1":{
                "crop": "{final_crop}",
                "soil_type": "{soil_type}",
                "season": "{season}",
                "expected_yield": "(High / Medium / Low)",
                "water_requirement": "(High / Medium / Low)",
            
            }}}
            """



            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
      
            return response.choices[0].message["content"]
    



    def strong_json_repair(self,text):
        # remove codeblock markers
        text = re.sub(r"```(?:json)?|```", "", text).strip()
        
        # remove invalid trailing commas
        text = re.sub(r",\s*([}\]])", r"\1", text)

        # remove non-printable chars
        text = "".join(c for c in text if c.isprintable())

        # ensure it starts with { and ends with }
        if not text.startswith("{"):
            text = "{" + text
        if not text.endswith("}"):
            text = text + "}"

        # try parsing first attempt
        try:
            return json.loads(text)
        except:
            pass

        # ----------------------------------------------------------------------
        # 🛠 FIX MISSING ENTIRE OBJECT BLOCKS LIKE "npk_requirements": {}
        # ----------------------------------------------------------------------
        # fill missing NPK entries
        text = text.replace('"npk_requirements": {}', 
            '"npk_requirements": {"N": "", "P": "", "K": ""}'
        )

        # if still invalid, try to forcibly close nested blocks
        open_braces = text.count("{")
        close_braces = text.count("}")
        if close_braces < open_braces:
            text += "}" * (open_braces - close_braces)

        # final attempt
        try:
            return json.loads(text)
        except Exception as e:
            print("❌ JSON still invalid:", e)
            print("Returned string:", text)
            return None

    def Predictor(self,N,P,K,PH,address,soil_type,season):
        Adress=self.Adress_encoding(address)
        wheatherData=self.Wheather(Adress[0],Adress[1])
        test_data=np.array([[N,P,K,PH,wheatherData["soil_temperature_18cm"],wheatherData['realtive_humidity'],wheatherData['avg_rain']]])
        predicted_data=self.model.predict(test_data)
        llm_prediction=self.llm_verifier(predicted_data[0],soil_type,season,wheatherData,N,P,K)
        print(llm_prediction)
        print(type(llm_prediction))
       
        data_json=json.loads(llm_prediction)
        return data_json