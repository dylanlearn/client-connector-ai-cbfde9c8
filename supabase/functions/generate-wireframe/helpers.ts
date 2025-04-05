
// Creative enhancements for wireframe generation

export const addCreativeEnhancements = (wireframeData: any): any => {
  // Enhanced wireframe data with more creative elements
  const enhancedData = { ...wireframeData };
  
  // Add creative color palettes based on design principles
  if (!enhancedData.designTokens || !enhancedData.designTokens.colors) {
    enhancedData.designTokens = enhancedData.designTokens || {};
    enhancedData.designTokens.colors = {};
  }
  
  // Generate creative color variations
  enhancedData.designTokens.colors = {
    ...enhancedData.designTokens.colors,
    accent: generateCreativeAccentColors(enhancedData.designTokens.colors.primary || '#4F46E5'),
  };
  
  // Add animation suggestions if not present
  if (!enhancedData.animations) {
    enhancedData.animations = generateAnimationSuggestions();
  }
  
  // Add creative typography pairings
  if (!enhancedData.designTokens.typography) {
    enhancedData.designTokens.typography = {};
  }
  
  enhancedData.designTokens.typography = {
    ...enhancedData.designTokens.typography,
    pairings: generateCreativeTypographyPairings(),
  };
  
  // Add creative component variations if sections exist
  if (enhancedData.sections && Array.isArray(enhancedData.sections)) {
    enhancedData.sections = enhancedData.sections.map((section: any) => {
      return {
        ...section,
        styleVariants: generateComponentVariations(section.type),
      };
    });
  }
  
  // Add design rationale for creative choices
  enhancedData.creativeRationale = generateCreativeRationale(
    enhancedData.title, 
    enhancedData.designTokens.colors.primary
  );
  
  return enhancedData;
};

// Helper functions for creative enhancements

function generateCreativeAccentColors(primaryColor: string): Record<string, string> {
  // Simple algorithm to generate complementary and analogous colors
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } 
      : { r: 0, g: 0, b: 0 };
  };
  
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  const rgb = hexToRgb(primaryColor);
  
  // Generate complementary color
  const complementary = rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  );
  
  // Generate analogous colors
  const analogous1 = rgbToHex(
    Math.min(255, rgb.r + 40),
    Math.min(255, rgb.g - 20),
    Math.min(255, rgb.b + 20)
  );
  
  const analogous2 = rgbToHex(
    Math.min(255, rgb.r - 40),
    Math.min(255, rgb.g + 20),
    Math.min(255, rgb.b - 20)
  );
  
  return {
    complementary,
    analogous1,
    analogous2,
    vibrant: selectVibrantAccentColor(primaryColor),
  };
}

function selectVibrantAccentColor(primaryColor: string): string {
  // Vibrant color options for different color families
  const vibrantOptions = {
    blue: ['#00BFFF', '#1E90FF', '#4169E1'],
    red: ['#FF4500', '#FF6347', '#FF7F50'],
    green: ['#32CD32', '#00FA9A', '#00FF7F'],
    purple: ['#9370DB', '#8A2BE2', '#9932CC'],
    yellow: ['#FFD700', '#FFA500', '#FFFF00'],
  };
  
  // Determine color family based on primary color
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } 
      : { r: 0, g: 0, b: 0 };
  };
  
  const rgb = hexToRgb(primaryColor);
  
  if (rgb.r > rgb.g && rgb.r > rgb.b) {
    return vibrantOptions.red[Math.floor(Math.random() * 3)];
  } else if (rgb.g > rgb.r && rgb.g > rgb.b) {
    return vibrantOptions.green[Math.floor(Math.random() * 3)];
  } else if (rgb.b > rgb.r && rgb.b > rgb.g) {
    return vibrantOptions.blue[Math.floor(Math.random() * 3)];
  } else if (rgb.r > 200 && rgb.g > 200) {
    return vibrantOptions.yellow[Math.floor(Math.random() * 3)];
  } else {
    return vibrantOptions.purple[Math.floor(Math.random() * 3)];
  }
}

function generateAnimationSuggestions(): any {
  // Creative animation suggestions
  return {
    transitions: [
      {
        name: "Subtle Fade",
        description: "Elements fade in with slight upward movement for a clean entrance",
        css: "transition: opacity 0.4s ease-out, transform 0.4s ease-out; transform: translateY(10px); opacity: 0;"
      },
      {
        name: "Elastic Bounce",
        description: "Elements appear with a playful bounce that adds personality",
        css: "transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: scale(0.8);"
      },
      {
        name: "Staggered Reveal",
        description: "Elements appear in sequence with slight delays between each",
        css: "transition: opacity 0.4s ease, transform 0.4s ease; transform: translateY(15px); opacity: 0;"
      }
    ],
    hover: [
      {
        name: "Depth Shift",
        description: "Elements appear to move forward slightly on hover",
        css: "transition: transform 0.3s ease, box-shadow 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }"
      },
      {
        name: "Color Pulse",
        description: "Background slightly shifts color on hover",
        css: "transition: background-color 0.3s ease; &:hover { background-color: rgba(var(--color-primary-rgb), 0.05); }"
      }
    ]
  };
}

function generateCreativeTypographyPairings(): any {
  // Creative font pairings that work well together
  const pairings = [
    {
      name: "Modern Contrast",
      heading: "Montserrat",
      body: "Merriweather",
      description: "Clean, modern heading with a readable serif body"
    },
    {
      name: "Contemporary Elegance",
      heading: "Playfair Display",
      body: "Source Sans Pro",
      description: "Elegant serif headings with clean sans-serif body"
    },
    {
      name: "Tech Forward",
      heading: "Space Grotesk",
      body: "Inter",
      description: "Modern technical feel with excellent readability"
    },
    {
      name: "Creative Bold",
      heading: "Abril Fatface",
      body: "Poppins",
      description: "Bold, creative headings with a friendly body text"
    },
    {
      name: "Classic Professional",
      heading: "Libre Baskerville",
      body: "Raleway",
      description: "Traditional, trustworthy headings with contemporary body text"
    }
  ];
  
  // Return 3 random pairings
  const shuffled = [...pairings].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function generateComponentVariations(componentType: string): any[] {
  // Generate creative component variations based on component type
  const variations: any[] = [];
  
  const basicVariations = [
    {
      name: "Standard",
      description: "The standard implementation style"
    },
    {
      name: "Minimal",
      description: "A stripped-back, clean variation with minimal decoration"
    }
  ];
  
  // Add component-specific variations
  switch (componentType) {
    case "hero":
      variations.push(
        {
          name: "Split Content",
          description: "Content and image in a side-by-side layout"
        },
        {
          name: "Gradient Overlay",
          description: "Bold gradient background with text overlay"
        },
        {
          name: "Animated Background",
          description: "Subtle animated elements in the background"
        }
      );
      break;
      
    case "cta":
      variations.push(
        {
          name: "Floating Card",
          description: "CTA in a card that stands out from the background"
        },
        {
          name: "Full Width Banner",
          description: "Bold full-width banner with contrasting background"
        }
      );
      break;
      
    case "feature":
      variations.push(
        {
          name: "Icon Grid",
          description: "Features presented in a grid with prominent icons"
        },
        {
          name: "Alternating Layout",
          description: "Features in an alternating left/right layout"
        },
        {
          name: "Card Collection",
          description: "Each feature in its own distinct card"
        }
      );
      break;
      
    case "testimonial":
      variations.push(
        {
          name: "Quote Carousel",
          description: "Rotating carousel of testimonial quotes"
        },
        {
          name: "Profile Cards",
          description: "Testimonials with prominent customer photos"
        }
      );
      break;
      
    default:
      variations.push(
        {
          name: "Creative Layout",
          description: "Unique layout with visual interest"
        },
        {
          name: "Interactive Elements",
          description: "Interactive elements to engage users"
        }
      );
  }
  
  return [...basicVariations, ...variations];
}

function generateCreativeRationale(title: string, primaryColor: string): any {
  // Generate creative rationale for the design choices
  return {
    colorStrategy: "The color palette is designed to balance brand recognition with emotional impact. " +
      "The primary color establishes the core identity, while complementary and analogous colors " +
      "create visual interest and guide the user's attention through the interface.",
      
    typographyStrategy: "Typography selections prioritize both readability and personality. " +
      "The pairing of distinctive headings with highly legible body text creates a clear " +
      "visual hierarchy while maintaining a cohesive voice throughout the design.",
      
    layoutPrinciples: "The layout employs a balance of white space and content density to create " +
      "breathing room while maintaining engagement. Key elements use strategic positioning to " +
      "draw attention to primary conversion points and core messaging.",
      
    motionPhilosophy: "Animation is employed subtly and purposefully to enhance usability and " +
      "add moments of delight. Transitions are timed to feel responsive without being distracting, " +
      "creating a fluid and polished experience."
  };
}
