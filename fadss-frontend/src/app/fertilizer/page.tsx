'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FertilizerFormData {
  crop_type: string;
  crop_stage: string;
  soil_type: string;
  nitrogen_level: number;
  phosphorus_level: number;
  potassium_level: number;
  soil_ph: number;
  field_area: number;
}

interface FertilizerRecommendation {
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

export default function FertilizerPage() {
  const [formData, setFormData] = useState<FertilizerFormData>({
    crop_type: 'rice',
    crop_stage: 'vegetative',
    soil_type: 'loamy',
    nitrogen_level: 40,
    phosphorus_level: 30,
    potassium_level: 35,
    soil_ph: 6.5,
    field_area: 1
  });

  const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['crop_type', 'crop_stage', 'soil_type'].includes(name) ? value : parseFloat(value)
    }));
  };

  const getNutrientStatus = (level: number, type: string) => {
    if (level < 30) return { status: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
    if (level < 60) return { status: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'High', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/fertilizer-recommendation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendation(data);
      } else {
        setError('Failed to generate recommendation. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to server.');
      // Mock data for development
      setRecommendation({
        fertilizer_type: 'NPK Complex Fertilizer + Urea',
        quantity: '150 kg/hectare',
        application_method: 'Split Application',
        timing: 'Apply in 3 splits: Basal, Tillering, Panicle Initiation',
        npk_ratio: '20:10:10',
        cost_estimate: '₹3,500 - ₹4,000',
        nutrients_provided: {
          nitrogen: '30 kg/ha',
          phosphorus: '15 kg/ha',
          potassium: '15 kg/ha'
        },
        instructions: [
          'First dose: Apply 50 kg at the time of sowing/transplanting',
          'Second dose: Apply 50 kg during vegetative stage (20-25 days after sowing)',
          'Third dose: Apply 50 kg during flowering stage',
          'Apply fertilizer 5-7 cm away from plant base',
          'Water immediately after application'
        ],
        warnings: [
          'Avoid over-application as it may cause nutrient burn',
          'Do not apply before expected heavy rainfall',
          'Wear protective equipment during application'
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
            <span className="text-4xl mr-3">🧪</span>
            Fertilizer Management
          </h1>
          <p className="text-gray-600 mt-2">
            Get precise fertilizer recommendations based on soil nutrient analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Soil & Crop Details</h2>
              
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="maize">Maize</option>
                    <option value="vegetables">Vegetables</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="sowing">Sowing/Transplanting</option>
                    <option value="vegetative">Vegetative</option>
                    <option value="flowering">Flowering</option>
                    <option value="fruiting">Fruiting</option>
                  </select>
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="sandy">Sandy</option>
                    <option value="loamy">Loamy</option>
                    <option value="clay">Clay</option>
                    <option value="red">Red Soil</option>
                    <option value="black">Black Soil</option>
                  </select>
                </div>

                {/* Soil pH */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil pH: {formData.soil_ph}
                  </label>
                  <input
                    type="range"
                    name="soil_ph"
                    min="4"
                    max="9"
                    step="0.1"
                    value={formData.soil_ph}
                    onChange={handleInputChange}
                    className="w-full"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Analyzing...' : 'Get Recommendation'}
                </button>
              </form>
            </div>

            {/* NPK Levels */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Current Nutrient Levels (kg/ha)</h2>
              
              <div className="space-y-6">
                {/* Nitrogen */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nitrogen (N)
                    </label>
                    <span className={`text-sm font-semibold ${getNutrientStatus(formData.nitrogen_level, 'N').color}`}>
                      {getNutrientStatus(formData.nitrogen_level, 'N').status}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="nitrogen_level"
                    min="0"
                    max="100"
                    value={formData.nitrogen_level}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-center text-sm text-gray-600 mt-1">{formData.nitrogen_level} kg/ha</p>
                </div>

                {/* Phosphorus */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phosphorus (P)
                    </label>
                    <span className={`text-sm font-semibold ${getNutrientStatus(formData.phosphorus_level, 'P').color}`}>
                      {getNutrientStatus(formData.phosphorus_level, 'P').status}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="phosphorus_level"
                    min="0"
                    max="100"
                    value={formData.phosphorus_level}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-center text-sm text-gray-600 mt-1">{formData.phosphorus_level} kg/ha</p>
                </div>

                {/* Potassium */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Potassium (K)
                    </label>
                    <span className={`text-sm font-semibold ${getNutrientStatus(formData.potassium_level, 'K').color}`}>
                      {getNutrientStatus(formData.potassium_level, 'K').status}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="potassium_level"
                    min="0"
                    max="100"
                    value={formData.potassium_level}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-center text-sm text-gray-600 mt-1">{formData.potassium_level} kg/ha</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Display */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Fertilizer Recommendation</h2>
              
              {!recommendation ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🧪</div>
                  <p>Enter soil and crop details to get fertilizer recommendations</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Fertilizer Type */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-yellow-700 font-medium mb-1">Recommended Fertilizer</p>
                    <p className="text-xl font-bold text-yellow-900">{recommendation.fertilizer_type}</p>
                    <p className="text-sm text-yellow-700 mt-2">
                      NPK Ratio: <span className="font-semibold">{recommendation.npk_ratio}</span>
                    </p>
                  </div>

                  {/* Quantity & Cost */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Quantity Needed</p>
                      <p className="text-lg font-semibold text-gray-900">{recommendation.quantity}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-lg font-semibold text-gray-900">{recommendation.cost_estimate}</p>
                    </div>
                  </div>

                  {/* Nutrients Provided */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Nutrients Provided</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Nitrogen</p>
                        <p className="text-sm font-bold text-green-700">{recommendation.nutrients_provided.nitrogen}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Phosphorus</p>
                        <p className="text-sm font-bold text-blue-700">{recommendation.nutrients_provided.phosphorus}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Potassium</p>
                        <p className="text-sm font-bold text-purple-700">{recommendation.nutrients_provided.potassium}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Application Method</p>
                    <p className="font-semibold text-gray-900">{recommendation.application_method}</p>
                    <p className="text-sm text-gray-600 mt-3 mb-1">Timing</p>
                    <p className="text-sm text-gray-700">{recommendation.timing}</p>
                  </div>

                  {/* Instructions */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Application Instructions</p>
                    <ol className="space-y-2">
                      {recommendation.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Warnings */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800 mb-3 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Important Warnings
                    </p>
                    <ul className="space-y-2">
                      {recommendation.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-red-900">
                          • {warning}
                        </li>
                      ))}
                    </ul>
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