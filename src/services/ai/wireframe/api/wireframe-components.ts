
import { v4 as uuidv4 } from 'uuid';

export const generateTextComponent = (text = 'Text component') => ({
  id: uuidv4(),
  type: 'text',
  content: text,
  style: {
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'left'
  }
});

export const generateHeadingComponent = (text = 'Heading', level = 1) => ({
  id: uuidv4(),
  type: 'heading',
  content: text,
  level: level,
  style: {
    fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  }
});

export const generateImageComponent = (src = '', alt = 'Image') => ({
  id: uuidv4(),
  type: 'image',
  src: src,
  alt: alt,
  style: {
    maxWidth: '100%',
    height: 'auto'
  }
});

export const generateButtonComponent = (text = 'Button', variant = 'primary') => ({
  id: uuidv4(),
  type: 'button',
  content: text,
  variant: variant,
  style: {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: 'medium'
  }
});

export default {
  generateTextComponent,
  generateHeadingComponent,
  generateImageComponent,
  generateButtonComponent
};
