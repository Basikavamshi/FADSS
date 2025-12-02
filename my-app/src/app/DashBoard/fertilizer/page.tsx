'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf, TrendingUp } from "lucide-react";

function FertilizerUsage() {
  const router = useRouter();
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [recommendations, setRecommendations] = useState(null);

  const crops = ["Rice", "Wheat", "Cotton", "Sugarcane", "Vegetables", "Pulses"];
  const soilTypes = ["Loamy", "Clay", "Sandy", "Silt"];

  const handleGetRecommendations = () => {
    const mockRecommendations = {
      npkRatio: "10:26:26",
      nitrogenAmount: "120 kg/acre",
      phosphorusAmount: "60 kg/acre",
      potassiumAmount: "40 kg/acre",
      organicOptions: [
        { name: "Compost", amount: "2 tons/acre", benefit: "Improves soil structure" },
        { name: "Vermicompost", amount: "1 ton/acre", benefit: "Rich in nutrients" },
        { name: "Green Manure", amount: "As needed", benefit: "Nitrogen fixation" },
      ],
      chemicalOptions: [
        { name: "Urea", amount: "260 kg/acre", timing: "Split application" },
        { name: "DAP", amount: "130 kg/acre", timing: "Basal application" },
        { name: "MOP", amount: "65 kg/acre", timing: "Basal application" },
      ],
      applicationSchedule: [
        { stage: "Basal (Before Sowing)", fertilizer: "DAP + MOP", amount: "195 kg/acre" },
        { stage: "Vegetative (3-4 weeks)", fertilizer: "Urea", amount: "130 kg/acre" },
        { stage: "Reproductive (6-8 weeks)", fertilizer: "Urea", amount: "130 kg/acre" },
      ]
    };
    setRecommendations(mockRecommendations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-yellow-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors"
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
            <span className="text-5xl">🌱</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Fertilizer Usage Guide
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Get personalized fertilizer recommendations for optimal crop growth
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Farm Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-yellow-600 focus:outline-none transition-colors"
              >
                <option value="">Select crop</option>
                {crops.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-yellow-600 focus:outline-none transition-colors"
              >
                <option value="">Select soil</option>
                {soilTypes.map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Field Size (acres)</label>
              <input
                type="number"
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                placeholder="Enter size"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-yellow-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleGetRecommendations}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Leaf size={20} />
            Get Recommendations
          </button>
        </div>

        {/* Recommendations */}
        {recommendations && (
          <div className="space-y-6">
            {/* NPK Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">NPK Requirements</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Nitrogen (N)</h3>
                  <p className="text-3xl font-bold text-green-700">{recommendations.nitrogenAmount}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Phosphorus (P)</h3>
                  <p className="text-3xl font-bold text-blue-700">{recommendations.phosphorusAmount}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Potassium (K)</h3>
                  <p className="text-3xl font-bold text-purple-700">{recommendations.potassiumAmount}</p>
                </div>
              </div>

              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4">
                <p className="text-center font-bold text-yellow-800">
                  Recommended NPK Ratio: {recommendations.npkRatio}
                </p>
              </div>
            </div>

            {/* Chemical Fertilizers */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chemical Fertilizers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.chemicalOptions.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-lg font-semibold text-orange-600 mb-1">{item.amount}</p>
                    <p className="text-sm text-gray-600">{item.timing}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organic Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Organic Alternatives</h2>
              <div className="space-y-3">
                {recommendations.organicOptions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.benefit}</p>
                    </div>
                    <p className="font-semibold text-green-600">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Schedule</h2>
              <div className="space-y-4">
                {recommendations.applicationSchedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-500">
                    <div className="bg-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800 mb-1">{item.stage}</h3>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{item.fertilizer}</span> - {item.amount}
                      </p>
                    </div>
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

export default FertilizerUsage;