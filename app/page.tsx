"use client";
import { useState, useEffect } from 'react';
import { selectOption, getResults } from './actions';

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});
  const options = ["Kaffee ☕", "Tee 🍵", "Mate 🧉"];

  // Funktion zum Laden der aktuellen Ergebnisse
  const loadResults = async () => {
    const data = await getResults();
    setResults(data);
  };

  useEffect(() => { loadResults(); }, []);

  const handleSelect = async (option: string) => {
    setSelected(option);
    await selectOption(option); // In DB speichern
    await loadResults();       // UI aktualisieren
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Was möchtest du trinken?</h1>
      
      <div className="flex gap-4 mb-12">
        {options.map((opt) => (
          <button key={opt} onClick={() => handleSelect(opt)}
            className={`px-6 py-3 rounded-lg border-2 ${selected === opt ? "bg-blue-500 text-white" : "bg-white"}`}>
            {opt}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Aktuelle Ergebnisse:</h2>
        {options.map(opt => (
          <div key={opt} className="flex justify-between py-1">
            <span>{opt}:</span>
            <span className="font-mono font-bold">{results[opt] || 0} Stimmen</span>
          </div>
        ))}
      </div>
    </main>
  );
}