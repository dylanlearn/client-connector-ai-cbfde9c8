
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const BlogSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };
  
  // Blog post data
  const posts = [
    {
      title: getSuggestion(section.copySuggestions, 'post1Title', 'Getting Started with Our Platform'),
      excerpt: getSuggestion(section.copySuggestions, 'post1Excerpt', 'Learn how to set up your account and start using our platform to its full potential with this comprehensive guide.'),
      category: getSuggestion(section.copySuggestions, 'post1Category', 'Tutorials'),
      date: getSuggestion(section.copySuggestions, 'post1Date', 'July 15, 2023'),
      imageUrl: ''
    },
    {
      title: getSuggestion(section.copySuggestions, 'post2Title', 'Best Practices for Optimizing Performance'),
      excerpt: getSuggestion(section.copySuggestions, 'post2Excerpt', 'Discover the tips and tricks that will help you maximize efficiency and get the most out of our platform.'),
      category: getSuggestion(section.copySuggestions, 'post2Category', 'Tips & Tricks'),
      date: getSuggestion(section.copySuggestions, 'post2Date', 'July 8, 2023'),
      imageUrl: ''
    },
    {
      title: getSuggestion(section.copySuggestions, 'post3Title', 'New Features in Our Latest Update'),
      excerpt: getSuggestion(section.copySuggestions, 'post3Excerpt', 'We\'ve added exciting new capabilities to our platform. Learn about all the new features and how they can benefit your workflow.'),
      category: getSuggestion(section.copySuggestions, 'post3Category', 'Updates'),
      date: getSuggestion(section.copySuggestions, 'post3Date', 'July 1, 2023'),
      imageUrl: ''
    }
  ];
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'From Our Blog')}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Stay updated with our latest articles, news, and insights.')}
          </p>
        </div>
        
        <div className={cn(
          'grid gap-8',
          deviceType === 'mobile' ? 'grid-cols-1' : 
          deviceType === 'tablet' ? 'grid-cols-2' : 
          'grid-cols-3'
        )}>
          {posts.map((post, i) => (
            <div 
              key={i} 
              className={cn(
                'overflow-hidden rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              )}
            >
              <div className={cn(
                'aspect-video bg-gray-300 dark:bg-gray-700'
              )}>
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Blog Image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className={cn(
                    'px-2 py-1 rounded',
                    darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                  )}>
                    {post.category}
                  </span>
                  <span className={cn(
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {post.date}
                  </span>
                </div>
                
                <h3 className={cn(
                  'text-xl font-bold mb-2',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {post.title}
                </h3>
                
                <p className={cn(
                  'mb-4',
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {post.excerpt}
                </p>
                
                <a 
                  href="#" 
                  className={cn(
                    'inline-flex items-center font-medium',
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  )}
                >
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className={cn(
              'inline-flex items-center px-6 py-3 rounded-md font-medium',
              darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {getSuggestion(section.copySuggestions, 'viewAllCta', 'View All Articles')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogSectionRenderer;
