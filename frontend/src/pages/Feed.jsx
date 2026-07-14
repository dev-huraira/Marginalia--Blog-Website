import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import { FileText, Feather } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.posts.getAll();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Could not connect to the literary database.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center py-24 text-ink-muted">
        <div className="w-16 h-[1px] bg-forest mb-4 animate-pulse"></div>
        <p className="font-serif italic animate-pulse text-lg">Gathering written pages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 bg-rose-light/40 border border-rose/10 rounded-sm">
        <h3 className="font-serif text-xl font-medium text-rose mb-2">Failed to load journal feed</h3>
        <p className="text-sm text-ink-muted mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-4 py-2 rounded-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-6 border border-dashed border-ivory-darkest rounded-md bg-ivory-darker/10">
        <FileText className="w-8 h-8 text-ink-light mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-medium text-ink mb-2">The pages are empty</h3>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed">
          No articles have been printed yet. Be the first to grace this volume.
        </p>
        <Link 
          to="/editor" 
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-5 py-2.5 rounded-sm transition-all shadow-sm"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Write a draft</span>
        </Link>
      </div>
    );
  }

  // Asymmetric Layout: Splitting featured post from rest
  const featuredPost = posts[0];
  const listPosts = posts.slice(1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="text-center mb-16 md:mb-24 animate-fade-in">
        <h2 className="font-serif italic text-3xl md:text-4xl text-ink font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
          “Margins are not wasted space; they are where the conversations begin.”
        </h2>
        <div className="w-12 h-[1px] bg-rose/60 mx-auto mt-6"></div>
      </div>

      {/* Featured Post Card (Top Asymmetric Layout) */}
      {featuredPost && (
        <section className="mb-20 md:mb-28 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="border-t-2 border-b-2 border-ink py-10 md:py-14 space-y-6">
            {/* Tag & Category Chrome */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-0.5 text-xs font-sans tracking-widest uppercase bg-rose-light text-rose border border-rose/10 rounded-sm">
                Latest Print
              </span>
              <span className="text-xs font-sans text-ink-muted uppercase tracking-wider">
                {formatDate(featuredPost.createdAt)}
              </span>
              <span className="text-ink-light">•</span>
              <span className="text-xs font-sans text-ink-muted uppercase tracking-wider font-semibold">
                By {featuredPost.author?.name || 'Anonymous'}
              </span>
            </div>

            {/* Title */}
            <Link to={`/posts/${featuredPost._id}`} className="block group">
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink leading-tight group-hover:text-forest transition-colors duration-250">
                {featuredPost.title}
              </h1>
            </Link>

            {/* Asymmetric Excerpt (Pull Quote Style) */}
            <div className="pl-6 border-l-2 border-forest my-6">
              <p className="font-serif text-lg md:text-xl text-ink-muted leading-relaxed italic max-w-reading">
                “{featuredPost.excerpt}”
              </p>
            </div>

            {/* Read Button & tags */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <div className="flex gap-2">
                {featuredPost.tags && featuredPost.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-sans text-ink-muted hover:text-ink transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Link 
                to={`/posts/${featuredPost._id}`}
                className="inline-flex items-center space-x-2 text-sm font-sans font-semibold text-forest hover:text-forest-hover border-b border-forest hover:border-forest-hover transition-colors pb-0.5"
              >
                <span>Read the post</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Feed List Section (Rest of the articles) */}
      {listPosts.length > 0 && (
        <section className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted border-b border-ivory-darkest pb-3 mb-6">
            Recent Publications
          </h2>
          <div className="divide-y divide-ivory-darkest">
            {listPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Feed;
