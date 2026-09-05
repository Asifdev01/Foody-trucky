import React from "react";
import { Chip } from "@mui/material";
import { status as statusColors } from "../../theme";

/**
 * Color-coded status badge for donation lifecycle states
 * (Pending / Accepted / Distributed / Rejected / Expired).
 * Central place for status → color mapping so every page (admin table,
 * donor dashboard, charity dashboard) reads the same colors.
 */
const StatusChip = ({ status, size = "small", sx }) => {
  const palette = statusColors[status] || statusColors.Pending;

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: palette.bg,
        color: palette.color,
        ...sx,
      }}
    />
  );
};

export default StatusChip;
