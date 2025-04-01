
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const HeaderNavLinks = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/new-project", label: "New Project" },
    { path: "/ai-design-suggestions", label: "AI Assistant" },
  ];
  
  return (
    <nav className="hidden md:flex gap-4 md:gap-6 text-sm">
      {navLinks.map((link) => (
        <motion.div key={link.path} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Link
            to={link.path}
            className={`hover:text-primary transition-colors ${
              location.pathname === link.path ? "text-primary font-medium" : "text-muted-foreground"
            }`}
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};
