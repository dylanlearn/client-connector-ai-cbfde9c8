
import React from "react";

export function getSiteTypeName(siteType: string): string {
  switch (siteType) {
    case "saas":
      return "SaaS Product";
    case "ecommerce":
      return "E-Commerce";
    case "business":
      return "Business Website";
    case "portfolio":
      return "Portfolio";
    default:
      return "Website";
  }
}
