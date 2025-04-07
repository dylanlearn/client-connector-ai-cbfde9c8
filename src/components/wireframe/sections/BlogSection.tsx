
import React from 'react';
import { BlogSectionProps } from '@/types/component-library';
import { cn } from '@/lib/utils';
import { Calendar, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogSectionComponentProps {
  sectionIndex?: number;
  data?: BlogSectionProps;
  variant?: string;
  className?: string;
}

export const BlogSection: React.FC<BlogSectionComponentProps> = ({ 
  sectionIndex = 0,
  data,
  variant = 'blog-startup-001',
  className
}) => {
  // Default blog data if none provided
  const blogData: Partial<BlogSectionProps> = data || {
    variant,
    headline: "Latest Articles",
    description: "Stay up to date with our latest news and updates",
    layoutStyle: 'grid',
    posts: [
      {
        title: "Getting Started with Our Platform",
        url: "/blog/getting-started",
        summary: "A comprehensive guide to help you get started with our platform.",
        image: "/images/blog/getting-started.jpg",
        category: "Guide",
        author: "John Doe",
        date: "2023-05-15"
      },
      {
        title: "10 Tips for Better Productivity",
        url: "/blog/productivity-tips",
        summary: "Learn how to boost your productivity with these simple tips.",
        image: "/images/blog/productivity.jpg",
        category: "Tips",
        author: "Jane Smith",
        date: "2023-05-10"
      }
    ],
    alignment: 'left',
    backgroundStyle: 'light',
    showCategories: true,
    showAuthors: true
  };
  
  // Determine background class based on style
  const getBgClass = () => {
    switch (blogData.backgroundStyle) {
      case 'dark': 
        return 'bg-gray-900 text-white';
      case 'light': 
        return 'bg-gray-50 text-gray-800';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'image':
        return 'bg-gray-800 bg-opacity-75 text-white';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };
  
  // Determine alignment class
  const getAlignmentClass = () => {
    switch (blogData.alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  // Render the appropriate layout based on layoutStyle
  const renderLayout = () => {
    switch (blogData.layoutStyle) {
      case 'grid':
        return renderGridLayout();
      case 'list':
        return renderListLayout();
      case 'carousel':
        return renderCarouselLayout();
      default:
        return renderGridLayout();
    }
  };

  // Grid layout for posts
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {blogData.posts?.map((post, idx) => (
        <div key={idx} className="flex flex-col h-full overflow-hidden rounded-lg shadow-sm">
          {post.image && (
            <div className="w-full h-48 bg-gray-300 bg-opacity-30 rounded-t-lg"></div>
          )}
          <div className="p-4 flex-grow">
            {blogData.showCategories && post.category && (
              <div className="flex items-center space-x-1 mb-2">
                <Tag size={14} />
                <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.category}</div>
              </div>
            )}
            <div className="w-full h-6 bg-gray-300 bg-opacity-30 rounded mb-2">{post.title}</div>
            {post.summary && (
              <div className="w-full h-12 bg-gray-200 bg-opacity-30 rounded"></div>
            )}
            <div className="flex items-center mt-4 space-x-4">
              {blogData.showAuthors && post.author && (
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.author}</div>
                </div>
              )}
              {post.date && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <div className="w-20 h-3 bg-gray-200 bg-opacity-30 rounded">{post.date}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List layout for posts
  const renderListLayout = () => (
    <div className="space-y-6 mt-8">
      {blogData.posts?.map((post, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-4 pb-6 border-b">
          {post.image && (
            <div className="w-full md:w-1/4 h-32 md:h-24 bg-gray-300 bg-opacity-30 rounded-lg"></div>
          )}
          <div className="flex-grow">
            {blogData.showCategories && post.category && (
              <div className="flex items-center space-x-1 mb-2">
                <Tag size={14} />
                <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.category}</div>
              </div>
            )}
            <div className="w-full h-6 bg-gray-300 bg-opacity-30 rounded mb-2">{post.title}</div>
            {post.summary && (
              <div className="w-full h-4 bg-gray-200 bg-opacity-30 rounded"></div>
            )}
            <div className="flex items-center mt-2 space-x-4">
              {blogData.showAuthors && post.author && (
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.author}</div>
                </div>
              )}
              {post.date && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <div className="w-20 h-3 bg-gray-200 bg-opacity-30 rounded">{post.date}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Carousel layout for posts
  const renderCarouselLayout = () => (
    <div className="relative mt-8">
      <div className="overflow-hidden">
        <div className="flex">
          {blogData.posts?.slice(0, 1).map((post, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-6">
                {post.image && (
                  <div className="w-full md:w-1/2 h-64 bg-gray-300 bg-opacity-30 rounded-lg"></div>
                )}
                <div className="flex-grow">
                  {blogData.showCategories && post.category && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Tag size={14} />
                      <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.category}</div>
                    </div>
                  )}
                  <div className="w-full h-8 bg-gray-300 bg-opacity-30 rounded mb-3">{post.title}</div>
                  {post.summary && (
                    <div className="w-full h-20 bg-gray-200 bg-opacity-30 rounded"></div>
                  )}
                  <div className="flex items-center mt-4 space-x-4">
                    {blogData.showAuthors && post.author && (
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <div className="w-16 h-3 bg-gray-200 bg-opacity-30 rounded">{post.author}</div>
                      </div>
                    )}
                    {post.date && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <div className="w-20 h-3 bg-gray-200 bg-opacity-30 rounded">{post.date}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Carousel controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-30 flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-30 flex items-center justify-center">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div 
      key={sectionIndex} 
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-4',
        getBgClass(),
        getAlignmentClass(),
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        {blogData.headline && (
          <div className={`w-64 h-8 bg-gray-300 bg-opacity-30 rounded mb-4 ${getAlignmentClass() === 'text-center' ? 'mx-auto' : ''}`}>
            {blogData.headline}
          </div>
        )}
        
        {blogData.description && (
          <div className={`w-full md:w-2/3 h-4 bg-gray-200 bg-opacity-30 rounded mb-8 ${getAlignmentClass() === 'text-center' ? 'mx-auto' : ''} ${getAlignmentClass() === 'text-right' ? 'ml-auto' : ''}`}>
            {blogData.description}
          </div>
        )}
        
        {/* Posts Layout */}
        {renderLayout()}
      </div>
    </div>
  );
};

export default BlogSection;
