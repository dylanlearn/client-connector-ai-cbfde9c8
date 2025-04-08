
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const BlogSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    headline,
    description,
    posts = [],
    layoutStyle = 'grid',
    backgroundStyle,
    alignment,
    showCategories,
    showAuthors
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'left');

  // Render posts based on layout style
  const renderPosts = () => {
    switch(layoutStyle) {
      case 'list':
        return (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <div key={index} className="blog-post flex flex-col md:flex-row gap-6">
                {post.image && (
                  <div className="blog-image md:w-1/3">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <div className="blog-content md:w-2/3">
                  {showCategories && post.category && (
                    <div className="category mb-2">
                      <span className="text-sm font-medium text-primary">{post.category}</span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  
                  {post.summary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{post.summary}</p>
                  )}
                  
                  <div className="post-meta flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {showAuthors && post.author && (
                      <span className="mr-4">{post.author}</span>
                    )}
                    
                    {post.date && (
                      <span>{post.date}</span>
                    )}
                  </div>
                  
                  <a 
                    href={post.url} 
                    className="inline-flex items-center mt-4 text-primary hover:underline"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'carousel':
        return (
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6" style={{minWidth: 'max-content'}}>
              {posts.map((post, index) => (
                <div key={index} className="blog-card w-72 flex-shrink-0">
                  {post.image && (
                    <div className="blog-image mb-4">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="blog-content">
                    {showCategories && post.category && (
                      <div className="category mb-2">
                        <span className="text-sm font-medium text-primary">{post.category}</span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                    
                    {post.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{post.summary}</p>
                    )}
                    
                    <div className="post-meta flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {showAuthors && post.author && (
                        <span className="mr-3">{post.author}</span>
                      )}
                      
                      {post.date && (
                        <span>{post.date}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      // Default: grid
      default:
        return (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div key={index} className="blog-card">
                {post.image && (
                  <div className="blog-image mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <div className="blog-content">
                  {showCategories && post.category && (
                    <div className="category mb-2">
                      <span className="text-sm font-medium text-primary">{post.category}</span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  
                  {post.summary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{post.summary}</p>
                  )}
                  
                  <div className="post-meta flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {showAuthors && post.author && (
                      <span className="mr-4">{post.author}</span>
                    )}
                    
                    {post.date && (
                      <span>{post.date}</span>
                    )}
                  </div>
                  
                  <a 
                    href={post.url} 
                    className="inline-flex items-center mt-4 text-primary hover:underline"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className={`blog-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(headline || description) && (
          <div className="section-header mb-12">
            {headline && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{headline}</h2>
            )}
            
            {description && (
              <p className="text-lg opacity-80 max-w-3xl">{description}</p>
            )}
          </div>
        )}
        
        <div className="blog-posts">
          {renderPosts()}
        </div>
        
        <div className="view-all text-center mt-12">
          <a href="/blog" className="inline-flex items-center text-primary hover:underline">
            View All Posts
            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSectionRenderer;
