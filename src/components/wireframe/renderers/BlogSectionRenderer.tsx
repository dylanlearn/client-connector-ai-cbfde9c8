
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
  
  // Layout specific classes
  const layoutClass = layoutStyle === 'list' 
    ? 'space-y-8' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <section className={`blog-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(headline || description) && (
          <div className="section-header mb-12">
            {headline && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{headline}</h2>
            )}
            
            {description && (
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{description}</p>
            )}
          </div>
        )}
        
        <div className={layoutClass}>
          {posts.map((post: any, index: number) => (
            <div 
              key={index}
              className={`blog-post ${
                layoutStyle === 'list' 
                  ? 'flex flex-col md:flex-row gap-6' 
                  : ''
              }`}
            >
              {/* Post Image */}
              {post.image && (
                <div className={`blog-post-image ${layoutStyle === 'list' ? 'md:w-1/3' : 'mb-4'}`}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Post Content */}
              <div className={layoutStyle === 'list' && post.image ? 'md:w-2/3' : ''}>
                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                  {showCategories && post.category && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      {post.category}
                    </span>
                  )}
                  
                  {post.date && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {post.date}
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-2">
                  <a href={post.url || '#'} className="hover:text-primary">
                    {post.title}
                  </a>
                </h3>
                
                {/* Summary */}
                {post.summary && (
                  <p className="opacity-80 mb-4">{post.summary}</p>
                )}
                
                {/* Author */}
                {showAuthors && post.author && (
                  <div className="flex items-center mt-4">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                    <span className="text-sm">{post.author}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSectionRenderer;
