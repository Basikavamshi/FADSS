'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Droplets, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
function IrrigationScheduling() {
  const router = useRouter();
  const [cropType, setCropType] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("medium");
  const [schedule,setSchedule]=useState([])
  const [Data,setData]=useState([])

  const handleIrrigationScheduling=()=>{
     axios.post("http://127.0.0.1:8000/irrigationScheduling/",{
      "crop_type":cropType,
      "field_size":fieldSize,
      "soil_moisture_level":soilMoisture,
     }).then((res)=>setData(res.data.data)).then((data)=>console.log(Data)).catch((e)=>console.log(e))
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-blue-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
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
            <span className="text-5xl">💧</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Irrigation Scheduling
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Optimize water usage with AI-powered irrigation recommendations
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Field Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Crop Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Crop Type</label>
              <input type="input" value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Field Size */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Field Size (acres)</label>
              <input
                type="number"
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                placeholder="Enter field size"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="mb-6">
            <label className="block mb-3 text-sm font-semibold text-gray-700">Current Soil Moisture Level</label>
            <div className="flex gap-4">
              {["low", "medium", "high"].map((level) => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="soilMoisture"
                    value={level}
                    checked={soilMoisture === level}
                    onChange={(e) => setSoilMoisture(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleIrrigationScheduling}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Calendar size={20} />
            Generate Schedule
          </button>
        </div>

        {/* Schedule Results */}
        {schedule.length>0 && (
          <div className="space-y-6">
            {/* Quick Stats */}
          { Data.map((value,item)=>{
              return(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="text-blue-600" size={24} />
                  <h3 className="text-gray-600 text-sm font-semibold">Frequency</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">{value["irrigation_frequency_days"]}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-cyan-500">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="text-cyan-600" size={24} />
                  <h3 className="text-gray-600 text-sm font-semibold">Water Amount</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">{schedule.amount}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-indigo-600" size={24} />
                  <h3 className="text-gray-600 text-sm font-semibold">Duration</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">{schedule.duration}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-purple-600" size={24} />
                  <h3 className="text-gray-600 text-sm font-semibold">Best Time</h3>
                </div>
                <p className="text-xl font-bold text-gray-800">{schedule.bestTime}</p>
              </div>
           
            </div>
             )})}

            {/* Weekly Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Irrigation Plan</h2>
              
              <div className="space-y-4">
                {schedule.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                        {item.day.substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.day}</p>
                        <p className="text-sm text-gray-600">{item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{item.amount}</p>
                      <p className="text-sm text-gray-600">{item.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Irrigation Alert */}
              <div className="mt-6 p-4 bg-blue-100 border-2 border-blue-400 rounded-xl">
                <p className="text-blue-800 font-semibold text-center">
                  ⏰ Next Irrigation: {schedule.nextIrrigation}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default IrrigationScheduling;