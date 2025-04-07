
import React from 'react';
import { BlogSectionProps } from '@/types/component-library';
import { cn } from '@/lib/utils';

interface BlogSectionComponentProps {
  sectionIndex?: number;
  data?: Partial<BlogSectionProps>;
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
    description: "Stay up-to-date with our latest news and product updates.",
    posts: [
      {
        title: "Introducing Our New Feature",
        url: "/blog/new-feature",
        summary: "Learn about our exciting new feature that helps boost productivity.",
        image: "/images/blog/feature.jpg",
        category: "Product",
        author: "Jane Smith",
        date: "2023-05-15"
      },
      {
        title: "How to Maximize Your Workflow",
        url: "/blog/workflow",
        summary: "Tips and tricks for getting the most out of your daily work routine.",
        image: "/images/blog/workflow.jpg",
        category: "Guides",
        author: "John Doe",
        date: "2023-05-10"
      },
      {
        title: "Case Study: Enterprise Success",
        url: "/blog/case-study",
        summary: "How our enterprise customers achieve 200% ROI with our platform.",
        image: "/images/blog/case-study.jpg",
        category: "Case Studies",
        author: "Emily Johnson",
        date: "2023-05-01"
      }
    ],
    layoutStyle: 'grid',
    backgroundStyle: 'light',
    alignment: 'left',
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

  // Determine layout class
  const getLayoutClass = () => {
    switch (blogData.layoutStyle) {
      case 'list': return 'flex flex-col space-y-8';
      case 'carousel': return 'flex overflow-x-auto snap-x snap-mandatory space-x-6 pb-6';
      case 'grid':
      default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
    }
  };

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
        {/* Header */}
        {(blogData.headline || blogData.description) && (
          <div className="mb-12">
            {blogData.headline && (
              <h2 className="text-3xl font-bold mb-4">{blogData.headline}</h2>
            )}
            {blogData.description && (
              <p className={`text-lg ${blogData.backgroundStyle === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {blogData.description}
              </p>
            )}
          </div>
        )}
        
        {/* Blog Posts */}
        <div className={getLayoutClass()}>
          {blogData.posts?.map((post, idx) => (
            <div 
              key={idx} 
              className={cn(
                "blog-post overflow-hidden",
                blogData.layoutStyle === 'carousel' && "flex-shrink-0 snap-center w-80",
                blogData.layoutStyle === 'list' && "flex flex-col md:flex-row gap-6"
              )}
            >
              {/* Post Image */}
              {post.image && (
                <div 
                  className={cn(
                    "bg-gray-200 bg-opacity-30 rounded overflow-hidden",
                    blogData.layoutStyle === 'list' ? "md:w-1/3 h-48" : "aspect-video w-full"
                  )}
                >
                  <div className="w-full h-full bg-gray-300 bg-opacity-50"></div>
                </div>
              )}
              
              {/* Post Content */}
              <div className={cn(
                "mt-4", 
                blogData.layoutStyle === 'list' && "md:w-2/3"
              )}>
                {/* Category */}
                {blogData.showCategories && post.category && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {post.category}
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                
                {/* Summary */}
                {post.summary && (
                  <p className={`${blogData.backgroundStyle === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    {post.summary}
                  </p>
                )}
                
                {/* Author & Date */}
                <div className="flex items-center justify-between text-sm mt-2">
                  {blogData.showAuthors && post.author && (
                    <div>{post.author}</div>
                  )}
                  {post.date && (
                    <div className="text-gray-500 dark:text-gray-400">{post.date}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
