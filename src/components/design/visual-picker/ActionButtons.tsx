
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ActionButtonsProps {
  handleLike: () => void;
  handleDislike: () => void;
  currentIndex: number;
  optionsLength: number;
  restartSwiping: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleLike,
  handleDislike,
  currentIndex,
  optionsLength,
  restartSwiping,
}) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
            onClick={handleDislike}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
            onClick={handleLike}
          >
            <Check className="h-6 w-6 text-green-500" />
          </Button>
        </motion.div>
      </div>
      
      {currentIndex === optionsLength - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={restartSwiping}
            className="mt-4"
          >
            See options again
          </Button>
        </motion.div>
      )}
    </>
  );
};
