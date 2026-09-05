import React from "react";
import { Box } from "@mui/material";

/**
 * Organic curved section divider (SVG wave) used instead of hard rectangular
 * section boundaries — drop between <section> blocks to break up the page.
 * `fill` should match the background color of the section BELOW the divider.
 */
const CurveDivider = ({ fill = "#FBF6EC", flip = false, height = 80 }) => (
  <Box
    sx={{
      lineHeight: 0,
      transform: flip ? "scaleY(-1)" : "none",
      backgroundColor: "transparent",
    }}
  >
    <svg
      viewBox="0 0 1440 120"
      width="100%"
      height={height}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,120 L0,120 Z"
        fill={fill}
      />
    </svg>
  </Box>
);

export default CurveDivider;
