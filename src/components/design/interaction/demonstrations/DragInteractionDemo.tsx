
import { motion } from "framer-motion";

interface DragInteractionDemoProps {
  interactionConfig: any;
  isActive: boolean;
}

const DragInteractionDemo = ({ interactionConfig, isActive }: DragInteractionDemoProps) => {
  return (
    <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="w-3/4 h-1 bg-gray-300 rounded-full"></div>
      <motion.div 
        className="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-xs text-center p-1"
        {...interactionConfig}
      >
        {isActive ? "Drag me!" : "Activate first"}
      </motion.div>
    </div>
  );
};

export default DragInteractionDemo;
