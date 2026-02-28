import { useState, useEffect, useCallback } from "react";
import TopBar from "@/components/TopBar";
import SuggestionRow from "@/components/SuggestionRow";
import AACGrid from "@/components/AACGrid";
import BottomBar from "@/components/BottomBar";
import NavTabs, { type TabId } from "@/components/NavTabs";
import AnalyticsView from "@/components/AnalyticsView";
import ProfileView from "@/components/ProfileView";
import { fetchSuggestions, logPhrase, speakText } from "@/lib/api";

const Index = () => {
  const [tab, setTab] = useState<TabId>("aac");
  const [sentence, setSentence] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "I want water",
    "Good morning",
    "Can you help me?",
  ]);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const location = "Home";

  useEffect(() => {
    fetchSuggestions(location, time).then(setSuggestions);
  }, []);

  const addWord = useCallback((word: string) => {
    setSentence((s) => (s ? `${s} ${word}` : word));
  }, []);

  const addSuggestion = useCallback((text: string) => {
    setSentence(text);
  }, []);

  const handleBackspace = useCallback(() => {
    setSentence((s) => {
      const words = s.trim().split(" ");
      words.pop();
      return words.join(" ");
    });
  }, []);

  const handleClear = useCallback(() => setSentence(""), []);

  const handleSpeak = useCallback(async () => {
    if (!sentence.trim()) return;
    try {
      await speakText(sentence);
    } catch {
      // fallback to browser TTS
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(sentence);
        speechSynthesis.speak(u);
      }
    }
    await logPhrase(sentence);
  }, [sentence]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar location={location} time={time} />

      {tab === "aac" && (
        <>
          <SuggestionRow suggestions={suggestions} onSelect={addSuggestion} />
          <AACGrid onButtonPress={addWord} />
          <BottomBar
            sentence={sentence}
            onSpeak={handleSpeak}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </>
      )}

      {tab === "analytics" && <AnalyticsView />}
      {tab === "profile" && <ProfileView />}

      <NavTabs active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
