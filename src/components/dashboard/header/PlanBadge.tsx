
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
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
      >
        <Crown size={12} className="mr-1" />
        Pro Plan
      </motion.div>
    );
  }
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
