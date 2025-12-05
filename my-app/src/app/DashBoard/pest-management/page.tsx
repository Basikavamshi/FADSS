'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bug, Shield, AlertTriangle } from "lucide-react";

function PestManagement() {
  const router = useRouter();
  const [cropType, setCropType] = useState("");
  const [pestType, setPestType] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [solutions, setSolutions] = useState(null);

  const crops = ["Rice", "Wheat", "Cotton", "Sugarcane", "Vegetables", "Pulses"];
  const pestTypes = ["Insects", "Diseases", "Weeds", "Rodents", "Birds"];

  const handleGetSolutions = () => {
    const mockSolutions = {
      identification: {
        pest: "Brown Plant Hopper",
        description: "Small insects that suck plant sap causing yellowing and stunted growth",
        riskLevel: "High"
      },
      preventiveMeasures: [
        "Maintain proper plant spacing for air circulation",
        "Remove infected plant debris regularly",
        "Use resistant crop varieties",
        "Monitor fields weekly for early detection"
      ],
      organicSolutions: [
        { name: "Neem Oil Spray", application: "15ml per liter, spray every 7 days", effectiveness: "85%" },
        { name: "Garlic Solution", application: "Crush 50g garlic in 1L water", effectiveness: "75%" },
        { name: "Bacillus thuringiensis", application: "As per label instructions", effectiveness: "90%" }
      ],
      chemicalSolutions: [
        { name: "Imidacloprid", dosage: "0.5ml/L", timing: "Early stage", caution: "Wear protective gear" },
        { name: "Chlorpyrifos", dosage: "2ml/L", timing: "Severe infestation", caution: "Follow safety interval" }
      ],
      biologicalControl: [
        { agent: "Lady Beetles", target: "Aphids", release: "5000 per acre" },
        { agent: "Trichogramma", target: "Stem Borer", release: "50,000 per acre" }
      ]
    };
    setSolutions(mockSolutions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-red-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🐛</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Pest Management System
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Identify and control pests with eco-friendly and effective solutions
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Problem Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-red-600 focus:outline-none transition-colors"
              >
                <option value="">Select crop</option>
                {crops.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Pest Category</label>
              <select
                value={pestType}
                onChange={(e) => setPestType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-red-600 focus:outline-none transition-colors"
              >
                <option value="">Select type</option>
                {pestTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-sm font-semibold text-gray-700">Infestation Severity</label>
            <div className="flex gap-4">
              {["low", "medium", "high"].map((level) => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value={level}
                    checked={severity === level}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleGetSolutions}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Bug size={20} />
            Get Solutions
          </button>
        </div>

        {/* Solutions */}
        {solutions && (
          <div className="space-y-6">
            {/* Identification */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bug className="text-red-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">Pest Identification</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{solutions.identification.pest}</h3>
                <p className="text-gray-700 mb-4">{solutions.identification.description}</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="font-semibold text-red-600">
                    Risk Level: {solutions.identification.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Preventive Measures */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-green-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">Preventive Measures</h2>
              </div>
              
              <div className="space-y-3">
                {solutions.preventiveMeasures.map((measure, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-700">{measure}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organic Solutions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Organic Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {solutions.organicSolutions.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.application}</p>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      {item.effectiveness} Effective
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chemical Solutions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chemical Solutions (If Necessary)</h2>
              <div className="space-y-4">
                {solutions.chemicalSolutions.map((item, i) => (
                  <div key={i} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {item.timing}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">Dosage: <span className="font-semibold">{item.dosage}</span></p>
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle size={16} />
                      <p className="text-sm font-semibold">{item.caution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Biological Control */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Biological Control Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {solutions.biologicalControl.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.agent}</h3>
                    <p className="text-sm text-gray-600 mb-1">Target: {item.target}</p>
                    <p className="text-sm font-semibold text-blue-600">{item.release}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PestManagement;