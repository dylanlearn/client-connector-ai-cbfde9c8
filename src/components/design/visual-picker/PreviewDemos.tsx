
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";
import { DesignOption } from "../AnimatedVisualPicker";

// Animation Previews
export const renderAnimationPreviewDemo = (currentOption: DesignOption) => {
  switch (currentOption.id) {
    case "animation-1":
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"/>
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
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"/>
          <div className="w-full h-2 bg-gray-200 rounded-full"/>
          <div className="w-4/5 h-2 bg-gray-200 rounded-full"/>
        </motion.div>
      );
    case "animation-3":
      return (
        <div className="relative h-full">
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: -20 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-x-0 top-0 bg-indigo-100 h-16 rounded-t-lg"
          />
          <motion.div 
            initial={{ y: 10 }}
            animate={{ y: -10 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            className="absolute inset-x-8 top-8 bg-white p-4 rounded-lg shadow-lg z-10"
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
          className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg"
        />
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
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg flex items-center justify-center">
          <div className="h-10 w-10 text-gray-400">✨</div>
        </div>
      );
  }
};

// Interaction Preview component with modal state
export const InteractionPreviewDemo = ({ 
  currentOption, 
  isPreviewVisible, 
  setIsPreviewVisible 
}: { 
  currentOption: DesignOption, 
  isPreviewVisible: boolean, 
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>> 
}) => {
  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  switch (currentOption.id) {
    case "interaction-1":
      return (
        <motion.div 
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          }}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 w-full"
        >
          <div className="w-full h-3 bg-gray-200 rounded-full"/>
          <div className="w-4/5 h-3 bg-gray-200 rounded-full"/>
          <p className="text-xs text-gray-400 mt-2 text-center">Hover me</p>
        </motion.div>
      );
    case "interaction-2":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePreview();
            }}
          >
            Open Modal
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
    case "interaction-3":
      return (
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ x: [-10, 10], y: [-5, 5] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white"
          >
            <MousePointer className="h-4 w-4" />
          </motion.div>
          <p className="text-xs text-gray-500">Custom cursor follow effect</p>
        </div>
      );
    case "interaction-4":
      return (
        <div className="w-full flex flex-col gap-2 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-4 bg-gray-200 rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-4/5 h-4 bg-gray-200 rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-3/5 h-4 bg-gray-200 rounded-full"
          />
          <p className="text-xs text-gray-400 mt-2">Scroll reveal elements</p>
        </div>
      );
    case "interaction-5":
      return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full flex items-center justify-center">
          <motion.div 
            drag
            dragConstraints={{
              top: -20,
              left: -20,
              right: 20,
              bottom: 20,
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs cursor-grab active:cursor-grabbing"
          >
            Drag me
          </motion.div>
        </div>
      );
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg flex items-center justify-center">
          <MousePointer className="h-10 w-10 text-gray-400" />
        </div>
      );
  }
};
