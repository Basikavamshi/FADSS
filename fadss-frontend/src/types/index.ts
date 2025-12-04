// Dashboard Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_probability: number;
  condition: string;
}

export interface DashboardStats {
  total_recommendations: number;
  pending_tasks: number;
  weather: WeatherData;
}

// Crop Selection Types
export interface CropFormData {
  location: string;
  soil_type: string;
  soil_ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
}

export interface CropRecommendation {
  crop_name: string;
  confidence: number;
  reasons: string[];
  expected_yield: string;
  market_price: string;
}

// Irrigation Types
export interface IrrigationFormData {
  crop_type: string;
  crop_stage: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rainfall_forecast: number;
  field_area: number;
}

export interface IrrigationSchedule {
  next_irrigation_date: string;
  water_amount: string;
  irrigation_frequency: string;
  method_recommended: string;
  reasons: string[];
  tips: string[];
}

// Fertilizer Types
export interface FertilizerFormData {
  crop_type: string;
  crop_stage: string;
  soil_type: string;
  nitrogen_level: number;
  phosphorus_level: number;
  potassium_level: number;
  soil_ph: number;
  field_area: number;
}

export interface FertilizerRecommendation {
  fertilizer_type: string;
  quantity: string;
  application_method: string;
  timing: string;
  npk_ratio: string;
  cost_estimate: string;
  nutrients_provided: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  instructions: string[];
  warnings: string[];
}

// Pest Management Types
export interface PestFormData {
  crop_type: string;
  symptoms: string[];
  affected_area: string;
  temperature: number;
  humidity: number;
  rainfall_recent: number;
}

export interface PestDetection {
  pest_name: string;
  disease_name: string;
  confidence: number;
  severity: string;
  description: string;
  causes: string[];
  treatment: {
    immediate_action: string[];
    pesticides: string[];
    organic_solutions: string[];
    preventive_measures: string[];
  };
  estimated_loss: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Types (for future authentication)
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farm_area?: number;
}