
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DesignOption } from "../AnimatedVisualPicker";

// Animation preview demos for the design card
export const renderAnimationPreviewDemo = (option: DesignOption) => {
  switch (option.id) {
    case "animation-1":
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center w-32 h-32"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"/>
          <div className="w-full h-2 bg-gray-200 rounded-full"/>
          <div className="w-4/5 h-2 bg-gray-200 rounded-full"/>
        </motion.div>
      );
    case "animation-2":
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center w-32 h-32"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"/>
          <div className="w-full h-2 bg-gray-200 rounded-full"/>
          <div className="w-4/5 h-2 bg-gray-200 rounded-full"/>
        </motion.div>
      );
    case "animation-3":
      return (
        <div className="relative h-full w-32">
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: -10 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-x-0 top-8 bg-indigo-100 h-16 rounded-t-lg"
          />
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: -5 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            className="absolute inset-x-4 top-12 bg-white p-4 rounded-lg shadow-lg z-10"
          >
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2"/>
            <div className="w-3/4 h-2 bg-gray-200 rounded-full"/>
          </motion.div>
        </div>
      );
    case "animation-4":
      return (
        <motion.div 
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ perspective: 1000 }}
          className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center"
        >
          <span className="text-white font-medium">3D</span>
        </motion.div>
      );
    case "animation-5":
      return (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md"
        >
          Hover Me
        </motion.button>
      );
    case "animation-6":
      return (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-xl shadow-lg flex items-center justify-center text-white"
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Magnetic</span>
          </motion.div>
        </div>
      );
    case "animation-7":
      return (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-400 shadow-lg flex items-center justify-center text-white"
            initial={{ borderRadius: "16px" }}
            animate={{ borderRadius: ["16px", "50%", "16px"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Morph</span>
          </motion.div>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Preview
          </div>
        </div>
      );
  }
};

// Interaction preview demo component
export const InteractionPreviewDemo: React.FC<{
  currentOption: DesignOption;
  isPreviewVisible: boolean;
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ currentOption, isPreviewVisible, setIsPreviewVisible }) => {
  const [hovering, setHovering] = useState(false);

  switch (currentOption.id) {
    case "interaction-1":
      return (
        <motion.div 
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 w-full max-w-xs"
        >
          <div className="w-full h-3 bg-gray-200 rounded-full"/>
          <div className="w-4/5 h-3 bg-gray-200 rounded-full"/>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {hovering ? "Hovering!" : "Hover me"}
          </p>
        </motion.div>
      );
    case "interaction-2":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewVisible(!isPreviewVisible);
            }}
          >
            {isPreviewVisible ? "Close Modal" : "Open Modal"}
          </Button>
          
          <AnimatePresence>
            {isPreviewVisible && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPreviewVisible(false);
                }}
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white p-3 rounded-lg shadow-lg w-4/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2"/>
                  <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-3"/>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPreviewVisible(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Interaction Preview</div>
        </div>
      );
  }
};
