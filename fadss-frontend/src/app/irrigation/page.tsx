'use client';

import { useState } from 'react';
import Link from 'next/link';

interface IrrigationFormData {
  crop_type: string;
  crop_stage: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rainfall_forecast: number;
  field_area: number;
}

interface IrrigationSchedule {
  next_irrigation_date: string;
  water_amount: string;
  irrigation_frequency: string;
  method_recommended: string;
  reasons: string[];
  tips: string[];
}

export default function IrrigationPage() {
  const [formData, setFormData] = useState<IrrigationFormData>({
    crop_type: 'rice',
    crop_stage: 'vegetative',
    soil_moisture: 40,
    temperature: 28,
    humidity: 65,
    rainfall_forecast: 0,
    field_area: 1
  });

  const [schedule, setSchedule] = useState<IrrigationSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['crop_type', 'crop_stage', 'method_recommended'].includes(name) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/irrigation-schedule/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        setError('Failed to generate schedule. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to server.');
      // Mock data for development
      setSchedule({
        next_irrigation_date: '2024-12-05',
        water_amount: '25-30 mm',
        irrigation_frequency: 'Every 3-4 days',
        method_recommended: 'Drip Irrigation',
        reasons: [
          'Current soil moisture is below optimal level',
          'No rainfall expected in next 3 days',
          'Crop is in critical growth stage'
        ],
        tips: [
          'Irrigate early morning (6-8 AM) for best results',
          'Monitor soil moisture daily',
          'Consider mulching to retain moisture'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl">🌱</span>
              <span className="ml-2 text-xl font-bold text-green-700">FADSS</span>
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-4xl mr-3">💧</span>
            Irrigation Scheduling
          </h1>
          <p className="text-gray-600 mt-2">
            Optimize water usage with smart irrigation recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Field Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                </select>
              </div>

              {/* Crop Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Stage
                </label>
                <select
                  name="crop_stage"
                  value={formData.crop_stage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="germination">Germination</option>
                  <option value="vegetative">Vegetative</option>
                  <option value="flowering">Flowering</option>
                  <option value="fruiting">Fruiting/Grain Filling</option>
                  <option value="maturity">Maturity</option>
                </select>
              </div>

              {/* Soil Moisture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Soil Moisture: {formData.soil_moisture}%
                </label>
                <input
                  type="range"
                  name="soil_moisture"
                  min="0"
                  max="100"
                  value={formData.soil_moisture}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Dry (0%)</span>
                  <span>Optimal (60%)</span>
                  <span>Saturated (100%)</span>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rain Forecast (mm)
                  </label>
                  <input
                    type="number"
                    name="rainfall_forecast"
                    value={formData.rainfall_forecast}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Field Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Area (hectares)
                </label>
                <input
                  type="number"
                  name="field_area"
                  step="0.1"
                  value={formData.field_area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Calculating...' : 'Generate Schedule'}
              </button>
            </form>
          </div>

          {/* Schedule Display */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Irrigation Schedule</h2>
              
              {!schedule ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">💧</div>
                  <p>Enter field details to generate irrigation schedule</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Next Irrigation */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-700 font-medium mb-1">Next Irrigation</p>
                    <p className="text-2xl font-bold text-blue-900">{schedule.next_irrigation_date}</p>
                    <p className="text-sm text-blue-700 mt-2">
                      Water Amount: <span className="font-semibold">{schedule.water_amount}</span>
                    </p>
                  </div>

                  {/* Frequency */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Irrigation Frequency</p>
                    <p className="text-lg font-semibold text-gray-900">{schedule.irrigation_frequency}</p>
                  </div>

                  {/* Recommended Method */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Recommended Method</p>
                    <p className="text-lg font-semibold text-gray-900">{schedule.method_recommended}</p>
                  </div>

                  {/* Reasons */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Why this schedule:</p>
                    <ul className="space-y-2">
                      {schedule.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Irrigation Tips
                    </p>
                    <ul className="space-y-2">
                      {schedule.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-900">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total Water Calculation */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Estimated Water Requirement</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(parseFloat(schedule.water_amount) * formData.field_area * 10).toFixed(0)} liters
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      For {formData.field_area} hectare(s)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}