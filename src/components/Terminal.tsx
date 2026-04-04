import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGame } from "../context/GameContext";
import { ACTIONS, type TerminalMessage } from "../store/reducer";
import { type QTEEvent } from "../data/events";

function useTypewriter(
  text: string,
  onFinished: () => void,
  scrollRef: React.RefObject<HTMLDivElement | null>,
  tickInterval = 30,
) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;

    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(id);
        onFinished?.();
      }
      if (scrollRef?.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, tickInterval);

    return () => clearInterval(id);
  }, []);

  return displayed;
}

function MessageRow({
  message,
  isLast,
  onFinished,
  scrollRef,
}: {
  message: TerminalMessage;
  isLast: boolean;
  onFinished: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const text = message.isNew
    ? useTypewriter(message.text, onFinished, scrollRef)
    : message.text;

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "baseline", mb: 0.3 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#3fb950",
            flexShrink: 0,
          }}
        >
          {"SYSTEM"}
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
          color: message.isNew || isLast ? "#e6edf3" : "#6e7681",
          lineHeight: 1.65,
        }}
      >
        {text}
        {message.isNew && (
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: "7px",
              height: "12px",
              bgcolor: "#3fb950",
              ml: "2px",
              verticalAlign: "middle",
            }}
          />
        )}
      </Typography>
    </Box>
  );
}

function QTEPanel({ qte }: { qte: QTEEvent }) {
  const { dispatch } = useGame();

  return (
    <Box
      sx={{
        mb: 1,
        pt: 1,
      }}
    >
      <Typography
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          color: "#e3b341",
          mb: 1.5,
          letterSpacing: "0.08em",
        }}
      >
        ▲ INPUT REQUIRED
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {qte.choices.map((choice, i) => (
          <Button
            key={i}
            onClick={() =>
              dispatch({
                type: ACTIONS.RESOLVE_QTE,
                payload: { choiceIndex: i as 0 | 1 },
              })
            }
            sx={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              color: i === 0 ? "#3fb950" : "#f85149",
              border: "0.5px solid",
              borderColor: i === 0 ? "#3fb950" : "#f85149",
              borderRadius: "2px",
              px: 1.5,
              py: 0.5,
              "&:hover": {
                bgcolor:
                  i === 0 ? "rgba(63,185,80,0.1)" : "rgba(248,81,73,0.1)",
              },
            }}
          >
            [{i === 0 ? "Y" : "N"}] {choice.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export function Terminal() {
  const { state, dispatch } = useGame();
  const scrollRef = useRef<HTMLDivElement>(null);

  // small hack because qte panel is larger and would mess up the scroll
  // since qte is rendered whenever last message is no longer new, this will trigger a scroll to the bottom
  // right as the qte renders
  // note that the similar scroll in typewriter is still needed because that scrolls as the message is typing
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.terminalMessages]);

  function handleMessageFinished(messageId: string) {
    dispatch({ type: ACTIONS.MARK_MESSAGE_READ, payload: { messageId } });
  }

  return (
    <Box
      sx={{
        bgcolor: "#0d1117",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
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
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#6e7681",
            borderRadius: "2px",
          },
        }}
      >
        {state.terminalMessages.map((msg, index) => {
          if (index != 0 && state.terminalMessages[index - 1].isNew) {
            return null;
          }
          return (
            <MessageRow
              key={msg.id}
              isLast={index === state.terminalMessages.length - 1}
              message={msg}
              onFinished={() => handleMessageFinished(msg.id)}
              scrollRef={scrollRef}
            />
          );
        })}
        {state.activeQTE &&
          !state.terminalMessages.find((m) => m.id === state.activeQTE?.id)
            ?.isNew && <QTEPanel qte={state.activeQTE} />}
      </Box>

      <Box
        sx={{
          borderTop: "0.5px solid #21262d",
          py: 1,
          px: 2,
          flexShrink: 0,
          alignItems: "center",
        }}
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
    </Box>
  );
}
