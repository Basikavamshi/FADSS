'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PestFormData {
  crop_type: string;
  symptoms: string[];
  affected_area: string;
  temperature: number;
  humidity: number;
  rainfall_recent: number;
}

interface PestDetection {
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

export default function PestManagementPage() {
  const [formData, setFormData] = useState<PestFormData>({
    crop_type: 'rice',
    symptoms: [],
    affected_area: '10',
    temperature: 28,
    humidity: 70,
    rainfall_recent: 50
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [detection, setDetection] = useState<PestDetection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const symptomsList = [
    'Yellowing of leaves',
    'Brown spots on leaves',
    'Wilting',
    'Holes in leaves',
    'White powder on leaves',
    'Stunted growth',
    'Stem rot',
    'Root damage'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['crop_type', 'affected_area'].includes(name) ? value : parseFloat(value)
    }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('crop_type', formData.crop_type);
      formDataToSend.append('symptoms', JSON.stringify(formData.symptoms));
      formDataToSend.append('affected_area', formData.affected_area);
      formDataToSend.append('temperature', formData.temperature.toString());
      formDataToSend.append('humidity', formData.humidity.toString());
      formDataToSend.append('rainfall_recent', formData.rainfall_recent.toString());
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:8000/api/pest-detection/', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setDetection(data);
      } else {
        setError('Failed to detect pest/disease. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to server.');
      // Mock data for development
      setDetection({
        pest_name: 'Brown Planthopper',
        disease_name: 'Bacterial Leaf Blight',
        confidence: 87,
        severity: 'Medium',
        description: 'Brown planthopper is a serious pest that feeds on rice plants, causing hopperburn. Bacterial leaf blight is characterized by water-soaked lesions on leaves.',
        causes: [
          'High humidity and warm temperature favor pest multiplication',
          'Dense planting and excessive nitrogen fertilization',
          'Prolonged leaf wetness due to recent rainfall'
        ],
        treatment: {
          immediate_action: [
            'Remove and destroy severely affected plants',
            'Drain excess water from the field',
            'Improve field ventilation by wider plant spacing'
          ],
          pesticides: [
            'Imidacloprid 17.8% SL @ 100-125 ml/ha',
            'Thiamethoxam 25% WG @ 100 g/ha',
            'Apply Streptocycline (15g) + Copper Oxychloride (500g) per 100 liters of water'
          ],
          organic_solutions: [
            'Neem oil spray (5 ml/liter of water)',
            'Release predators like Cyrtorhinus and Mirid bugs',
            'Apply Pseudomonas fluorescens @ 10g/liter'
          ],
          preventive_measures: [
            'Use resistant varieties',
            'Maintain optimal plant spacing (20x15 cm)',
            'Avoid excessive nitrogen fertilization',
            'Remove weeds regularly',
            'Practice crop rotation with non-host crops'
          ]
        },
        estimated_loss: '15-25% if not treated within 7 days'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <span className="text-4xl mr-3">🐛</span>
            Pest & Disease Management
          </h1>
          <p className="text-gray-600 mt-2">
            Detect pests and diseases early with AI-powered image recognition and get treatment recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detection Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Crop Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      ) : (
                        <div className="py-8">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <select
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="cotton">Cotton</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="sugarcane">Sugarcane</option>
                  </select>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Observed Symptoms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptomsList.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          formData.symptoms.includes(symptom)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Affected Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affected Area (%)
                  </label>
                  <input
                    type="number"
                    name="affected_area"
                    value={formData.affected_area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Weather Conditions */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rain (mm)
                    </label>
                    <input
                      type="number"
                      name="rainfall_recent"
                      value={formData.rainfall_recent}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Analyzing...' : 'Detect & Get Treatment'}
                </button>
              </form>
            </div>
          </div>

          {/* Detection Results */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detection Results</h2>
              
              {!detection ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🐛</div>
                  <p>Upload image or fill the form to detect pests and diseases</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Detection Header */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-red-700 font-medium">Detected Issue</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(detection.severity)}`}>
                        {detection.severity} Severity
                      </span>
                    </div>
                    <p className="text-xl font-bold text-red-900">{detection.pest_name}</p>
                    {detection.disease_name && (
                      <p className="text-lg font-semibold text-red-800 mt-1">{detection.disease_name}</p>
                    )}
                    <p className="text-sm text-red-700 mt-2">
                      Confidence: <span className="font-semibold">{detection.confidence}%</span>
                    </p>
                  </div>

                  {/* Description */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{detection.description}</p>
                  </div>

                  {/* Causes */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Possible Causes:</p>
                    <ul className="space-y-2">
                      {detection.causes.map((cause, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-sm text-gray-700">{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estimated Loss */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">⚠️ Potential Loss:</span> {detection.estimated_loss}
                    </p>
                  </div>

                  {/* Immediate Action */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-900 mb-3">🚨 Immediate Actions Required</p>
                    <ol className="space-y-2">
                      {detection.treatment.immediate_action.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-sm text-red-900">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Chemical Treatment */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">💊 Chemical Treatment Options:</p>
                    <ul className="space-y-2">
                      {detection.treatment.pesticides.map((pesticide, index) => (
                        <li key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                          <span className="text-sm text-blue-900">{pesticide}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Organic Solutions */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">🌿 Organic Solutions:</p>
                    <ul className="space-y-2">
                      {detection.treatment.organic_solutions.map((solution, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preventive Measures */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-3">🛡️ Future Prevention Tips</p>
                    <ul className="space-y-2">
                      {detection.treatment.preventive_measures.map((measure, index) => (
                        <li key={index} className="text-sm text-green-900">
                          • {measure}
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