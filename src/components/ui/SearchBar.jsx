import React, { useState } from "react";
import { Box, InputBase, Button } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

/**
 * Pill-shaped search bar + dark rounded CTA button, matching the
 * search-and-go pattern from the landing page reference.
 */
const SearchBar = ({ placeholder = "Search...", onSearch, buttonLabel = "Search", sx }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.paper",
        borderRadius: 9999,
        border: "1px solid",
        borderColor: "divider",
        pl: 3,
        pr: 0.75,
        py: 0.75,
        gap: 1,
        boxShadow: "0 4px 20px rgba(36, 31, 27, 0.06)",
        ...sx,
      }}
    >
      <SearchIcon sx={{ color: "text.secondary" }} />
      <InputBase
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        fullWidth
        sx={{ fontSize: "0.95rem" }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: "text.primary",
          "&:hover": { bgcolor: "text.primary", filter: "brightness(1.15)" },
          whiteSpace: "nowrap",
        }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
};

export default SearchBar;
