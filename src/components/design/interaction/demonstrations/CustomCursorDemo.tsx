
import { motion } from "framer-motion";
import { Hand } from "lucide-react";

interface CustomCursorDemoProps {
  interactionConfig: any;
  isDemonstrating: boolean;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CustomCursorDemo = ({ 
  interactionConfig, 
  isDemonstrating, 
  handleMouseMove 
}: CustomCursorDemoProps) => {
  return (
    <div 
      className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="text-center text-gray-500">
        {isDemonstrating ? "Move your mouse in this area" : "Click 'Demonstrate' to start"}
      </div>
      
      {isDemonstrating && (
        <motion.div 
          className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white"
          {...interactionConfig}
        >
          <Hand className="h-6 w-6" />
        </motion.div>
      )}
    </div>
  );
};

export default CustomCursorDemo;
