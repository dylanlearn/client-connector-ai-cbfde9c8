
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
      onClick();
    }
  };
  
  // Sample blog posts using getSuggestion helper
  const posts = [
    {
      title: getSuggestion(section.copySuggestions, 'post1Title', 'Getting Started with Our Product'),
      excerpt: getSuggestion(section.copySuggestions, 'post1Excerpt', 'Learn how to set up your account and start using our product to improve your workflow.'),
      author: getSuggestion(section.copySuggestions, 'post1Author', 'John Smith'),
      date: getSuggestion(section.copySuggestions, 'post1Date', 'June 15, 2023'),
      category: getSuggestion(section.copySuggestions, 'post1Category', 'Tutorials')
    },
    {
      title: getSuggestion(section.copySuggestions, 'post2Title', '5 Tips to Maximize Productivity'),
      excerpt: getSuggestion(section.copySuggestions, 'post2Excerpt', 'Discover the best practices for getting more done in less time with our platform.'),
      author: getSuggestion(section.copySuggestions, 'post2Author', 'Sarah Johnson'),
      date: getSuggestion(section.copySuggestions, 'post2Date', 'June 10, 2023'),
      category: getSuggestion(section.copySuggestions, 'post2Category', 'Best Practices')
    },
    {
      title: getSuggestion(section.copySuggestions, 'post3Title', 'New Features Release: What\'s New'),
      excerpt: getSuggestion(section.copySuggestions, 'post3Excerpt', 'Explore the latest features we\'ve added to enhance your experience and productivity.'),
      author: getSuggestion(section.copySuggestions, 'post3Author', 'Michael Brown'),
      date: getSuggestion(section.copySuggestions, 'post3Date', 'June 5, 2023'),
      category: getSuggestion(section.copySuggestions, 'post3Category', 'Updates')
    }
  ];
  
  if (deviceType === 'mobile') {
    // Show fewer posts on mobile
    posts.length = 2;
  }
  
  // Use createStyleObject to ensure properly typed styles
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
      <div className="max-w-7xl mx-auto">
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
            {getSuggestion(section.copySuggestions, 'subheading', 'Latest news, tips, and insights from our team.')}
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
                'rounded-lg overflow-hidden',
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              )}
            >
              <div className={cn(
                'h-48 bg-gray-300',
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              )}>
                {/* Placeholder for image */}
              </div>
              <div className="p-6">
                <div className={cn(
                  'text-sm mb-2',
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                )}>
                  {post.category}
                </div>
                <h3 className={cn(
                  'text-xl font-bold mb-3',
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
                <div className="flex justify-between items-center">
                  <div className={cn(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {post.author}
                  </div>
                  <div className={cn(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {post.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className={cn(
            'px-6 py-2 rounded-md font-medium',
            darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}>
            {getSuggestion(section.copySuggestions, 'viewAllButton', 'View All Posts')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogSectionRenderer;
