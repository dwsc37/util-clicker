import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useGame } from "./GameContext";
import { ACTIONS } from "../store/reducer";

type AudioContextValue = {
  playKeyPress: () => void;
  playCrank: () => void;
  playClick: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

type SoundName =
  | "keyPress1"
  | "keyPress2"
  | "keyPress3"
  | "keyPress4"
  | "crank"
  | "click";

const SOUND_FILES: Record<SoundName, string> = {
  keyPress1: "/sounds/key-press-1.wav",
  keyPress2: "/sounds/key-press-2.wav",
  keyPress3: "/sounds/key-press-3.wav",
  keyPress4: "/sounds/key-press-4.wav",
  crank: "/sounds/crank.wav",
  click: "/sounds/click.wav",
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const rawBuffersRef = useRef<Partial<Record<SoundName, ArrayBuffer>>>({});
  const buffersRef = useRef<Partial<Record<SoundName, AudioBuffer>>>({});
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const { dispatch } = useGame();

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

  useEffect(() => {
    async function fetchAll() {
      await Promise.all(
        (Object.entries(SOUND_FILES) as [SoundName, string][]).map(
          async ([name, path]) => {
            try {
              const res = await fetch(path);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              rawBuffersRef.current[name] = await res.arrayBuffer();
            } catch (err) {
              console.warn(
                `AudioProvider: failed to fetch "${name}" (${path})`,
                err,
              );
            }
          },
        ),
      );
    }
    fetchAll();
  }, []);

  function handleStart() {
    const ctx = getCtx();
    Promise.all(
      (Object.keys(rawBuffersRef.current) as SoundName[]).map(async (name) => {
        const raw = rawBuffersRef.current[name];
        if (!raw) return;
        buffersRef.current[name] = await ctx.decodeAudioData(raw);
      }),
    ).then(() => {
      musicRef.current?.play();
      setStarted(true);
      dispatch({ type: ACTIONS.START });
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

  function playKeyPress() {
    play(("keyPress" + Math.floor(Math.random() * 4)) as SoundName, 0.2);
  }

  function playCrank() {
    play("crank", 0.3, 1.5);
  }

  function playClick() {
    play("click", 0.3);
  }

  return (
    <AudioCtx.Provider value={{ playKeyPress, playCrank, playClick }}>
      {!started && (
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
      )}
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
