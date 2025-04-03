
import { motion, AnimatePresence } from "framer-motion";
import { ModalDialogConfig } from "../interactionConfigs";

interface ModalDialogDemoProps {
  interactionConfig: ModalDialogConfig;
  isActive: boolean;
}

const ModalDialogDemo = ({ interactionConfig, isActive }: ModalDialogDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      {/* Trigger element */}
      <motion.div 
        className="absolute z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-md"
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
        whileTap={{ scale: 0.98 }}
        animate={{ 
          y: isActive ? -60 : 0,
          opacity: isActive ? 0.7 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="2" x2="9" y2="4" />
          <line x1="15" y1="2" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="22" />
          <line x1="15" y1="20" x2="15" y2="22" />
          <line x1="20" y1="9" x2="22" y2="9" />
          <line x1="20" y1="14" x2="22" y2="14" />
          <line x1="2" y1="9" x2="4" y2="9" />
          <line x1="2" y1="14" x2="4" y2="14" />
        </svg>
      </motion.div>
      
      {/* Background overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Modal content */}
      <motion.div 
        className="bg-white rounded-xl overflow-hidden w-4/5 max-w-xs shadow-2xl z-30"
        {...interactionConfig}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        style={{ 
          boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
          transformOrigin: "center" 
        }}
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4">
          <div className="flex justify-between items-center">
            <div className="h-2.5 w-20 bg-white/30 rounded-full" />
            <div className="flex space-x-1.5">
              <motion.div 
                className="w-3 h-3 rounded-full bg-white/40"
                whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.6)" }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-white/40"
                whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.6)" }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-white/40"
                whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.6)" }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="w-2/3 h-4 bg-gray-200 rounded-full" />
            <div className="w-full h-3 bg-gray-200 rounded-full" />
            <div className="w-5/6 h-3 bg-gray-200 rounded-full" />
            <div className="w-4/6 h-3 bg-gray-200 rounded-full" />
          </motion.div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <motion.div 
              className="h-8 w-16 rounded-md bg-gray-200"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
              whileTap={{ scale: 0.98 }}
            />
            <motion.div 
              className="h-8 w-20 rounded-md bg-gradient-to-r from-violet-500 to-purple-600"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-6 right-8 w-16 h-16 rounded-full bg-purple-200 opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ModalDialogDemo;
