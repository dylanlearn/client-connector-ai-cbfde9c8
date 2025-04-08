
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
    title,
    subtitle,
    posts = [],
    layout = 'grid',
    featuredPost,
    backgroundStyle,
    alignment,
    postsPerRow = 3
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');
  
  // Grid columns
  const gridCols = postsPerRow === 1 ? 'grid-cols-1' : 
                   postsPerRow === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={`blog-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(title || subtitle) && (
          <div className="section-header mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
            )}
            
            {subtitle && (
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="featured-post mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="featured-image">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {featuredPost.image ? (
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Featured Image
                    </div>
                  )}
                </div>
              </div>
              
              <div className="featured-content flex flex-col justify-center">
                {featuredPost.category && (
                  <div className="category mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                
                <p className="opacity-80 mb-4">{featuredPost.excerpt}</p>
                
                <div className="meta flex items-center text-sm opacity-70 mb-4">
                  {featuredPost.author && (
                    <span className="mr-4">{featuredPost.author}</span>
                  )}
                  
                  {featuredPost.date && (
                    <span>{featuredPost.date}</span>
                  )}
                </div>
                
                <a href={featuredPost.url || '#'} className="inline-flex items-center font-medium text-primary">
                  Read more
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Posts Grid/List */}
        {layout === 'grid' ? (
          <div className={`grid ${gridCols} gap-8`}>
            {posts.map((post: any, index: number) => (
              <div key={index} className="blog-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                {post.image && (
                  <div className="post-image aspect-video">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {post.category && (
                    <div className="category mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="font-bold text-xl mb-3">{post.title}</h3>
                  
                  <p className="opacity-80 mb-4">{post.excerpt}</p>
                  
                  <div className="meta flex items-center text-sm opacity-70 mb-4">
                    {post.author && (
                      <span className="mr-4">{post.author}</span>
                    )}
                    
                    {post.date && (
                      <span>{post.date}</span>
                    )}
                  </div>
                  
                  <a href={post.url || '#'} className="inline-flex items-center font-medium text-primary">
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post: any, index: number) => (
              <div key={index} className="blog-item border-b pb-8 last:border-b-0 last:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {post.image && (
                    <div className="post-image">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className={post.image ? 'md:col-span-2' : 'md:col-span-3'}>
                    <div className="flex items-center justify-between mb-2">
                      {post.category && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {post.category}
                        </span>
                      )}
                      
                      {post.date && (
                        <span className="text-sm opacity-70">{post.date}</span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3">{post.title}</h3>
                    
                    <p className="opacity-80 mb-4">{post.excerpt}</p>
                    
                    <div className="flex justify-between items-center">
                      {post.author && (
                        <span className="text-sm opacity-70">{post.author}</span>
                      )}
                      
                      <a href={post.url || '#'} className="inline-flex items-center font-medium text-primary">
                        Read more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSectionRenderer;
