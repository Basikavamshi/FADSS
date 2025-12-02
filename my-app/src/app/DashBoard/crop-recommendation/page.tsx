'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, MapPin } from "lucide-react";

function CropSelection() {
  const router = useRouter();
  const [selectedSoil, setSelectedSoil] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Peaty", "Chalky"];
  const seasons = ["Kharif", "Rabi", "Zaid", "Perennial"];

  const cropData = [
    { name: "Rice", icon: "🌾", soil: "Clay", season: "Kharif", yield: "High", water: "High" },
    { name: "Wheat", icon: "🌾", soil: "Loamy", season: "Rabi", yield: "Medium", water: "Medium" },
    { name: "Cotton", icon: "🌱", soil: "Sandy", season: "Kharif", yield: "Medium", water: "Medium" },
    { name: "Sugarcane", icon: "🎋", soil: "Loamy", season: "Perennial", yield: "High", water: "High" },
    { name: "Pulses", icon: "🫘", soil: "Clay", season: "Rabi", yield: "Low", water: "Low" },
    { name: "Vegetables", icon: "🥕", soil: "Loamy", season: "Zaid", yield: "Medium", water: "Medium" },
  ];

  const handleGetRecommendations = () => {
    const filtered = cropData.filter(crop => 
      (!selectedSoil || crop.soil === selectedSoil) &&
      (!selectedSeason || crop.season === selectedSeason)
    );
    setRecommendations(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-green-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
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
            <span className="text-5xl">🌾</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Crop Selection Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Get AI-powered crop recommendations based on your soil type, season, and location
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Farm Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Soil Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Soil Type</label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
              >
                <option value="">Select soil type</option>
                {soilTypes.map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
              >
                <option value="">Select season</option>
                {seasons.map((season) => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGetRecommendations}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Search size={20} />
            Get Recommendations
          </button>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Crops</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((crop, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{crop.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{crop.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="font-semibold text-gray-800">{crop.soil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Season:</span>
                      <span className="font-semibold text-gray-800">{crop.season}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Yield:</span>
                      <span className="font-semibold text-green-600">{crop.yield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Requirement:</span>
                      <span className="font-semibold text-blue-600">{crop.water}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CropSelection;