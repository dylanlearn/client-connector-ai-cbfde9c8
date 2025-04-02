
import { UseFormReturn } from "react-hook-form";
import SaasFields from "../site-types/SaasFields";
import EcommerceFields from "../site-types/EcommerceFields";
import BusinessFields from "../site-types/BusinessFields";
import PortfolioFields from "../site-types/PortfolioFields";
import BaseFields from "../site-types/BaseFields";

interface SiteTypeFieldsProps {
  siteType: string;
  form: UseFormReturn<any>;
  showTooltips?: boolean;
}

/**
 * A component that renders the appropriate fields based on the site type
 */
const SiteTypeFields = ({ siteType, form, showTooltips = false }: SiteTypeFieldsProps) => {
  // Each component will only use the showTooltips prop if it supports it
  switch (siteType) {
    case "saas":
      return <SaasFields form={form} />;
    case "ecommerce":
      return <EcommerceFields form={form} />;
    case "business":
      return <BusinessFields form={form} />;
    case "portfolio":
      return <PortfolioFields form={form} />;
    default:
      return <BaseFields form={form} showTooltips={showTooltips} />;
  }
};

export default SiteTypeFields;
