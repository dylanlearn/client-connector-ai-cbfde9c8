
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
import { Users, User, Mail, Link, Briefcase, Plus, Trash, Globe, Phone, MapPin } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface TeamSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const TeamSectionEditor: React.FC<TeamSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get team data from section or use defaults
  const data = section.data || {};
  const style = section.style || {};
  const headline = data.headline || 'Meet Our Team';
  const description = data.description || 'We are a group of passionate individuals dedicated to excellence.';
  const layoutStyle = data.layoutStyle || 'grid';
  const showSocialLinks = data.showSocialLinks !== false;
  const showRoles = data.showRoles !== false;
  const showBios = data.showBios !== false;
  
  const teamMembers = data.teamMembers || [
    { 
      name: 'John Doe', 
      role: 'CEO',
      bio: 'Brings 15+ years of industry experience.',
      image: '',
      email: 'john@example.com',
      linkedin: '',
      twitter: '',
      website: ''
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

  // Handle team member updates
  const handleTeamMemberUpdate = (index: number, field: string, value: any) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    
    handleContentChange('teamMembers', updatedMembers);
  };

  // Add a new team member
  const addTeamMember = () => {
    const newMembers = [
      ...teamMembers,
      { 
        name: 'New Member', 
        role: 'Position',
        bio: 'Short bio description.',
        image: '',
        email: 'email@example.com',
        linkedin: '',
        twitter: '',
        website: ''
      }
    ];
    handleContentChange('teamMembers', newMembers);
  };

  // Remove a team member
  const removeTeamMember = (index: number) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    handleContentChange('teamMembers', newMembers);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <Users className="w-5 h-5" /> Team Section Editor
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
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
                placeholder="Meet Our Team"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Introduce your team with a short description"
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
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Display Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <Label htmlFor="showRoles">Show Roles</Label>
                </div>
                <Switch 
                  id="showRoles"
                  checked={showRoles}
                  onCheckedChange={(checked) => handleContentChange('showRoles', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <Label htmlFor="showSocialLinks">Show Social Links</Label>
                </div>
                <Switch 
                  id="showSocialLinks"
                  checked={showSocialLinks}
                  onCheckedChange={(checked) => handleContentChange('showSocialLinks', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Label htmlFor="showBios">Show Bios</Label>
                </div>
                <Switch 
                  id="showBios"
                  checked={showBios}
                  onCheckedChange={(checked) => handleContentChange('showBios', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Team Members</h3>
            <Button 
              size="sm" 
              onClick={addTeamMember} 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </div>
          
          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-md font-medium">Member {index + 1}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeTeamMember(index)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-name`}>Name</Label>
                      <Input
                        id={`member-${index}-name`}
                        value={member.name || ''}
                        onChange={(e) => handleTeamMemberUpdate(index, 'name', e.target.value)}
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-role`}>Role/Position</Label>
                      <Input
                        id={`member-${index}-role`}
                        value={member.role || ''}
                        onChange={(e) => handleTeamMemberUpdate(index, 'role', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-bio`}>Bio</Label>
                      <Textarea
                        id={`member-${index}-bio`}
                        value={member.bio || ''}
                        onChange={(e) => handleTeamMemberUpdate(index, 'bio', e.target.value)}
                        placeholder="Short biography"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-image`}>Image URL</Label>
                      <Input
                        id={`member-${index}-image`}
                        value={member.image || ''}
                        onChange={(e) => handleTeamMemberUpdate(index, 'image', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    
                    <h5 className="text-sm font-medium pt-2">Contact Information</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1" htmlFor={`member-${index}-email`}>
                          <Mail className="w-4 h-4" /> Email
                        </Label>
                        <Input
                          id={`member-${index}-email`}
                          value={member.email || ''}
                          onChange={(e) => handleTeamMemberUpdate(index, 'email', e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1" htmlFor={`member-${index}-phone`}>
                          <Phone className="w-4 h-4" /> Phone
                        </Label>
                        <Input
                          id={`member-${index}-phone`}
                          value={member.phone || ''}
                          onChange={(e) => handleTeamMemberUpdate(index, 'phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <h5 className="text-sm font-medium pt-2">Social Links</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`member-${index}-linkedin`}>LinkedIn URL</Label>
                        <Input
                          id={`member-${index}-linkedin`}
                          value={member.linkedin || ''}
                          onChange={(e) => handleTeamMemberUpdate(index, 'linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`member-${index}-twitter`}>Twitter URL</Label>
                        <Input
                          id={`member-${index}-twitter`}
                          value={member.twitter || ''}
                          onChange={(e) => handleTeamMemberUpdate(index, 'twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-website`}>Personal Website</Label>
                      <Input
                        id={`member-${index}-website`}
                        value={member.website || ''}
                        onChange={(e) => handleTeamMemberUpdate(index, 'website', e.target.value)}
                        placeholder="https://example.com"
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
              <Label htmlFor="cardBgColor">Card Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="cardBgColor"
                  color={style.cardBgColor || '#ffffff'}
                  onChange={(color) => handleStyleChange('cardBgColor', color)}
                />
                <Input
                  value={style.cardBgColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('cardBgColor', e.target.value)}
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
              <Label htmlFor="imageBorderRadius">Image Border Radius</Label>
              <Select 
                value={style.imageBorderRadius || 'rounded-full'} 
                onValueChange={(value) => handleStyleChange('imageBorderRadius', value)}
              >
                <SelectTrigger id="imageBorderRadius">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded-none">Square</SelectItem>
                  <SelectItem value="rounded-sm">Small Radius</SelectItem>
                  <SelectItem value="rounded-md">Medium Radius</SelectItem>
                  <SelectItem value="rounded-lg">Large Radius</SelectItem>
                  <SelectItem value="rounded-full">Circle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nameTextSize">Name Text Size</Label>
              <Select 
                value={style.nameTextSize || 'text-lg'} 
                onValueChange={(value) => handleStyleChange('nameTextSize', value)}
              >
                <SelectTrigger id="nameTextSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-sm">Small</SelectItem>
                  <SelectItem value="text-base">Medium</SelectItem>
                  <SelectItem value="text-lg">Large</SelectItem>
                  <SelectItem value="text-xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamSectionEditor;
