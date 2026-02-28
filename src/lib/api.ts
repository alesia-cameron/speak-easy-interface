const BASE_URL = "http://localhost:8000";

export async function fetchSuggestions(location: string, time: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/suggestions?location=${encodeURIComponent(location)}&time=${encodeURIComponent(time)}`);
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return await res.json();
  } catch {
    return ["I want water", "Good morning", "Can you help me?"];
  }
}

export async function logPhrase(phrase: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/log_phrase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phrase, timestamp: new Date().toISOString() }),
    });
  } catch {
    // silent fail
  }
}

export async function speakText(text: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/speak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("TTS failed");
}

export interface HeatmapEntry {
  word: string;
  count: number;
}

export async function fetchHeatmap(): Promise<HeatmapEntry[]> {
  try {
    const res = await fetch(`${BASE_URL}/analytics/heatmap`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    // Return mock data for demo
    return [
      { word: "I", count: 120 }, { word: "want", count: 95 }, { word: "water", count: 80 },
      { word: "help", count: 72 }, { word: "yes", count: 65 }, { word: "no", count: 60 },
      { word: "bathroom", count: 55 }, { word: "eat", count: 50 }, { word: "please", count: 48 },
      { word: "thank you", count: 45 }, { word: "more", count: 40 }, { word: "stop", count: 38 },
      { word: "go", count: 35 }, { word: "happy", count: 30 }, { word: "sad", count: 28 },
      { word: "mom", count: 25 }, { word: "dad", count: 22 }, { word: "love", count: 20 },
      { word: "play", count: 18 }, { word: "home", count: 15 },
    ];
  }
}
