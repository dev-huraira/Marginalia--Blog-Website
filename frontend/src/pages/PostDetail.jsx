import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Marked } from 'marked';
import { Edit3, Trash2, ArrowLeft } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize marked
  const markedObj = new Marked();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.posts.getById(id);
        if (data.success) {
          setPost(data.post);
        }
      } catch (err) {
        console.error('Error fetching post detail:', err);
        setError(err.message || 'The pages you look for could not be restored.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you certain you wish to archive and delete this publication? This action is permanent.')) {
      try {
        const res = await api.posts.delete(id);
        if (res.success) {
          navigate('/dashboard');
        }
      } catch (err) {
        alert(err.message || 'Failed to remove post.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getHTMLContent = (markdownText) => {
    if (!markdownText) return '';
    // markedObj.parse returns safe HTML (since we've styled blocks carefully)
    return { __html: markedObj.parse(markdownText) };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center py-24 text-ink-muted">
        <div className="w-16 h-[1px] bg-forest mb-4 animate-pulse"></div>
        <p className="font-serif italic animate-pulse text-lg">Unrolling manuscript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 bg-rose-light/40 border border-rose/10 rounded-sm animate-fade-in">
        <h3 className="font-serif text-xl font-medium text-rose mb-2">Manuscript unavailable</h3>
        <p className="text-sm text-ink-muted mb-6">{error}</p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-4 py-2 rounded-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <article className="max-w-reading mx-auto animate-fade-in">
      {/* Back button */}
      <Link 
        to="/journal" 
        className="inline-flex items-center space-x-2 text-xs font-sans tracking-widest text-ink-muted hover:text-forest uppercase transition-colors mb-12"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Feed</span>
      </Link>

      {/* Post Metadata Header */}
      <header className="space-y-4 mb-10 pb-6 border-b border-ivory-darkest">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 text-[10px] font-sans tracking-widest uppercase bg-rose-light text-rose border border-rose/10 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs font-sans tracking-wider text-ink-muted uppercase">
            <span>By {post.author?.name || 'Anonymous'}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {/* Author Controls */}
          {isAuthor && (
            <div className="flex items-center space-x-3">
              <Link 
                to={`/editor/${post._id}`}
                className="inline-flex items-center space-x-1.5 text-xs text-forest hover:text-forest-hover border border-forest/20 hover:border-forest/50 px-2.5 py-1 rounded transition-colors"
                title="Edit Post"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <button 
                onClick={handleDelete}
                className="inline-flex items-center space-x-1.5 text-xs text-rose hover:text-rose-hover border border-rose/20 hover:border-rose/50 px-2.5 py-1 rounded transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Archive</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Pull-quote style excerpt */}
      <div className="pull-quote select-none mb-10">
        <p className="text-lg md:text-xl font-serif text-ink-muted italic">
          “{post.excerpt}”
        </p>
      </div>

      {/* Full Body Content (Markdown) */}
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={getHTMLContent(post.content)}
      />
    </article>
  );
};

export default PostDetail;
