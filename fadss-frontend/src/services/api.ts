// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Generic GET request
export async function get<T>(endpoint: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  return handleResponse<T>(response);
}

// Generic POST request
export async function post<T>(
  endpoint: string,
  data: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

// POST request with FormData (for file uploads)
export async function postFormData<T>(
  endpoint: string,
  formData: FormData,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse<T>(response);
}

// Generic PUT request
export async function put<T>(
  endpoint: string,
  data: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

// Generic DELETE request
export async function del<T>(endpoint: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse<T>(response);
}

// Specific API endpoints
export const api = {
  // Dashboard
  getDashboard: (token?: string) => 
    get('/dashboard/', token),

  // Crop Selection
  getCropRecommendation: (data: any, token?: string) =>
    post('/crop-recommendation/', data, token),

  // Irrigation
  getIrrigationSchedule: (data: any, token?: string) =>
    post('/irrigation-schedule/', data, token),

  // Fertilizer
  getFertilizerRecommendation: (data: any, token?: string) =>
    post('/fertilizer-recommendation/', data, token),

  // Pest Management
  detectPest: (formData: FormData, token?: string) =>
    postFormData('/pest-detection/', formData, token),

  // Weather (if you have a separate endpoint)
  getWeather: (location: string, token?: string) =>
    get(`/weather/?location=${location}`, token),

  // User Management (for future authentication)
  login: (credentials: { email: string; password: string }) =>
    post('/auth/login/', credentials),
  
  register: (userData: any) =>
    post('/auth/register/', userData),
  
  logout: (token: string) =>
    post('/auth/logout/', {}, token),
};