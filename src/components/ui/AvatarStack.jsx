import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

/**
 * Overlapping avatar cluster used for trust signals near hero sections
 * (e.g. "50+ donors already on board"). Pass `avatars` (array of {src, alt})
 * and optionally `label` for the trailing caption.
 */
const AvatarStack = ({ avatars = [], max = 4, label, sx }) => {
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ...sx }}>
      <Box sx={{ display: "flex" }}>
        {shown.map((avatar, i) => (
          <Avatar
            key={avatar.src || i}
            src={avatar.src}
            alt={avatar.alt || ""}
            sx={{
              width: 36,
              height: 36,
              border: "2px solid",
              borderColor: "background.paper",
              ml: i === 0 ? 0 : -1.25,
            }}
          />
        ))}
        {overflow > 0 && (
          <Avatar
            sx={{
              width: 36,
              height: 36,
              border: "2px solid",
              borderColor: "background.paper",
              ml: -1.25,
              bgcolor: "secondary.main",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            +{overflow}
          </Avatar>
        )}
      </Box>
      {label && (
        <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default AvatarStack;
