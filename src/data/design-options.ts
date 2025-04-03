
import { DesignOption } from "@/components/design/AnimatedVisualPicker";

export const designOptions: DesignOption[] = [
  // Hero sections
  {
    id: "hero-1",
    title: "Gradient Hero",
    description: "A modern hero with colorful gradient background and centered content.",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Gradient+Hero",
    category: "hero"
  },
  {
    id: "hero-2",
    title: "Split Content Hero",
    description: "Hero section with text on the left and image on the right.",
    imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Split+Hero",
    category: "hero"
  },
  {
    id: "hero-3",
    title: "Minimal Hero",
    description: "Clean, minimalist hero with focus on typography and white space.",
    imageUrl: "https://placehold.co/600x400/34495e/ffffff?text=Minimal+Hero",
    category: "hero"
  },
  {
    id: "hero-4",
    title: "Video Background Hero",
    description: "Engaging hero with a video background and overlay text.",
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Video+Hero",
    category: "hero"
  },
  {
    id: "hero-5",
    title: "Animated Particles Hero",
    description: "Dynamic hero with animated particle background.",
    imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Particles+Hero",
    category: "hero"
  },
  
  // Navbar sections
  {
    id: "navbar-1",
    title: "Transparent Navbar",
    description: "A transparent navbar that overlays the hero section.",
    imageUrl: "https://placehold.co/600x400/1abc9c/ffffff?text=Transparent+Navbar",
    category: "navbar"
  },
  {
    id: "navbar-2",
    title: "Sticky Navbar",
    description: "A navbar that sticks to the top when scrolling.",
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Sticky+Navbar",
    category: "navbar"
  },
  {
    id: "navbar-3",
    title: "Sidebar Navigation",
    description: "A vertical sidebar navigation for desktop and mobile.",
    imageUrl: "https://placehold.co/600x400/f39c12/ffffff?text=Sidebar+Nav",
    category: "navbar"
  },
  {
    id: "navbar-4",
    title: "Centered Logo Navbar",
    description: "A navbar with the logo centered and menu items on both sides.",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Centered+Logo+Nav",
    category: "navbar"
  },
  {
    id: "navbar-5",
    title: "Minimal Navbar",
    description: "Clean, simple navbar with minimal styling.",
    imageUrl: "https://placehold.co/600x400/95a5a6/ffffff?text=Minimal+Navbar",
    category: "navbar"
  },
  
  // About sections
  {
    id: "about-1",
    title: "Grid Layout About",
    description: "About section with a grid layout of images and text.",
    imageUrl: "https://placehold.co/600x400/d35400/ffffff?text=Grid+About",
    category: "about"
  },
  {
    id: "about-2",
    title: "Timeline About",
    description: "About section with a vertical timeline of milestones.",
    imageUrl: "https://placehold.co/600x400/8e44ad/ffffff?text=Timeline+About",
    category: "about"
  },
  {
    id: "about-3",
    title: "Team Showcase",
    description: "About section showcasing team members with photos and bios.",
    imageUrl: "https://placehold.co/600x400/27ae60/ffffff?text=Team+About",
    category: "about"
  },
  {
    id: "about-4",
    title: "Stats & Numbers",
    description: "About section highlighting key stats and achievements.",
    imageUrl: "https://placehold.co/600x400/e67e22/ffffff?text=Stats+About",
    category: "about"
  },
  {
    id: "about-5",
    title: "Image Carousel About",
    description: "About section with sliding carousel of images and content.",
    imageUrl: "https://placehold.co/600x400/16a085/ffffff?text=Carousel+About",
    category: "about"
  },
  
  // Footer sections
  {
    id: "footer-1",
    title: "Multi-column Footer",
    description: "Footer with multiple columns of links and information.",
    imageUrl: "https://placehold.co/600x400/2c3e50/ffffff?text=Multi-column+Footer",
    category: "footer"
  },
  {
    id: "footer-2",
    title: "Minimal Footer",
    description: "Simple footer with copyright and essential links.",
    imageUrl: "https://placehold.co/600x400/c0392b/ffffff?text=Minimal+Footer",
    category: "footer"
  },
  {
    id: "footer-3",
    title: "Contact Form Footer",
    description: "Footer with integrated contact form and social links.",
    imageUrl: "https://placehold.co/600x400/7f8c8d/ffffff?text=Contact+Footer",
    category: "footer"
  },
  {
    id: "footer-4",
    title: "Newsletter Footer",
    description: "Footer with newsletter signup and social media icons.",
    imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Newsletter+Footer",
    category: "footer"
  },
  {
    id: "footer-5",
    title: "Map Footer",
    description: "Footer with location map and contact information.",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Map+Footer",
    category: "footer"
  },
  
  // Font options
  {
    id: "font-1",
    title: "Modern Sans-Serif",
    description: "Clean, modern sans-serif font pairing for contemporary websites.",
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Sans-Serif",
    category: "font"
  },
  {
    id: "font-2",
    title: "Elegant Serif",
    description: "Elegant serif font pairing for upscale, professional websites.",
    imageUrl: "https://placehold.co/600x400/16a085/ffffff?text=Serif",
    category: "font"
  },
  {
    id: "font-3",
    title: "Sans-Serif & Serif Mix",
    description: "Modern mix of sans-serif headings with serif body text.",
    imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Sans+%26+Serif",
    category: "font"
  },
  {
    id: "font-4",
    title: "Playful Display",
    description: "Unique display fonts for creative websites with personality.",
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Display+Fonts",
    category: "font"
  },
  
  // Animation options
  {
    id: "animation-1",
    title: "Fade & Slide In",
    description: "Subtle fade and slide animations for content sections.",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Fade+%26+Slide",
    category: "animation"
  },
  {
    id: "animation-2",
    title: "Scroll Reveal",
    description: "Elements reveal as you scroll down the page.",
    imageUrl: "https://placehold.co/600x400/e67e22/ffffff?text=Scroll+Reveal",
    category: "animation"
  },
  {
    id: "animation-3",
    title: "Parallax Effects",
    description: "Parallax scrolling effects for depth and engagement.",
    imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Parallax",
    category: "animation"
  },
  {
    id: "animation-4",
    title: "3D Transforms",
    description: "3D transformation effects for interactive elements.",
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=3D+Transforms",
    category: "animation"
  },
  {
    id: "animation-5",
    title: "Microinteractions",
    description: "Subtle animations for buttons, links, and interactive elements.",
    imageUrl: "https://placehold.co/600x400/27ae60/ffffff?text=Microinteractions",
    category: "animation"
  },
  {
    id: "animation-6",
    title: "Text Animation",
    description: "Engaging text animations for headings and important content.",
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Text+Animation",
    category: "animation"
  },
  {
    id: "animation-7",
    title: "Staggered Reveal",
    description: "Elements appear one after another in sequence.",
    imageUrl: "https://placehold.co/600x400/1abc9c/ffffff?text=Staggered+Reveal",
    category: "animation"
  },
  {
    id: "animation-8",
    title: "Floating Elements",
    description: "Subtle floating animations for a dreamy, dynamic feel.",
    imageUrl: "https://placehold.co/600x400/e84393/ffffff?text=Floating+Elements",
    category: "animation"
  },
  {
    id: "animation-9",
    title: "Elastic Motion",
    description: "Springy, elastic animations for playful interfaces.",
    imageUrl: "https://placehold.co/600x400/00cec9/ffffff?text=Elastic+Motion",
    category: "animation"
  },
  
  // Interaction options
  {
    id: "interaction-1",
    title: "Hover Effects",
    description: "Creative hover effects for images, cards, and buttons.",
    imageUrl: "https://placehold.co/600x400/2c3e50/ffffff?text=Hover+Effects",
    category: "interaction"
  },
  {
    id: "interaction-2",
    title: "Modal Dialogs",
    description: "Interactive modal popups for content and actions.",
    imageUrl: "https://placehold.co/600x400/c0392b/ffffff?text=Modal+Dialogs",
    category: "interaction"
  },
  {
    id: "interaction-3",
    title: "Custom Cursors",
    description: "Creative custom cursor effects that follow mouse movement.",
    imageUrl: "https://placehold.co/600x400/8e44ad/ffffff?text=Custom+Cursors",
    category: "interaction"
  },
  {
    id: "interaction-4",
    title: "Scroll Animations",
    description: "Interactive elements triggered by scroll position.",
    imageUrl: "https://placehold.co/600x400/d35400/ffffff?text=Scroll+Animations",
    category: "interaction"
  },
  {
    id: "interaction-5",
    title: "Drag Interactions",
    description: "Draggable elements for interactive galleries and sliders.",
    imageUrl: "https://placehold.co/600x400/16a085/ffffff?text=Drag+Interactions",
    category: "interaction"
  },
  {
    id: "interaction-6",
    title: "AI Design Suggestion",
    description: "AI-powered design suggestions during user interaction.",
    imageUrl: "https://placehold.co/600x400/20bf6b/ffffff?text=AI+Design",
    category: "interaction"
  },
  {
    id: "interaction-7",
    title: "Magnetic Elements",
    description: "Elements that attract the cursor for playful interactions.",
    imageUrl: "https://placehold.co/600x400/eb3b5a/ffffff?text=Magnetic+Elements",
    category: "interaction"
  },
  {
    id: "interaction-8",
    title: "Color Shift",
    description: "Elements that change color on interaction for visual feedback.",
    imageUrl: "https://placehold.co/600x400/fa8231/ffffff?text=Color+Shift",
    category: "interaction"
  },
  {
    id: "interaction-9",
    title: "Parallax Tilt",
    description: "3D tilt effect that follows cursor movement for depth.",
    imageUrl: "https://placehold.co/600x400/3867d6/ffffff?text=Parallax+Tilt",
    category: "interaction"
  }
];
