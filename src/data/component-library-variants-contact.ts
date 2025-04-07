
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
    subheadline: "Studio projects, exhibitions, and partnerships welcome.",
    formFields: [
      { label: "Name", name: "name", type: "text", required: true },
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Send Message",
    backgroundStyle: "light",
    alignment: "left",
    contactInfo: {
      email: "hello@studio.com"
    },
    styleNote: "Creative layout with soft background and minimal form styling"
  },
  {
    variant: 'contact-creative-002',
    headline: "Say Hello",
    subheadline: "Let's create something beautiful together.",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Reach Out",
    backgroundStyle: "gradient",
    alignment: "center",
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "Behance", url: "https://behance.net" }
    ],
    styleNote: "Gradient card layout with floating social links and soft visuals"
  },
  {
    variant: 'contact-creative-003',
    headline: "Book a Session",
    subheadline: "Creative consulting and portfolio reviews.",
    formFields: [
      { label: "Email", name: "email", type: "email" },
      { label: "Service Type", name: "service", type: "select" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Request Appointment",
    backgroundStyle: "image",
    alignment: "right",
    showMap: false,
    styleNote: "Split background image contact layout with right form alignment"
  },
  {
    variant: 'contact-startup-002',
    headline: "Get In Touch",
    subheadline: "Technical questions, API support, or partnership ideas?",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Company", name: "company", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Send Message",
    backgroundStyle: "dark",
    alignment: "center",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "Twitter", url: "https://twitter.com" }
    ],
    styleNote: "Dark UI for technical SaaS contact, with social + compact field design"
  },
  {
    variant: 'contact-startup-003',
    headline: "We'd Love to Hear From You",
    subheadline: "Customer feedback, media inquiries, and more.",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Subject", name: "subject", type: "text" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Submit",
    backgroundStyle: "gradient",
    alignment: "center",
    showMap: true,
    styleNote: "Gradient SaaS contact with optional map + subject field"
  },
  {
    variant: 'contact-startup-004',
    headline: "Enterprise Inquiries",
    subheadline: "We help big teams move even faster.",
    formFields: [
      { label: "Company Name", name: "company", type: "text" },
      { label: "Contact Email", name: "email", type: "email" },
      { label: "Requirements", name: "message", type: "textarea" }
    ],
    ctaLabel: "Request Contact",
    backgroundStyle: "image",
    alignment: "right",
    styleNote: "Image-backed contact form for enterprise lead capture"
  },
  {
    variant: 'contact-ecom-001',
    headline: "Customer Support",
    subheadline: "We're here to help with your order, return, or product question.",
    formFields: [
      { label: "Order Number", name: "order", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Issue", name: "message", type: "textarea" }
    ],
    ctaLabel: "Submit Ticket",
    backgroundStyle: "light",
    alignment: "left",
    contactInfo: {
      email: "support@shop.com",
      phone: "+1 (800) 999-1212"
    },
    styleNote: "Simple support form w/ order number and contact details"
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
  },
  {
    variant: 'contact-ecom-002',
    headline: "Ask Us Anything",
    subheadline: "Skincare advice, product info, or tracking help.",
    formFields: [
      { label: "Email", name: "email", type: "email" },
      { label: "Question", name: "message", type: "textarea" }
    ],
    ctaLabel: "Ask Now",
    backgroundStyle: "gradient",
    alignment: "center",
    styleNote: "Glossier-style layout with soft tone and minimal form"
  },
  {
    variant: 'contact-ecom-003',
    headline: "Talk to an Expert",
    subheadline: "Find your perfect fit or start a return.",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Send Message",
    backgroundStyle: "image",
    alignment: "right",
    styleNote: "Photo-forward ecommerce support layout for CX"
  },
  {
    variant: 'contact-flex-001',
    headline: "Let's Work Together",
    subheadline: "Book a call or send a message.",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Service Type", name: "service", type: "select" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Book Now",
    backgroundStyle: "light",
    alignment: "center",
    styleNote: "Freelancer/coach-style contact block with service dropdown"
  },
  {
    variant: 'contact-flex-002',
    headline: "Join Our Community",
    subheadline: "Reach out about speaking, writing, or mentoring.",
    formFields: [
      { label: "Name", name: "name", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Message", name: "message", type: "textarea" }
    ],
    ctaLabel: "Reach Out",
    backgroundStyle: "dark",
    alignment: "left",
    styleNote: "Community-driven contact for educators or influencers"
  },
  {
    variant: 'contact-flex-003',
    headline: "Have a Question?",
    subheadline: "Or just want to connect? Fill out the form.",
    formFields: [
      { label: "Email", name: "email", type: "email" },
      { label: "Your Question", name: "message", type: "textarea" }
    ],
    ctaLabel: "Send",
    backgroundStyle: "image",
    alignment: "right",
    showMap: false,
    styleNote: "Simple, approachable contact block for general outreach"
  }
];

export default contactVariants;
