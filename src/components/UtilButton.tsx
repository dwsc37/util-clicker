import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { ACTIONS } from "../store/reducer";
import { useGame } from "../context/GameContext";
import { formatUtils } from "../utils/format";
import { useAudio } from "../context/AudioContext";

export function UtilButton() {
  const { state, dispatch } = useGame();
  const angleRef = useRef(0);
  const crankRef = useRef<SVGGElement>(null);
  const { playCrank } = useAudio();

  function handleClick() {
    playCrank();
    dispatch({ type: ACTIONS.CLICK });
    angleRef.current += 45;
    if (crankRef.current) {
      crankRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          all: "unset",
          cursor: "pointer",
          display: "block",
          borderRadius: "50%",
          transition: "opacity 80ms ease",
          "&:hover": { opacity: 0.85 },
        }}
      >
        <svg
          viewBox="0 0 160 160"
          width="160"
          height="160"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="#d0d5dc"
            stroke="#9aa0a8"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#3a4a3a"
            strokeWidth="2.5"
          />
          <g
            ref={crankRef}
            style={{
              transformOrigin: "80px 80px",
              transition: "transform 120ms ease-out",
            }}
          >
            <rect x="77" y="26" width="6" height="46" rx="3" fill="#3a4a3a" />
            <circle
              cx="80"
              cy="26"
              r="9"
              fill="#d0d5dc"
              stroke="#3a4a3a"
              strokeWidth="2"
            />
            <circle cx="80" cy="26" r="4" fill="#3a4a3a" />
          </g>
          <circle cx="80" cy="80" r="11" fill="#3a4a3a" />
          <circle cx="80" cy="80" r="5" fill="#d0d5dc" />
        </svg>
      </Box>

      <Typography
        variant="overline"
        sx={{
          color: "text.secondary",
          fontSize: "1rem",
        }}
      >
        Turn the crank
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "1rem",
        }}
      >
        {formatUtils(state.utilsPerClick)} utils per click
      </Typography>
    </Box>
  );
}
