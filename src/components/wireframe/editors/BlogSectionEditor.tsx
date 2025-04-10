
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tags, BookOpen, Layout, CalendarDays, User, Plus, Trash } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface BlogSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const BlogSectionEditor: React.FC<BlogSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get blog data from section or use defaults
  const data = section.data || {};
  const style = section.style || {};
  const headline = data.headline || '';
  const description = data.description || '';
  const layoutStyle = data.layoutStyle || 'grid';
  const backgroundStyle = data.backgroundStyle || 'light';
  const alignment = data.alignment || 'left';
  const showCategories = data.showCategories !== false;
  const showAuthors = data.showAuthors !== false;
  const showDates = data.showDates !== false;
  const posts = data.posts || [
    { 
      title: 'Blog post title', 
      summary: 'Short summary of the blog post',
      category: 'Category',
      author: 'Author Name',
      date: '2023-01-01'
    }
  ];

  // Get style data
  const backgroundColor = style.backgroundColor || '#ffffff';
  const textColor = style.textColor || '#000000';
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...style,
      [field]: value
    };
    onUpdate({ style: updatedStyle });
  };

  // Handle post updates
  const handlePostUpdate = (index: number, field: string, value: any) => {
    const updatedPosts = [...posts];
    updatedPosts[index] = {
      ...updatedPosts[index],
      [field]: value
    };
    
    handleContentChange('posts', updatedPosts);
  };

  // Add a new blog post
  const addPost = () => {
    const newPosts = [
      ...posts,
      { 
        title: 'New blog post', 
        summary: 'Add a summary here',
        category: 'Category',
        author: 'Author Name',
        date: new Date().toISOString().split('T')[0]
      }
    ];
    handleContentChange('posts', newPosts);
  };

  // Remove a blog post
  const removePost = (index: number) => {
    const newPosts = [...posts];
    newPosts.splice(index, 1);
    handleContentChange('posts', newPosts);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <BookOpen className="w-5 h-5" /> Blog Section Editor
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Section Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                placeholder="Latest Articles"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Stay up-to-date with our latest news and insights."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layoutStyle">Layout Style</Label>
                <Select 
                  value={layoutStyle} 
                  onValueChange={(value) => handleContentChange('layoutStyle', value)}
                >
                  <SelectTrigger id="layoutStyle">
                    <SelectValue placeholder="Select Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alignment">Content Alignment</Label>
                <Select 
                  value={alignment} 
                  onValueChange={(value) => handleContentChange('alignment', value)}
                >
                  <SelectTrigger id="alignment">
                    <SelectValue placeholder="Select Alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Display Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  <Label htmlFor="showCategories">Show Categories</Label>
                </div>
                <Switch 
                  id="showCategories"
                  checked={showCategories}
                  onCheckedChange={(checked) => handleContentChange('showCategories', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Label htmlFor="showAuthors">Show Authors</Label>
                </div>
                <Switch 
                  id="showAuthors"
                  checked={showAuthors}
                  onCheckedChange={(checked) => handleContentChange('showAuthors', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <Label htmlFor="showDates">Show Dates</Label>
                </div>
                <Switch 
                  id="showDates"
                  checked={showDates}
                  onCheckedChange={(checked) => handleContentChange('showDates', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Blog Posts</h3>
            <Button 
              size="sm" 
              onClick={addPost} 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Post
            </Button>
          </div>
          
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-md font-medium">Post {index + 1}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removePost(index)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`post-${index}-title`}>Title</Label>
                      <Input
                        id={`post-${index}-title`}
                        value={post.title || ''}
                        onChange={(e) => handlePostUpdate(index, 'title', e.target.value)}
                        placeholder="Post Title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`post-${index}-summary`}>Summary</Label>
                      <Textarea
                        id={`post-${index}-summary`}
                        value={post.summary || ''}
                        onChange={(e) => handlePostUpdate(index, 'summary', e.target.value)}
                        placeholder="Post summary"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`post-${index}-category`}>Category</Label>
                        <Input
                          id={`post-${index}-category`}
                          value={post.category || ''}
                          onChange={(e) => handlePostUpdate(index, 'category', e.target.value)}
                          placeholder="Category"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`post-${index}-author`}>Author</Label>
                        <Input
                          id={`post-${index}-author`}
                          value={post.author || ''}
                          onChange={(e) => handlePostUpdate(index, 'author', e.target.value)}
                          placeholder="Author name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`post-${index}-date`}>Date</Label>
                        <Input
                          id={`post-${index}-date`}
                          type="date"
                          value={post.date || ''}
                          onChange={(e) => handlePostUpdate(index, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`post-${index}-image`}>Image URL</Label>
                      <Input
                        id={`post-${index}-image`}
                        value={post.image || ''}
                        onChange={(e) => handlePostUpdate(index, 'image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundStyle">Background Style</Label>
              <Select 
                value={backgroundStyle} 
                onValueChange={(value) => handleContentChange('backgroundStyle', value)}
              >
                <SelectTrigger id="backgroundStyle">
                  <SelectValue placeholder="Select Background Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image Background</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="backgroundColor"
                  color={backgroundColor}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="textColor"
                  color={textColor}
                  onChange={(color) => handleStyleChange('textColor', color)}
                />
                <Input
                  value={textColor}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={style.padding || '4'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Medium (16px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <Select 
                value={style.borderRadius || 'md'} 
                onValueChange={(value) => handleStyleChange('borderRadius', value)}
              >
                <SelectTrigger id="borderRadius">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (0px)</SelectItem>
                  <SelectItem value="sm">Small (4px)</SelectItem>
                  <SelectItem value="md">Medium (6px)</SelectItem>
                  <SelectItem value="lg">Large (8px)</SelectItem>
                  <SelectItem value="xl">Extra Large (12px)</SelectItem>
                  <SelectItem value="full">Full (9999px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogSectionEditor;
