
import { IntakeFormData } from "@/types/intake-form";
import { WireframeGenerationParams } from "@/services/ai/wireframe/wireframe-types";
import { DesignRecommendation } from "@/types/ai";

/**
 * Maps client questionnaire data to wireframe generation parameters
 * Serves as a bridge between the client intake process and wireframe generation
 */
export const QuestionnaireWireframeBridge = {
  /**
   * Transform intake form data into wireframe generation parameters
   */
  transformIntakeToWireframeParams(
    intakeData: IntakeFormData,
    designRecommendations?: DesignRecommendation | null
  ): WireframeGenerationParams {
    // Extract the industry/site type
    const industry = intakeData.siteType || 'business';
    
    // Determine style preferences from design data
    const style = intakeData.designStyle || 'minimal';
    
    // Determine complexity level based on features requested
    const hasComplexFeatures = Boolean(
      intakeData.userAccountsRequired || 
      intakeData.pricingTiers ||
      intakeData.shippingIntegration
    );
    
    // Build enhanced prompt from intake data
    const promptSegments = [
      `Create a wireframe for a ${industry} website with a ${style} design style.`,
      intakeData.projectDescription ? `Project description: ${intakeData.projectDescription}` : '',
      intakeData.targetAudience ? `Target audience: ${intakeData.targetAudience}` : '',
      intakeData.mainFeatures ? `Key features: ${intakeData.mainFeatures}` : '',
      intakeData.competitors ? `Similar to: ${intakeData.competitors}` : '',
    ].filter(Boolean);

    // Build moodboard selections
    const moodboardSelections: Record<string, string[]> = {};
    
    // Extract color preferences
    if (intakeData.colorPreferences) {
      moodboardSelections.colors = intakeData.colorPreferences
        .split(',')
        .map(color => color.trim())
        .filter(Boolean);
    } else if (designRecommendations?.colorPalette) {
      moodboardSelections.colors = designRecommendations.colorPalette
        .map(color => color.hex || color.name)
        .filter(Boolean);
    }

    // Extract typography preferences from design recommendations
    if (designRecommendations?.typography) {
      moodboardSelections.fonts = [
        designRecommendations.typography.headings,
        designRecommendations.typography.body
      ].filter(Boolean);
    }

    // Extract layout preferences from design recommendations
    if (designRecommendations?.layouts) {
      moodboardSelections.layoutPreferences = designRecommendations.layouts.slice(0, 3);
    }

    // Add tone based on design style
    if (intakeData.designStyle) {
      const toneMap: Record<string, string[]> = {
        'minimal': ['clean', 'simple', 'modern'],
        'bold': ['vibrant', 'dynamic', 'energetic'],
        'classic': ['traditional', 'elegant', 'professional'],
        'custom': []
      };
      
      moodboardSelections.tone = toneMap[intakeData.designStyle] || [];
      
      // Add custom tone for inspiration if available
      if (intakeData.designStyle === 'custom' && intakeData.inspiration) {
        moodboardSelections.tone = ['custom', 'inspired', 'personalized'];
      }
    }

    // Build business goals and features from intake data
    const intakeResponses: Record<string, any> = {};
    
    if (intakeData.projectDescription) {
      intakeResponses.businessGoals = intakeData.projectDescription;
    }
    
    if (intakeData.targetAudience) {
      intakeResponses.targetAudience = intakeData.targetAudience;
    }
    
    // Collect features based on site type
    const siteFeatures: string[] = [];
    
    // Common features
    if (intakeData.mainFeatures) {
      siteFeatures.push(...intakeData.mainFeatures.split(',').map(f => f.trim()));
    }
    
    // Type-specific features
    if (intakeData.siteType === 'ecommerce') {
      if (intakeData.estimatedProducts) siteFeatures.push('Product catalog');
      if (intakeData.paymentProcessors) siteFeatures.push('Payment processing');
      if (intakeData.shippingIntegration) siteFeatures.push('Shipping integration');
    } else if (intakeData.siteType === 'saas') {
      if (intakeData.userAccountsRequired) siteFeatures.push('User accounts');
      if (intakeData.pricingTiers) siteFeatures.push('Pricing tiers');
      if (intakeData.freeTrialOffered) siteFeatures.push('Free trial');
    } else if (intakeData.siteType === 'business') {
      if (intakeData.serviceOfferings) siteFeatures.push('Service offerings');
      if (intakeData.contactFormRequired) siteFeatures.push('Contact form');
      if (intakeData.hasPhysicalLocation) siteFeatures.push('Location map');
    } else if (intakeData.siteType === 'portfolio') {
      if (intakeData.projectCategories) siteFeatures.push('Project categories');
      if (intakeData.contactInformation) siteFeatures.push('Contact information');
      if (intakeData.resumeUploadRequired) siteFeatures.push('Resume section');
    }
    
    intakeResponses.siteFeatures = siteFeatures;

    // Build any additional instructions
    let additionalInstructions = '';
    
    if (intakeData.additionalNotes) {
      additionalInstructions += intakeData.additionalNotes;
    }
    
    if (intakeData.inspiration) {
      additionalInstructions += `\nInspired by: ${intakeData.inspiration}`;
    }
    
    // Create pages array based on site type
    const pages = ['home'];
    
    // Add common pages
    if (intakeData.contactFormRequired) pages.push('contact');
    
    // Add type-specific pages
    if (intakeData.siteType === 'ecommerce') {
      pages.push('products', 'cart', 'checkout');
    } else if (intakeData.siteType === 'saas') {
      pages.push('features', 'pricing');
      if (intakeData.freeTrialOffered) pages.push('signup');
    } else if (intakeData.siteType === 'business') {
      pages.push('services', 'about');
      if (intakeData.hasPhysicalLocation) pages.push('locations');
    } else if (intakeData.siteType === 'portfolio') {
      pages.push('projects', 'about');
      if (intakeData.resumeUploadRequired) pages.push('resume');
    }

    return {
      prompt: promptSegments.join('\n'),
      projectId: intakeData.formId || '',
      style: style,
      complexity: hasComplexFeatures ? 'complex' : 'medium',
      pages: pages,
      industry: industry,
      additionalInstructions: additionalInstructions || undefined,
      moodboardSelections: Object.keys(moodboardSelections).length > 0 ? moodboardSelections : undefined,
      intakeResponses: Object.keys(intakeResponses).length > 0 ? intakeResponses : undefined
    };
  },
  
  /**
   * Get recommended sections based on site type and features
   */
  getRecommendedSections(intakeData: IntakeFormData): string[] {
    const commonSections = ['hero', 'footer'];
    const siteType = intakeData.siteType || 'business';
    
    // Add type-specific sections
    const typeSections: Record<string, string[]> = {
      'ecommerce': ['featured-products', 'categories', 'testimonials', 'newsletter'],
      'saas': ['features', 'pricing', 'testimonials', 'cta'],
      'business': ['services', 'about', 'testimonials', 'contact'],
      'portfolio': ['projects', 'skills', 'about', 'contact']
    };
    
    // Optional sections based on features
    const optionalSections: string[] = [];
    
    if (intakeData.hasPhysicalLocation) optionalSections.push('map');
    if (intakeData.contactFormRequired) optionalSections.push('contact-form');
    if (intakeData.userAccountsRequired) optionalSections.push('auth');
    
    return [...commonSections, ...(typeSections[siteType] || []), ...optionalSections];
  }
};
