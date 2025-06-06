
import { useContext } from "react";
import { AIContext } from "./AIContext";

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === null) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
