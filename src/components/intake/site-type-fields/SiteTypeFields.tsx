
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
  aiPowered?: boolean;
}

/**
 * A component that renders the appropriate fields based on the site type
 */
const SiteTypeFields = ({ siteType, form, showTooltips = false, aiPowered = false }: SiteTypeFieldsProps) => {
  switch (siteType) {
    case "saas":
      return <SaasFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />;
    case "ecommerce":
      return <EcommerceFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />;
    case "business":
      return <BusinessFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />;
    case "portfolio":
      return <PortfolioFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />;
    default:
      return <BaseFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />;
  }
};

export default SiteTypeFields;
