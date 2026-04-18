import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGame } from "../context/GameContext";
import { ACTIONS, type TerminalMessage } from "../store/reducer";

function useTypewriter(text: string, tickInterval = 25) {
  const [displayed, setDisplayed] = useState("");
  const [finished, setFinished] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setFinished(false);
    indexRef.current = 0;

    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(id);
        setFinished(true);
      }
    }, tickInterval);

    return () => clearInterval(id);
  }, [text]);

  return { displayed, finished };
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
function ActiveMessageModal({ message }: { message: TerminalMessage }) {
  const { dispatch } = useGame();
  const { displayed, finished } = useTypewriter(message.text);
  const isQTE = !!message.qteChoices;

  function handleAcknowledge() {
    dispatch({ type: ACTIONS.ACKNOWLEDGE_MESSAGE });
  }

  function handleResolve(choiceIndex: 0 | 1) {
    dispatch({ type: ACTIONS.RESOLVE_QTE, payload: { choiceIndex } });
  }

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
          borderColor: isQTE ? "#e3b341" : "#3fb950",

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
              fontSize: "0.75rem",
              color: "#3fb950",
            }}
          >
            SYSTEM
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              color: "#8b949e",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.95rem",
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
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    color: "#e3b341",
                    mb: 1.5,
                    letterSpacing: "0.08em",
                  }}
                >
                  ▲ INPUT REQUIRED
                </Typography>

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
              <>
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
                    "&:hover": {
                      bgcolor: "rgba(63,185,80,0.1)",
                    },
                  }}
                >
                  CONTINUE
                </Button>
              </>
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
            fontSize: "0.75rem",
            color: "#3fb950",
            flexShrink: 0,
          }}
        >
          SYSTEM
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#8b949e",
            flexShrink: 0,
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: "monospace",
          fontSize: "0.8rem",
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
            fontSize: "0.8rem",
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
            animation: "blink 2s step-end infinite",
            "@keyframes blink": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.75 },
            },
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
