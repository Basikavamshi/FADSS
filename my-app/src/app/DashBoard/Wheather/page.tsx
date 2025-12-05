'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

function Weather() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleGetWeather = () => {
    const mockWeather = {
      location: location || "Your Location",
      current: {
        temp: 28,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        icon: "☁️"
      },
      forecast: [
        { day: "Today", temp: "28°C", condition: "Partly Cloudy", icon: "⛅", rain: "10%" },
        { day: "Tomorrow", temp: "30°C", condition: "Sunny", icon: "☀️", rain: "0%" },
        { day: "Wednesday", temp: "27°C", condition: "Rainy", icon: "🌧️", rain: "80%" },
        { day: "Thursday", temp: "26°C", condition: "Cloudy", icon: "☁️", rain: "30%" },
        { day: "Friday", temp: "29°C", condition: "Sunny", icon: "☀️", rain: "5%" },
        { day: "Saturday", temp: "31°C", condition: "Hot", icon: "🌡️", rain: "0%" },
        { day: "Sunday", temp: "28°C", condition: "Partly Cloudy", icon: "⛅", rain: "15%" },
      ],
      farmingAdvice: [
        "Good conditions for irrigation today",
        "Heavy rain expected Wednesday - postpone spraying",
        "Ideal temperature for vegetative growth this week",
        "Monitor for pest activity after rainfall"
      ]
    };
    setWeatherData(mockWeather);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-cyan-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 transition-colors"
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
            <span className="text-5xl">🌤️</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Weather Forecast
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Plan your farming activities with accurate weather predictions
          </p>
        </div>

        {/* Location Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-cyan-600 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleGetWeather}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Forecast
            </button>
          </div>
        </div>

        {/* Weather Data */}
        {weatherData && (
          <div className="space-y-6">
            {/* Current Weather */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{weatherData.location}</h2>
                  <p className="text-blue-100">Current Weather</p>
                </div>
                <div className="text-6xl">{weatherData.current.icon}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun size={20} />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.temp}°C</p>
                </div>

                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={20} />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                </div>

                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind size={20} />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.windSpeed} km/h</p>
                </div>

                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain size={20} />
                    <span className="text-sm">Rainfall</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.rainfall} mm</p>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">7-Day Forecast</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {weatherData.forecast.map((day, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200 hover:border-cyan-400 transition-colors"
                  >
                    <h3 className="font-bold text-gray-800 mb-3">{day.day}</h3>
                    <div className="text-4xl mb-3">{day.icon}</div>
                    <p className="text-2xl font-bold text-gray-800 mb-2">{day.temp}</p>
                    <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Droplets size={16} />
                      <span className="text-sm font-semibold">{day.rain} rain</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Advice */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Cloud className="text-green-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">Farming Advice Based on Weather</h2>
              </div>
              
              <div className="space-y-3">
                {weatherData.farmingAdvice.map((advice, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border-l-4 border-green-500"
                  >
                    <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-700">{advice}</p>
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

export default Weather;