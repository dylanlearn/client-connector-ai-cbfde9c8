
import { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
  {
    id: 'landing-page',
    type: 'default',
    data: { label: 'Landing Page' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'about-page',
    type: 'default',
    data: { label: 'About Us' },
    position: { x: 100, y: 150 },
  },
  {
    id: 'services-page',
    type: 'default',
    data: { label: 'Services' },
    position: { x: 250, y: 150 },
  },
  {
    id: 'contact-page',
    type: 'default',
    data: { label: 'Contact Us' },
    position: { x: 400, y: 150 },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'landing-page', target: 'about-page' },
  { id: 'e1-3', source: 'landing-page', target: 'services-page' },
  { id: 'e1-4', source: 'landing-page', target: 'contact-page' },
];
