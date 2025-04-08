import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

const createBasicTemplate = (): WireframeData => {
  return {
    id: uuidv4(), // Add required ID field
    title: "Basic Website Template",
    description: "A standard layout with common sections",
    sections: [
      {
        id: uuidv4(),
        name: "Header Section",
        sectionType: "header",
        components: [
          {
            id: uuidv4(),
            type: "navigation",
            content: "Main Navigation"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "Hero Section",
        sectionType: "hero",
        components: [
          {
            id: uuidv4(),
            type: "headline",
            content: "Welcome to Our Website"
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content: "A brief introduction to our company and services."
          }
        ]
      },
      {
        id: uuidv4(),
        name: "Content Section",
        sectionType: "content",
        components: [
          {
            id: uuidv4(),
            type: "image",
            content: "Placeholder Image"
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Detailed information about our products/services."
          }
        ]
      },
      {
        id: uuidv4(),
        name: "Footer Section",
        sectionType: "footer",
        components: [
          {
            id: uuidv4(),
            type: "copyright",
            content: "© 2024 Your Company"
          },
          {
            id: uuidv4(),
            type: "links",
            content: "Privacy Policy | Terms of Service"
          }
        ]
      }
    ],
    layoutType: "standard"
  };
};

export const WireframeTemplateService = {
  createBasicTemplate
};
