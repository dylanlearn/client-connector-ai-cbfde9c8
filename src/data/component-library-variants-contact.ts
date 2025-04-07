
import { ContactComponentProps } from '@/types/component-library';

// CONTACT SECTION COMPONENT LIBRARY VARIANTS
export const contactVariants: ContactComponentProps[] = [
  {
    variant: 'contact-startup-001',
    headline: "Get in Touch",
    subheadline: "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
    formFields: [
      { label: "Name", name: "name", type: "text", required: true },
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Message", name: "message", type: "textarea", required: true }
    ],
    ctaLabel: "Send Message",
    alignment: 'left',
    backgroundStyle: 'light',
    contactInfo: {
      email: "contact@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Startup Ave, San Francisco, CA 94107"
    },
    showMap: true
  },
  {
    variant: 'contact-creative-001',
    headline: "Let's Collaborate",
    subheadline: "Have a project in mind? We'd love to bring it to life together.",
    formFields: [
      { label: "Your Name", name: "name", type: "text", required: true },
      { label: "Your Email", name: "email", type: "email", required: true },
      { label: "Project Type", name: "project", type: "select", required: true },
      { label: "Tell us about your project", name: "message", type: "textarea", required: true }
    ],
    ctaLabel: "Start a Project",
    alignment: 'center',
    backgroundStyle: 'dark',
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "dribbble", url: "https://dribbble.com" },
      { platform: "behance", url: "https://behance.net" }
    ]
  },
  {
    variant: 'contact-ecommerce-001',
    headline: "Customer Support",
    subheadline: "Need help with your order? Our team is here to assist you.",
    formFields: [
      { label: "Full Name", name: "name", type: "text", required: true },
      { label: "Email Address", name: "email", type: "email", required: true },
      { label: "Order Number", name: "order", type: "text", required: false },
      { label: "How can we help?", name: "message", type: "textarea", required: true }
    ],
    ctaLabel: "Submit Request",
    alignment: 'left',
    backgroundStyle: 'light',
    contactInfo: {
      email: "support@example.com",
      phone: "+1 (555) 987-6543"
    }
  }
];

export default contactVariants;
