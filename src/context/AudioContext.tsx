import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

type AudioContextValue = {
  playKeyClick: () => void;
  playCrank: () => void;
  playClick: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

type SoundName = "keyclick" | "crank" | "click";

const SOUND_FILES: Record<SoundName, string> = {
  keyclick: "/sounds/keyclick.wav",
  crank: "/sounds/crank.wav",
  click: "/sounds/click.wav",
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Partial<Record<SoundName, AudioBuffer>>>({});
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/sounds/background.mp3");
    audio.loop = true;
    audio.volume = 0.08;
    musicRef.current = audio;
    return () => {
      audio.pause();
      musicRef.current = null;
    };
  }, []);

  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }

  function handleStart() {
    async function loadAll() {
      const ctx = getCtx();
      await Promise.all(
        (Object.entries(SOUND_FILES) as [SoundName, string][]).map(
          async ([name, path]) => {
            try {
              const res = await fetch(path);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const arrayBuffer = await res.arrayBuffer();
              buffersRef.current[name] = await ctx.decodeAudioData(arrayBuffer);
            } catch (err) {
              console.warn(
                `AudioProvider: failed to load "${name}" (${path})`,
                err,
              );
            }
          },
        ),
      );
    }
    loadAll().then(() => {
      musicRef.current?.play();
      setStarted(true);
    });
  }

  function play(name: SoundName, volume: number, playbackRate: number = 1) {
    const ctx = getCtx();

    const buffer = buffersRef.current[name];
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  function playKeyClick() {
    play("keyclick", 0.1, 0.8 + Math.random() * 1);
  }

  function playCrank() {
    play("crank", 0.3, 1.5);
  }

  function playClick() {
    play("click", 0.3);
  }

  if (!started) {
    return (
      <Box
        onClick={handleStart}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "#0d1117",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            color: "#e6edf3",
            fontSize: "2rem",
            letterSpacing: "0.4em",
            fontWeight: "bold",
          }}
        >
          UTIL
          <Box component="span" sx={{ color: "#3fb950" }}>
            CLICKER
          </Box>
        </Typography>

        <Typography
          sx={{
            fontFamily: "monospace",
            color: "#3fb950",
            fontSize: "0.9rem",
            letterSpacing: "0.3em",
          }}
        >
          ▶ CLICK TO START
        </Typography>
      </Box>
    );
  }

  return (
    <AudioCtx.Provider value={{ playKeyClick, playCrank, playClick }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
