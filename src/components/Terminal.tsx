import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGame } from "../context/GameContext";
import { ACTIONS, type TerminalMessage } from "../store/reducer";
import { useAudio } from "../context/AudioContext";

function useTypewriter(text: string, tickInterval = 25) {
  const [displayed, setDisplayed] = useState("");
  const [finished, setFinished] = useState(false);
  const indexRef = useRef(0);

  const { playKeyPress } = useAudio();
  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current % 3 === 0) {
        playKeyPress();
      }
      if (indexRef.current >= text.length) {
        clearInterval(id);
        setFinished(true);
      }
    }, tickInterval);

    return () => clearInterval(id);
  }, [text]);

  return { displayed, finished };
}

function ActiveMessageModal({ message }: { message: TerminalMessage }) {
  const { dispatch } = useGame();
  const { displayed, finished } = useTypewriter(message.text);
  const isQTE = !!message.qteChoices;
  const [timeLeft, setTimeLeft] = useState(20);
  const { playClick } = useAudio();

  useEffect(() => {
    if (!isQTE || !finished) return;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(id);
          dispatch({ type: ACTIONS.RESOLVE_QTE, payload: { choiceIndex: 1 } });
          return 0;
        }
        return t - 0.1;
      });
    }, 100);

    return () => clearInterval(id);
  }, [isQTE, finished, timeLeft]);

  useEffect(() => {
    setTimeLeft(20);
  }, [message.id]);

  function handleAcknowledge() {
    playClick();
    dispatch({ type: ACTIONS.ACKNOWLEDGE_MESSAGE });
  }

  function handleResolve(choiceIndex: 0 | 1) {
    playClick();
    dispatch({ type: ACTIONS.RESOLVE_QTE, payload: { choiceIndex } });
  }

  const borderColor = isQTE
    ? "#e3b341"
    : /^\w+ (Alert|Notice|Emergency):/i.test(message.text)
      ? "#f85149"
      : "#3fb950";

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(0.5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: "90%",
          bgcolor: "#0d1117",
          border: "1px solid",
          borderColor: borderColor,
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          animation: "modalIn 180ms ease-out",
          "@keyframes modalIn": {
            from: { opacity: 0, transform: "scale(0.96)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "baseline" }}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#3fb950",
            }}
          >
            SYSTEM
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#8b949e",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "1rem",
              color: "#e6edf3",
              lineHeight: 1.7,
            }}
          >
            {displayed}
            {!finished && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "7px",
                  height: "13px",
                  bgcolor: "#3fb950",
                  ml: "2px",
                  verticalAlign: "middle",
                  animation: "blink 1s step-end infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              />
            )}
          </Typography>
        </Box>

        {finished && (
          <Box
            sx={{
              borderTop: "0.5px solid #21262d",
              pt: 1.5,
              justifyContent: "flex-end",
            }}
          >
            {isQTE ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                      color: "#e3b341",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ▲ INPUT REQUIRED
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                      color: timeLeft <= 10 ? "#f85149" : "#8b949e",
                      letterSpacing: "0.08em",
                      transition: "color 0.3s",
                    }}
                  >
                    {timeLeft.toFixed(1)}s
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    height: "2px",
                    bgcolor: "#21262d",
                    borderRadius: "1px",
                    mb: 1.5,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${(timeLeft / 20) * 100}%`,
                      bgcolor: timeLeft <= 10 ? "#f85149" : "#e3b341",
                      borderRadius: "1px",
                      transition: "width 1s linear, background-color 0.3s",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {message.qteChoices!.map((choice, i) => (
                    <Button
                      key={i}
                      onClick={() => handleResolve(i as 0 | 1)}
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: i === 0 ? "#3fb950" : "#f85149",
                        border: "0.5px solid",
                        borderColor: i === 0 ? "#3fb950" : "#f85149",
                        borderRadius: "2px",
                        px: 2,
                        py: 0.6,
                        "&:hover": {
                          bgcolor:
                            i === 0
                              ? "rgba(63,185,80,0.1)"
                              : "rgba(248,81,73,0.1)",
                        },
                      }}
                    >
                      {choice.label}
                    </Button>
                  ))}
                </Box>
              </>
            ) : (
              <Button
                onClick={handleAcknowledge}
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  color: "#3fb950",
                  border: "0.5px solid",
                  borderColor: "#3fb950",
                  borderRadius: "2px",
                  px: 2,
                  py: 0.6,
                  "&:hover": { bgcolor: "rgba(63,185,80,0.1)" },
                }}
              >
                CONTINUE
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function MessageRow({
  message,
  isLast,
}: {
  message: TerminalMessage;
  isLast: boolean;
}) {
  return (
    <Box mb={isLast ? 0.5 : 1.5}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "baseline", mb: 0.3 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            color: "#3fb950",
            flexShrink: 0,
          }}
        >
          SYSTEM
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            color: "#8b949e",
            flexShrink: 0,
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
      <Typography
        sx={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          color: isLast ? "#e6edf3" : "#6e7681",
          lineHeight: 1.65,
        }}
      >
        {message.text}
      </Typography>
    </Box>
  );
}

export function Terminal() {
  const { state } = useGame();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.terminalMessages]);

  return (
    <Box
      sx={{
        bgcolor: "#0d1117",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: "0.5px solid #21262d",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.9rem",
            color: "#8b949e",
            letterSpacing: "0.15em",
          }}
        >
          TERMINAL
        </Typography>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          px: 2,
          pt: 1.5,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#6e7681",
            borderRadius: "2px",
          },
        }}
      >
        {state.terminalMessages.map((msg, index) => (
          <MessageRow
            key={msg.id}
            message={msg}
            isLast={index === state.terminalMessages.length - 1}
          />
        ))}
      </Box>

      <Box
        sx={{ borderTop: "0.5px solid #21262d", py: 1, px: 2, flexShrink: 0 }}
      >
        <Typography
          sx={{
            color: "#3fb950",
            fontSize: "0.75rem",
            fontFamily: "monospace",
          }}
        >
          ▶
        </Typography>
      </Box>

      {state.activeMessage && (
        <ActiveMessageModal message={state.activeMessage} />
      )}
    </Box>
  );
}
