
import React from "react";
import { 
  Layout, 
  Image, 
  Type, 
  Navigation, 
  Users, 
  CheckSquare, 
  Mail, 
  CreditCard,
  MessageCircle
} from "lucide-react";

export const getSectionIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "hero":
      return <Layout />;
    case "features":
      return <CheckSquare />;
    case "testimonials":
      return <Users />;
    case "gallery":
    case "portfolio":
      return <Image />;
    case "contact":
      return <Mail />;
    case "pricing":
      return <CreditCard />;
    case "faq":
      return <MessageCircle />;
    default:
      return <Type />;
  }
};

export const getSectionComponent = (sectionType: string, sectionIndex: number) => {
  // Dynamic import based on section type
  const sectionModule = `../sections/${sectionType}Section`;
  return { sectionModule, sectionIndex };
};
