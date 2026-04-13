import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 360,
  margin: "auto",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  overflow: "hidden",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    transform: "translateY(-12px)",
    background: "rgba(255, 255, 255, 0.1)",
    borderColor: "#3b82f6",
    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  transition: "transform 0.6s ease",
  '&:hover': {
    transform: "scale(1.1)",
  },
});

const StyledCardContent = styled(CardContent)({
  padding: "2rem",
  textAlign: "center",
  background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
});

const StyledTypographyTitle = styled(Typography)({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "1.6rem",
  fontWeight: 700,
  marginBottom: "1rem",
  color: "#fff",
  letterSpacing: "-0.02em",
});

const StyledTypographyBody = styled(Typography)({
  fontFamily: "'Inter', sans-serif",
  fontSize: "1rem",
  lineHeight: "1.6",
  color: "rgba(255, 255, 255, 0.7)",
});

const CustomCard = ({ image, title, body }) => {
  return (
    <StyledCard>
      <Box sx={{ overflow: 'hidden' }}>
        <StyledCardMedia component="img" image={image} alt={title} />
      </Box>
      <StyledCardContent>
        <StyledTypographyTitle variant="h5">
          {title}
        </StyledTypographyTitle>
        <StyledTypographyBody variant="body2">
          {body}
        </StyledTypographyBody>
      </StyledCardContent>
    </StyledCard>
  );
};

const CardGrid = ({ cards = []}) => {
  return (
    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
      gap: "40px", 
      padding: "40px 20px",
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      {cards.map((card, index) => (
        <CustomCard key={index} {...card} />
      ))}
    </Box>
  );
};

export default CardGrid;
