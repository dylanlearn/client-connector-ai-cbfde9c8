
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

interface PlanBadgeProps {
  isPro: boolean;
}

export const PlanBadge = ({ isPro }: PlanBadgeProps) => {
  const navigate = useNavigate();
  
  if (isPro) {
    return (
      <div className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
        <Crown size={12} className="mr-1" />
        Sync Pro
      </div>
    );
  }
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button 
        variant="outline" 
        size="sm" 
        className="hidden md:flex items-center gap-1 text-xs"
        onClick={() => navigate("/settings")}
      >
        <Crown size={12} className="mr-1" />
        Upgrade
      </Button>
    </motion.div>
  );
};
