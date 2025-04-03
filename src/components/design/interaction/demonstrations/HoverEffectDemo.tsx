
import { motion } from "framer-motion";
import { HoverEffectConfig } from "../interactionConfigs";

interface HoverEffectDemoProps {
  interactionConfig: HoverEffectConfig;
}

const HoverEffectDemo = ({ interactionConfig }: HoverEffectDemoProps) => {
  return (
    <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="bg-white p-6 rounded-lg w-3/4"
        {...interactionConfig}
      >
        <div className="w-full h-4 bg-gray-200 rounded-full mb-3" />
        <div className="w-5/6 h-4 bg-gray-200 rounded-full mb-3" />
        <div className="w-4/6 h-4 bg-gray-200 rounded-full" />
      </motion.div>
    </div>
  );
};

export default HoverEffectDemo;
