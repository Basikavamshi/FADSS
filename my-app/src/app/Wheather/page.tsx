"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

type Daily = {
  date: string;
  max: number;
  min: number;
  rain: number;
  code?: number;
};

type GeoHit = {
  latitude: number;
  longitude: number;
  name?: string;
  admin1?: string;
  country?: string;
  display_name?: string;
};

export default function WeatherPredict() {
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<Daily[] | null>(null);
  const [resolvedPlace, setResolvedPlace] = useState<string | null>(null);
  const [choices, setChoices] = useState<GeoHit[] | null>(null);

  const weatherCodeToEmoji = (code?: number) => {
    if (code == null) return "❓";
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67)) return "🌧️";
    if (code >= 71 && code <= 77) return "🌨️";
    if ((code >= 80 && code <= 86) || (code >= 95 && code <= 99)) return "⛈️";
    return "📈";
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const displayNameMatchesInput = (displayName = "", rawInput = "") => {
    const dn = displayName.toLowerCase();
    const tokens = rawInput
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return tokens.every((token) => dn.includes(token));
  };

  const pickBestGeocode = (results: GeoHit[], rawInput: string) => {
    if (!results || results.length === 0) return null;
    const input = rawInput.trim().toLowerCase();

    const exact = results.find((r) => r.name && r.name.toLowerCase() === input);
    if (exact) return exact;

    const tokenMatch = results.find((r) =>
      displayNameMatchesInput(r.display_name ?? "", rawInput)
    );
    if (tokenMatch) return tokenMatch;

    return results[0];
  };

  const geocode = async (raw: string): Promise<GeoHit[] | null> => {
    try {
      const q = encodeURIComponent(raw.trim());
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=6&language=en`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.results && json.results.length > 0) {
        const hits: GeoHit[] = json.results.map((r: any) => ({
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          name: r.name,
          admin1: r.admin1,
          country: r.country,
          display_name: r.display_name,
        }));
        return hits;
      }

      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=6`;
      const nomRes = await fetch(nomiUrl, {
        headers: { "User-Agent": "WeatherPredict" },
      });
      const nomJson = await nomRes.json();

      if (Array.isArray(nomJson) && nomJson.length > 0) {
        const hits: GeoHit[] = nomJson.map((r: any) => ({
          latitude: Number(r.lat),
          longitude: Number(r.lon),
          name: r.display_name?.split(",")[0]?.trim(),
          admin1: undefined,
          country: undefined,
          display_name: r.display_name,
        }));
        return hits;
      }

      return null;
    } catch {
      return null;
    }
  };

  const fetchForecastAndSet = async (
    latitude: number,
    longitude: number,
    resolvedName?: string
  ) => {
    try {
      const fRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`
      );
      const data = await fRes.json();

      if (!data?.daily) throw new Error("Unable to get forecast");

      const daily: Daily[] = data.daily.time.map((date: string, i: number) => ({
        date,
        max: Number(data.daily.temperature_2m_max[i]),
        min: Number(data.daily.temperature_2m_min[i]),
        rain: Number(data.daily.precipitation_probability_max?.[i] ?? 0),
        code: Number(data.daily.weathercode?.[i] ?? 0),
      }));

      setForecast(daily);
      setResolvedPlace(
        resolvedName ?? `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
      );
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch forecast");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = async (hit: GeoHit) => {
    setChoices(null);
    setLoading(true);
    await fetchForecastAndSet(
      hit.latitude,
      hit.longitude,
      hit.display_name ?? `${hit.name}`
    );
  };

  const handlePredict = async () => {
    const raw = place;
    if (!raw || !raw.trim()) {
      setError("Enter a location");
      return;
    }

    setError(null);
    setForecast(null);
    setResolvedPlace(null);
    setChoices(null);
    setLoading(true);

    try {
      const hits = await geocode(raw);
      if (!hits || hits.length === 0) {
        setError("Place name not found");
        setLoading(false);
        return;
      }

      const best = pickBestGeocode(hits, raw);
      const ambiguous = hits.length > 1 && best && hits[0] !== best;

      if (ambiguous) {
        setChoices(hits);
        setLoading(false);
        return;
      }

      await fetchForecastAndSet(
        best.latitude,
        best.longitude,
        best.display_name ?? `${best.name}`
      );
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F3E0] p-6">
      <div className="w-full max-w-4xl bg-gradient-to-br from-white via-emerald-50 to-sage-100 p-8 rounded-2xl shadow-xl border border-emerald-300">
        <h2 className="text-3xl font-bold text-emerald-800 mb-3 text-center">
          Weather Forecast
        </h2>
        <p className="text-center text-emerald-700 mb-4">
          Enter exact location to view weather
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter location"
            className="flex-1 px-4 py-3 rounded-lg border-2 border-emerald-300 bg-emerald-50 text-emerald-900 focus:outline-none focus:border-emerald-600 shadow-sm"
          />
          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>

        {error && (
          <div className="bg-rose-100 text-rose-800 border border-rose-300 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {choices && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-amber-900 font-medium mb-2">
              Multiple matches found — select one:
            </div>
            <div className="grid gap-2">
              {choices.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoiceSelect(c)}
                  className="text-left p-2 bg-white border rounded hover:bg-emerald-50"
                >
                  <div className="font-semibold">
                    {c.display_name ?? c.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {resolvedPlace && (
          <div className="text-sm text-emerald-700 mb-4">
            Showing forecast for: <strong>{resolvedPlace}</strong>
          </div>
        )}

        {forecast && (
          <>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              7-Day Forecast
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {forecast.map((day, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-tr from-emerald-50 to-sage-50 border border-emerald-200 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-emerald-900 font-semibold">
                      {formatDate(day.date)}
                    </div>
                    <div className="ml-auto text-2xl">
                      {weatherCodeToEmoji(day.code)}
                    </div>
                  </div>

                  <div className="text-emerald-700 text-sm mt-2">
                    Max Temp: <span className="font-medium">{day.max}°C</span>
                  </div>
                  <div className="text-emerald-700 text-sm">
                    Min Temp: <span className="font-medium">{day.min}°C</span>
                  </div>
                  <div className="text-emerald-700 text-sm mt-1">
                    Rainfall Chance:{" "}
                    <span className="font-medium">{day.rain}%</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Temperature Trend
            </h3>

            <div className="mb-8">
              <Line
                data={{
                  labels: forecast.map((d) => formatDate(d.date)),
                  datasets: [
                    {
                      label: "Max Temp (°C)",
                      data: forecast.map((d) => d.max),
                      borderColor: "rgb(16 185 129)",
                      tension: 0.3,
                      fill: false,
                      pointRadius: 4,
                    },
                    {
                      label: "Min Temp (°C)",
                      data: forecast.map((d) => d.min),
                      borderColor: "rgb(52 211 153)",
                      tension: 0.3,
                      fill: false,
                      pointRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  interaction: { mode: "index", intersect: false },
                  scales: {
                    y: { beginAtZero: false },
                  },
                }}
              />
            </div>

            <h3 className="text-xl font-semibold text-emerald-800 mt-8 mb-2">
              Rain Probability
            </h3>

            <div className="mb-6">
              <Line
                data={{
                  labels: forecast.map((d) => formatDate(d.date)),
                  datasets: [
                    {
                      label: "Rainfall (%)",
                      data: forecast.map((d) => d.rain),
                      borderColor: "rgb(34 197 94)",
                      tension: 0.3,
                      fill: false,
                      pointRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}