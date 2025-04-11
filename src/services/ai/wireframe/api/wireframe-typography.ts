
export const generateTypography = async (
  description: string,
  options: {
    style?: Record<string, any>;
    industry?: string;
  } = {}
) => {
  // Simple implementation that returns default typography
  return {
    headings: 'Inter',
    body: 'Inter',
    fontPairings: ['Inter', 'Roboto', 'Open Sans']
  };
};
