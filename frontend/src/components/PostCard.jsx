import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { _id, title, excerpt, author, createdAt, tags } = post;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="py-8 border-b border-ivory-darkest group transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left Side: Metadata */}
        <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2 text-xs font-sans tracking-wider text-ink-muted uppercase">
          <span>{formatDate(createdAt)}</span>
          <span className="hidden md:inline-block w-4 h-[1px] bg-ivory-darkest"></span>
          <span>By {author?.name || 'Anonymous'}</span>
        </div>

        {/* Right Side: Title and Excerpt */}
        <div className="w-full md:w-3/4 flex flex-col space-y-3">
          <Link to={`/posts/${_id}`} className="block">
            <h3 className="font-serif text-2xl font-semibold text-ink group-hover:text-forest transition-colors duration-200 leading-tight">
              {title}
            </h3>
          </Link>
          
          <p className="font-serif text-ink-muted text-base leading-relaxed line-clamp-2 italic">
            "{excerpt}"
          </p>

          {/* Tags and Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-wrap gap-1.5">
              {tags && tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 text-[10px] font-sans tracking-widest uppercase bg-rose-light text-rose border border-rose/10 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link 
              to={`/posts/${_id}`} 
              className="text-xs font-sans font-medium text-forest hover:text-forest-hover group-hover:underline underline-offset-4 transition-colors uppercase tracking-wider"
            >
              Read Page
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
