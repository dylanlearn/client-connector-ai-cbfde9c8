
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IntakeFormData } from "@/types/intake-form";

interface CompletionStepProps {
  formData: IntakeFormData;
  onComplete: () => void;
  onPrevious: () => void;
}

const CompletionStep = ({ formData, onComplete, onPrevious }: CompletionStepProps) => {
  const getSiteTypeName = (type: string) => {
    switch (type) {
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
  };

  const getDesignStyleName = (style: string) => {
    switch (style) {
      case "minimal":
        return "Minimal & Modern";
      case "bold":
        return "Bold & Dynamic";
      case "classic":
        return "Professional & Classic";
      case "custom":
        return "Custom Design";
      default:
        return "Not specified";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Review Your Responses</h3>
        <p className="text-gray-600">
          Please review your responses before submitting. You can go back to make changes if needed.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium text-lg mb-3">Project Basics</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Project Type:</dt>
                <dd className="font-medium">{getSiteTypeName(formData.siteType || "")}</dd>
              </div>
              {formData.projectName && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Project Name:</dt>
                  <dd className="font-medium">{formData.projectName}</dd>
                </div>
              )}
              {formData.launchDate && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Expected Launch:</dt>
                  <dd className="font-medium">{formData.launchDate}</dd>
                </div>
              )}
            </dl>
            
            {formData.projectDescription && (
              <>
                <Separator className="my-3" />
                <div>
                  <dt className="text-gray-500 mb-1">Project Description:</dt>
                  <dd className="text-sm">{formData.projectDescription}</dd>
                </div>
              </>
            )}
            
            {formData.targetAudience && (
              <>
                <Separator className="my-3" />
                <div>
                  <dt className="text-gray-500 mb-1">Target Audience:</dt>
                  <dd className="text-sm">{formData.targetAudience}</dd>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium text-lg mb-3">Specific Requirements</h4>
            <dl className="space-y-3">
              {formData.mainFeatures && (
                <div>
                  <dt className="text-gray-500 mb-1">Main Features:</dt>
                  <dd className="text-sm">{formData.mainFeatures}</dd>
                </div>
              )}
              
              {formData.competitors && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Competitors/Inspiration:</dt>
                    <dd className="text-sm">{formData.competitors}</dd>
                  </div>
                </>
              )}
              
              {formData.siteType === "saas" && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">SaaS Details:</dt>
                    <dd className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>User Accounts: {formData.userAccountsRequired ? "Yes" : "No"}</li>
                        {formData.pricingTiers && <li>Pricing Tiers: {formData.pricingTiers}</li>}
                        <li>Free Trial: {formData.freeTrialOffered ? "Yes" : "No"}</li>
                      </ul>
                    </dd>
                  </div>
                </>
              )}
              
              {formData.siteType === "ecommerce" && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">E-Commerce Details:</dt>
                    <dd className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.estimatedProducts && <li>Products: {formData.estimatedProducts}</li>}
                        {formData.paymentProcessors && <li>Payment: {formData.paymentProcessors}</li>}
                        <li>Shipping Calculation: {formData.shippingIntegration ? "Yes" : "No"}</li>
                      </ul>
                    </dd>
                  </div>
                </>
              )}
              
              {formData.siteType === "business" && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Business Website Details:</dt>
                    <dd className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.serviceOfferings && <li>Services: {formData.serviceOfferings}</li>}
                        <li>Contact Form: {formData.contactFormRequired ? "Yes" : "No"}</li>
                        <li>Physical Location: {formData.hasPhysicalLocation ? "Yes" : "No"}</li>
                      </ul>
                    </dd>
                  </div>
                </>
              )}
              
              {formData.siteType === "portfolio" && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Portfolio Details:</dt>
                    <dd className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.projectCategories && <li>Categories: {formData.projectCategories}</li>}
                        {formData.contactInformation && <li>Contact Info: {formData.contactInformation}</li>}
                        <li>Resume/CV: {formData.resumeUploadRequired ? "Yes" : "No"}</li>
                      </ul>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium text-lg mb-3">Design Preferences</h4>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-500">Design Style:</dt>
                <dd className="font-medium">{getDesignStyleName(formData.designStyle || "")}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-gray-500">Have Logo:</dt>
                <dd className="font-medium">{formData.logoUpload ? "Yes" : "No"}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-gray-500">Existing Brand Guidelines:</dt>
                <dd className="font-medium">{formData.existingBranding ? "Yes" : "No"}</dd>
              </div>
              
              {formData.colorPreferences && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Color Preferences:</dt>
                    <dd className="text-sm">{formData.colorPreferences}</dd>
                  </div>
                </>
              )}
              
              {formData.inspiration && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Inspiration:</dt>
                    <dd className="text-sm">{formData.inspiration}</dd>
                  </div>
                </>
              )}
              
              {formData.additionalNotes && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <dt className="text-gray-500 mb-1">Additional Notes:</dt>
                    <dd className="text-sm">{formData.additionalNotes}</dd>
                  </div>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onComplete}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
