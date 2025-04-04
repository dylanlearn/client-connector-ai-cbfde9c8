
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, ChevronLeft, Check, Lightbulb, Wand2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useDesignMemory } from "@/hooks/ai-design/useDesignMemory";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface AIDesignSuggestionDemoProps {
  isActive: boolean;
}

const AIDesignSuggestionDemo = ({ isActive }: AIDesignSuggestionDemoProps) => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showPromptTips, setShowPromptTips] = useState(false);
  const [suggestionId, setSuggestionId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { 
    results: memorySuggestions, 
    queryDesignPatterns, 
    submitFeedback, 
    storeSuggestion 
  } = useDesignMemory();

  // Sample design suggestions
  const suggestions = [
    {
      title: "Bold, Minimal Layout",
      description: "Clean hero section with strong typography and accent colors to draw attention to your call-to-action.",
      colorPalette: ["#2563EB", "#F97316", "#F3F4F6", "#1F2937"],
      imageUrl: "public/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png",
      promptTags: ["#minimal", "#bold", "#highContrast"]
    },
    {
      title: "Premium Editorial Style",
      description: "Sophisticated typography with generous whitespace creates a premium feel for content-focused sites.",
      colorPalette: ["#0F172A", "#E2E8F0", "#7C3AED", "#FBBF24"],
      imageUrl: "public/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png",
      promptTags: ["#editorial", "#sophisticated", "#premium"]
    },
    {
      title: "Modern 3D Elements",
      description: "Incorporate subtle 3D elements with gradient backgrounds for a contemporary tech aesthetic.",
      colorPalette: ["#0EA5E9", "#6366F1", "#F8FAFC", "#334155"],
      imageUrl: "public/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png",
      promptTags: ["#3D", "#tech", "#modern"]
    },
  ];

  // Prompt design tips
  const promptTips = [
    "Use visual style tags like #minimal or #bold to guide AI design suggestions",
    "Specify color needs with descriptors like 'high contrast' or 'muted tones'",
    "Mention specific layout needs: 'card-based gallery' or 'sticky sidebar'",
    "Include industry context: 'SaaS dashboard' or 'luxury e-commerce'",
    "Request specific components: 'animated testimonial carousel' or 'floating contact form'"
  ];

  // Query design memory when component becomes active
  useEffect(() => {
    if (isActive) {
      queryDesignPatterns({
        limit: 10,
        relevance_threshold: 0.6
      });
    }
  }, [isActive, queryDesignPatterns]);

  // Store suggestion in history when viewed
  useEffect(() => {
    if (isActive && user?.id && !suggestionId) {
      const currentItem = suggestions[currentSuggestion];
      storeSuggestion(
        currentItem.promptTags.join(" "), 
        {
          title: currentItem.title,
          description: currentItem.description,
          colorPalette: currentItem.colorPalette,
          imageUrl: currentItem.imageUrl
        },
        [],
        { source: "demo" }
      ).then(id => {
        if (id) setSuggestionId(id);
      });
    }
  }, [isActive, currentSuggestion, user, storeSuggestion, suggestionId]);

  // Auto-cycle through suggestions when active
  useEffect(() => {
    let interval: number;
    
    if (isActive && isAutoplay) {
      interval = window.setInterval(() => {
        setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
        setSuggestionId(null); // Reset suggestion ID when changing suggestions
      }, 4000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isAutoplay, suggestions.length]);

  // Set autoplay after a delay when active
  useEffect(() => {
    let timeout: number;
    
    if (isActive) {
      timeout = window.setTimeout(() => {
        setIsAutoplay(true);
      }, 2000);
    } else {
      setIsAutoplay(false);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isActive]);

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    setSuggestionId(null); // Reset suggestion ID when changing suggestions
  };

  const prevSuggestion = () => {
    setCurrentSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    setSuggestionId(null); // Reset suggestion ID when changing suggestions
  };

  const togglePromptTips = () => {
    setShowPromptTips(!showPromptTips);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (!user?.id || !suggestionId) {
      toast.error("Please sign in to provide feedback");
      return;
    }

    submitFeedback(
      suggestionId,
      type,
      undefined,
      type === 'like' ? 5 : 1
    ).then(success => {
      if (success) {
        toast.success(type === 'like' ? "Thanks for the positive feedback!" : "Thanks for your feedback!");
      }
    });
  };

  const currentItem = suggestions[currentSuggestion];

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col relative"
          >
            {/* Header with lightbulb icon */}
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-2 flex items-center justify-between text-white"
              initial={{ y: -40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium">AI Design Suggestion</span>
              </div>
              <motion.button
                onClick={togglePromptTips}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs flex items-center bg-white/20 px-2 py-1 rounded-sm hover:bg-white/30"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                <span>Prompt Tips</span>
              </motion.button>
            </motion.div>

            {/* Prompt tips panel */}
            <AnimatePresence>
              {showPromptTips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-10 left-0 right-0 bg-indigo-50 border-b border-indigo-100 p-3 z-10"
                >
                  <h4 className="text-xs font-semibold text-indigo-900 mb-1.5">Better Prompt Design Tips:</h4>
                  <ul className="text-xs text-indigo-700 space-y-1">
                    {promptTips.map((tip, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-start"
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 mt-1.5 mr-1.5"></span>
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div 
                    className="w-full text-center mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button 
                      onClick={togglePromptTips} 
                      className="text-indigo-600 text-xs hover:text-indigo-800 font-medium"
                    >
                      Close Tips
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestion content */}
            <motion.div 
              className="flex-1 flex items-center justify-center p-6 pt-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSuggestion}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                  {/* Image preview */}
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border shadow-sm bg-white">
                    <motion.div
                      className="w-full h-full"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img 
                        src={currentItem.imageUrl} 
                        alt={currentItem.title} 
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </motion.div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <motion.h3
                      className="font-medium text-base mb-1"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentItem.title}
                    </motion.h3>
                    <motion.p
                      className="text-xs text-gray-600 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {currentItem.description}
                    </motion.p>
                    
                    {/* Prompt tags */}
                    <motion.div
                      className="flex flex-wrap gap-1 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {currentItem.promptTags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-sm"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                    
                    {/* Color palette */}
                    <motion.div
                      className="flex gap-1 mt-1"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {currentItem.colorPalette.map((color, index) => (
                        <motion.div
                          key={color}
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Feedback and navigation controls */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {/* Feedback buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeedback('like')}
                  className="w-6 h-6 rounded-full border flex items-center justify-center bg-white/70 text-green-600 hover:bg-white"
                >
                  <ThumbsUp className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeedback('dislike')}
                  className="w-6 h-6 rounded-full border flex items-center justify-center bg-white/70 text-red-600 hover:bg-white"
                >
                  <ThumbsDown className="h-3 w-3" />
                </motion.button>
              </div>

              {/* Dots indicator */}
              <div className="flex gap-1 justify-center flex-1">
                {suggestions.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentSuggestion ? 'bg-indigo-500' : 'bg-gray-300'}`}
                    whileHover={{ scale: 1.2 }}
                    animate={index === currentSuggestion ? { scale: [1, 1.2, 1] } : {}}
                    transition={index === currentSuggestion ? { duration: 1, repeat: Infinity } : {}}
                  />
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSuggestion}
                  className="w-6 h-6 rounded-full border flex items-center justify-center bg-white/70 text-gray-700 hover:bg-white"
                >
                  <ChevronLeft className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSuggestion}
                  className="w-6 h-6 rounded-full border flex items-center justify-center bg-white/70 text-gray-700 hover:bg-white"
                >
                  <ChevronRight className="h-3 w-3" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="default-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-12 w-12 text-indigo-300 mb-4" />
            </motion.div>
            <h3 className="font-medium text-gray-600 mb-2">Experience Interactive Design Suggestions</h3>
            <p className="text-sm text-gray-400">Click "Demonstrate" to see AI-powered design recommendations</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background decorations */}
      <motion.div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/20 to-purple-200/20 blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-200/20 to-purple-200/20 blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
};

export default AIDesignSuggestionDemo;
