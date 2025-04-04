
import { createContext } from "react";
import { AIContextType } from "@/types/ai";

// Create AI context with proper typing
export const AIContext = createContext<AIContextType | undefined>(undefined);
