
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWireframeGenerator } from "./wireframe/use-wireframe-generator";
import { useWireframeStorage } from "./wireframe/use-wireframe-storage";
import { useWireframeFeedback } from "./wireframe/use-wireframe-feedback";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe
} from "@/services/ai/wireframe/wireframe-types";

export function useWireframeGeneration() {
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const { toast } = useToast();

  // Use the extracted hooks
  const { 
    isGenerating, 
    error,
    generateWireframe,
    generateCreativeVariation 
  } = useWireframeGenerator(creativityLevel, setCurrentWireframe, toast);

  const {
    loadProjectWireframes,
    getWireframe
  } = useWireframeStorage(setWireframes, toast);

  const {
    provideFeedback,
    deleteWireframe
  } = useWireframeFeedback(wireframes, setWireframes, toast);

  return {
    isGenerating,
    wireframes,
    currentWireframe,
    error,
    creativityLevel,
    generateWireframe,
    generateCreativeVariation,
    setCreativityLevel,
    loadProjectWireframes,
    getWireframe,
    provideFeedback,
    deleteWireframe
  };
}
