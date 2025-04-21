
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { VisualPicker, DesignOption } from '@/components/design/VisualPicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';

// Sample design options
const heroOptions: DesignOption[] = [
  {
    id: 'hero-1',
    title: 'Modern Hero',
    description: 'Clean, minimal hero with a strong call to action',
    imageUrl: '/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png',
    category: 'hero'
  },
  {
    id: 'hero-2',
    title: 'Split Hero',
    description: 'Two-column layout with image and text',
    imageUrl: '/lovable-uploads/0507e956-3bf5-43ba-924e-9d353066ebad.png',
    category: 'hero'
  },
  {
    id: 'hero-3',
    title: 'Bold Headline',
    description: 'Large typography focused layout',
    imageUrl: '/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png',
    category: 'hero'
  },
];

const navbarOptions: DesignOption[] = [
  {
    id: 'navbar-1',
    title: 'Minimal Navbar',
    description: 'Clean, simple navigation bar',
    imageUrl: '/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png',
    category: 'navbar'
  },
  {
    id: 'navbar-2',
    title: 'Mega Menu',
    description: 'Expansive navigation with dropdown categories',
    imageUrl: '/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png',
    category: 'navbar'
  },
];

const footerOptions: DesignOption[] = [
  {
    id: 'footer-1',
    title: 'Simple Footer',
    description: 'Clean footer with essential links',
    imageUrl: '/lovable-uploads/4efe39c0-e0e0-4c25-a11a-d9f9648b0495.png',
    category: 'footer'
  },
  {
    id: 'footer-2',
    title: 'Full Footer',
    description: 'Comprehensive footer with multiple sections',
    imageUrl: '/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png',
    category: 'footer'
  },
];

export default function DesignPicker() {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleSelect = (category: string, designId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: designId
    }));
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Design Picker</h1>
        <p className="text-gray-600 mb-8">
          Select your preferred design options for different parts of your website.
        </p>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="navbar">Navigation</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Choose a hero design that best represents your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisualPicker 
                  options={heroOptions}
                  selectedId={selectedOptions['hero']}
                  onSelect={(id) => handleSelect('hero', id)}
                  fullWidth
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="navbar">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>
                  Select a navigation style for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisualPicker 
                  options={navbarOptions}
                  selectedId={selectedOptions['navbar']}
                  onSelect={(id) => handleSelect('navbar', id)}
                  fullWidth
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>
                  Choose a footer layout that includes the elements you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisualPicker 
                  options={footerOptions}
                  selectedId={selectedOptions['footer']}
                  onSelect={(id) => handleSelect('footer', id)}
                  fullWidth
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
