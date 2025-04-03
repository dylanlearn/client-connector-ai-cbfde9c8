
import { motion } from "framer-motion";

interface ModalDialogDemoProps {
  interactionConfig: any;
  isActive: boolean;
}

const ModalDialogDemo = ({ interactionConfig, isActive }: ModalDialogDemoProps) => {
  return (
    <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-400 rounded" />
        </div>
      </div>
      
      {/* Modal overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/20 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-xs"
          {...interactionConfig}
        >
          <h4 className="font-medium mb-2">Modal Dialog</h4>
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-200 rounded-full" />
            <div className="w-5/6 h-3 bg-gray-200 rounded-full" />
          </div>
          <div className="flex justify-end mt-4">
            <div className="w-16 h-6 bg-blue-500 rounded-md" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModalDialogDemo;
