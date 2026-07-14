import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Edit3, Trash2, BookOpen, FileText, Plus, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab controller: 'published' or 'drafts'
  const [activeTab, setActiveTab] = useState('published');

  const fetchMyPosts = async () => {
    try {
      const data = await api.posts.getMyPosts();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to retrieve your publications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you certain you wish to remove this manuscript? This action cannot be undone.')) {
      try {
        const res = await api.posts.delete(postId);
        if (res.success) {
          // Filter out of state
          setPosts(posts.filter(p => p._id !== postId));
        }
      } catch (err) {
        alert(err.message || 'Failed to delete post');
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center py-24 text-ink-muted">
        <div className="w-16 h-[1px] bg-forest mb-4 animate-pulse"></div>
        <p className="font-serif italic animate-pulse text-lg">Opening your writing bureau...</p>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');

  const currentTabPosts = activeTab === 'published' ? publishedPosts : draftPosts;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Dashboard Greeting Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-ivory-darkest pb-6 mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">
            Writer’s Desk
          </h1>
          <p className="text-sm text-ink-muted mt-1 font-sans">
            Welcome back, <span className="font-semibold text-ink">{user?.name}</span>. Review your archives and drafts.
          </p>
        </div>

        <Link
          to="/editor"
          className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-5 py-2.5 rounded shadow-sm font-semibold transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-rose-light text-rose text-sm border border-rose/15 rounded-sm">
          {error}
        </div>
      )}

      {/* Overview Stats (Quiet text cards) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-ivory-darker border border-ivory-darkest p-4 rounded-sm">
          <span className="text-[10px] uppercase font-sans tracking-widest text-ink-muted">Published Works</span>
          <p className="font-serif text-3xl font-bold text-ink mt-1">{publishedPosts.length}</p>
        </div>
        <div className="bg-ivory-darker border border-ivory-darkest p-4 rounded-sm">
          <span className="text-[10px] uppercase font-sans tracking-widest text-ink-muted">Unfinished Drafts</span>
          <p className="font-serif text-3xl font-bold text-ink mt-1">{draftPosts.length}</p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-ivory-darkest mb-6">
        <button
          onClick={() => setActiveTab('published')}
          className={`py-3 px-6 text-xs uppercase tracking-wider font-sans font-semibold border-b-2 transition-all ${
            activeTab === 'published'
              ? 'border-forest text-forest'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          Published Publications ({publishedPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`py-3 px-6 text-xs uppercase tracking-wider font-sans font-semibold border-b-2 transition-all ${
            activeTab === 'drafts'
              ? 'border-forest text-forest'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          Drafting Archive ({draftPosts.length})
        </button>
      </div>

      {/* Main List Workspace */}
      {currentTabPosts.length === 0 ? (
        // Empty states
        <div className="text-center py-16 px-6 border border-dashed border-ivory-darkest rounded-md bg-ivory-darker/10">
          {activeTab === 'published' ? (
            <>
              <BookOpen className="w-8 h-8 text-ink-light mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-ink mb-1">No published works</h3>
              <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto leading-relaxed">
                You haven't printed any papers to the public catalog yet. Draft an article and toggle status to published.
              </p>
              {draftPosts.length > 0 && (
                <button
                  onClick={() => setActiveTab('drafts')}
                  className="text-xs uppercase tracking-wider text-forest font-semibold border-b border-forest pb-0.5 hover:text-forest-hover"
                >
                  View your drafts instead
                </button>
              )}
            </>
          ) : (
            <>
              <FileText className="w-8 h-8 text-ink-light mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-ink mb-1">Your draft ledger is clean</h3>
              <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto leading-relaxed">
                You haven’t written anything yet. Take a moment to set down your ideas on the canvas.
              </p>
              <Link
                to="/editor"
                className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-4 py-2 rounded-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write your first post</span>
              </Link>
            </>
          )}
        </div>
      ) : (
        // Table list of items
        <div className="space-y-4">
          {currentTabPosts.map((post) => (
            <div 
              key={post._id}
              className="bg-ivory-darker/40 hover:bg-ivory-darker/70 border border-ivory-darkest rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
            >
              {/* Left Item Block */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2 text-[10px] font-sans tracking-widest text-ink-muted uppercase">
                  <span>{formatDate(post.createdAt)}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-rose font-medium">{post.tags.slice(0,2).join(', ')}</span>
                    </>
                  )}
                </div>
                
                <h3 className="font-serif text-xl font-bold text-ink leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-xs font-serif text-ink-muted line-clamp-1 italic">
                  "{post.excerpt}"
                </p>
              </div>

              {/* Right Action Block */}
              <div className="flex items-center space-x-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-ivory-darkest">
                {post.status === 'published' && (
                  <Link
                    to={`/posts/${post._id}`}
                    className="p-2 text-ink-muted hover:text-forest border border-ivory-darkest hover:border-forest/20 rounded bg-ivory/50 transition-colors"
                    title="View Publication"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                
                <Link
                  to={`/editor/${post._id}`}
                  className="p-2 text-ink-muted hover:text-forest border border-ivory-darkest hover:border-forest/20 rounded bg-ivory/50 transition-colors"
                  title="Edit Manuscript"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 text-ink-muted hover:text-rose border border-ivory-darkest hover:border-rose/20 rounded bg-ivory/50 transition-colors"
                  title="Delete Manuscript"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
