import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import { Feather, ArrowRight, BookOpen, Compass, PenTool, Sparkles } from 'lucide-react';

// Helper component to guarantee motion & ambient cinemagraph execution across all environments
const CinemagraphVideo = ({ src, poster, className }) => {
  const videoRef = React.useRef(null);
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch(() => setVideoLoaded(false));
      }
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* HTML5 Video layer */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        onPlaying={() => setVideoLoaded(true)}
        className={`${className} ${videoLoaded ? 'block' : 'hidden'}`}
      />

      {/* Fallback Ambient Cinemagraph Layer (Runs Ken Burns slow pan & tilt) */}
      {!videoLoaded && (
        <img
          src={poster}
          alt="Ambient literary visual"
          className={`${className} animate-cinemagraph filter contrast-[1.05] sepia-[0.08]`}
        />
      )}

      {/* Natural Sunlight Shimmer Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-forest/20 to-transparent w-full h-full pointer-events-none animate-light-sweep"></div>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.posts.getAll();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Error fetching posts for home landing page:', err);
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

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? posts.slice(1, 5) : [];

  // Warm editorial fallback video cinemagraphs matching the ivory/ink/copper palette
  const defaultVideoThumbnails = [
    "https://cdn.coverr.co/videos/coverr-coffee-and-reading-a-book-5645/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-reading-in-a-library-5165/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-reading-a-book-in-bed-5164/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-writing-in-a-notebook-2646/1080p.mp4"
  ];

  return (
    <div className="space-y-24 md:space-y-36 max-w-6xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="animate-fade-in pt-4 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-rose-light text-rose border border-rose/15 text-xs font-sans uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Literary Platform</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.15] tracking-tight">
              Writing worth sitting with.
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl">
              An independent, distraction-free publication for thoughtful essays, field notes, and annotated ideas. No engagement algorithms — just words and quiet minds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/journal"
                className="inline-flex items-center space-x-2 bg-forest hover:bg-forest-hover text-ivory text-xs uppercase tracking-wider font-sans font-semibold px-6 py-3.5 rounded-sm shadow-sm transition-all"
              >
                <span>Read the Journal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {user ? (
                <Link
                  to="/editor"
                  className="inline-flex items-center space-x-2 border border-ivory-darkest hover:border-forest text-ink text-xs uppercase tracking-wider font-sans px-6 py-3.5 rounded-sm transition-all"
                >
                  <PenTool className="w-3.5 h-3.5 text-forest" />
                  <span>Write a Manuscript</span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 border border-ivory-darkest hover:border-forest text-ink text-xs uppercase tracking-wider font-sans px-6 py-3.5 rounded-sm transition-all"
                >
                  <span>Start Writing</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Visual (Asymmetric Magazine Placement) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background outline frame */}
              <div className="absolute -inset-2 rounded-sm border border-forest/20 translate-x-3 translate-y-3 pointer-events-none"></div>
              
              {/* Editorial Cinemagraph */}
              <div className="relative overflow-hidden rounded-sm border border-ivory-darkest shadow-md bg-ivory-darker group">
                <CinemagraphVideo
                  src="https://cdn.coverr.co/videos/coverr-writing-in-a-notebook-2646/1080p.mp4"
                  poster="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop"
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center filter contrast-[1.05] sepia-[0.08] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Cinemagraph Badge Tag */}
                <div className="absolute bottom-3 left-3 bg-ivory/90 backdrop-blur-md px-3 py-1 rounded border border-ivory-darkest text-[10px] font-sans tracking-widest text-ink-muted uppercase flex items-center space-x-1.5 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
                  <span>Live Cinemagraph • Volume I</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED / EDITOR'S PICK SECTION */}
      <section className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between border-b border-ivory-darkest pb-4">
          <div className="flex items-center space-x-2 text-xs font-sans tracking-widest uppercase text-ink-muted">
            <BookOpen className="w-4 h-4 text-forest" />
            <span>Editor's Selection</span>
          </div>
          <span className="text-xs font-sans text-ink-light uppercase tracking-wider">Featured Story</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-ink-muted font-serif italic animate-pulse">
            Retrieving featured volume...
          </div>
        ) : featuredPost ? (
          <article className="border border-ivory-darkest rounded-md bg-ivory-darker/30 p-6 sm:p-10 transition-all hover:border-forest/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Text Block */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-sans tracking-widest uppercase bg-rose-light text-rose border border-rose/15 rounded-sm">
                    {featuredPost.tags && featuredPost.tags[0] ? featuredPost.tags[0] : 'Featured'}
                  </span>
                  <span className="text-xs font-sans text-ink-muted uppercase">
                    {formatDate(featuredPost.createdAt)}
                  </span>
                  <span className="text-ink-light">•</span>
                  <span className="text-xs font-sans text-ink-muted uppercase font-medium">
                    By {featuredPost.author?.name || 'Anonymous'}
                  </span>
                </div>

                <Link to={`/posts/${featuredPost._id}`} className="block group">
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ink group-hover:text-forest transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <blockquote className="border-l-2 border-forest pl-4 py-1 font-serif italic text-ink-muted text-base sm:text-lg leading-relaxed">
                  “{featuredPost.excerpt}”
                </blockquote>

                <div className="pt-2">
                  <Link
                    to={`/posts/${featuredPost._id}`}
                    className="inline-flex items-center space-x-2 text-xs font-sans font-semibold text-forest hover:text-forest-hover uppercase tracking-wider group"
                  >
                    <span>Read full manuscript</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Cinemagraph Block */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-sm border border-ivory-darkest bg-ivory-darker group">
                  <CinemagraphVideo
                    src="https://cdn.coverr.co/videos/coverr-reading-a-book-in-bed-5164/1080p.mp4"
                    poster="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop"
                    className="w-full h-[220px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </article>
        ) : (
          /* Graceful Zero Posts Case */
          <div className="text-center py-16 px-6 border border-dashed border-ivory-darkest rounded-md bg-ivory-darker/10 space-y-4">
            <Feather className="w-8 h-8 text-forest mx-auto" />
            <h3 className="font-serif text-2xl font-medium text-ink">New here — be the first to publish</h3>
            <p className="text-sm font-serif italic text-ink-muted max-w-md mx-auto">
              Our inaugural pages are waiting. Register a pen name and share your first piece.
            </p>
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-5 py-2.5 rounded-sm transition-all shadow-sm font-sans"
            >
              <span>Write your first post</span>
            </Link>
          </div>
        )}
      </section>

      {/* 3. LATEST WRITING SECTION */}
      {recentPosts.length > 0 && (
        <section className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-ivory-darkest pb-4">
            <h2 className="text-xs font-sans uppercase tracking-widest text-ink-muted">
              Recent Publications
            </h2>
            <Link
              to="/journal"
              className="text-xs font-sans text-forest hover:text-forest-hover uppercase tracking-wider font-semibold flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post, idx) => (
              <article
                key={post._id}
                className="bg-ivory-darker/20 border border-ivory-darkest hover:border-forest/30 p-6 rounded-sm flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-sm border border-ivory-darkest mb-4">
                    <CinemagraphVideo
                      src={defaultVideoThumbnails[idx % defaultVideoThumbnails.length]}
                      className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-sans tracking-widest text-ink-muted uppercase">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>By {post.author?.name || 'Anonymous'}</span>
                  </div>

                  <Link to={`/posts/${post._id}`}>
                    <h3 className="font-serif text-xl font-bold text-ink group-hover:text-forest transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-serif italic text-sm text-ink-muted line-clamp-2">
                    "{post.excerpt}"
                  </p>
                </div>

                <div className="pt-2 border-t border-ivory-darkest/60 flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-rose">
                    {post.tags && post.tags[0] ? `#${post.tags[0]}` : '#essay'}
                  </span>
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-xs font-sans font-semibold text-forest group-hover:underline underline-offset-4 uppercase tracking-wider"
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              to="/journal"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-semibold text-ink hover:text-forest border-b border-ink hover:border-forest transition-colors pb-1"
            >
              <span>Browse all posts in the Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 4. ABOUT / WHY MARGINALIA SECTION */}
      <section id="about" className="scroll-mt-24 border-t border-b border-ivory-darkest py-16 md:py-24 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Supporting Cinemagraph Video */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="overflow-hidden rounded-sm border border-ivory-darkest shadow-sm bg-ivory-darker">
                <CinemagraphVideo
                  src="https://cdn.coverr.co/videos/coverr-coffee-and-reading-a-book-5645/1080p.mp4"
                  poster="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=700&auto=format&fit=crop"
                  className="w-full h-[320px] sm:h-[380px] object-cover object-center filter contrast-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Statement Text */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center space-x-2 text-xs font-sans tracking-widest uppercase text-forest font-semibold">
              <Compass className="w-4 h-4" />
              <span>Editorial Manifesto</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              A sanctuary for quiet prose.
            </h2>

            <div className="space-y-4 font-serif text-base sm:text-lg text-ink-muted leading-relaxed">
              <p>
                Marginalia is a quiet space for writing that doesn't need to perform. No algorithms optimizing for engagement, no flashing notifications — just words, and the people who want to read them.
              </p>
              <p>
                Inspired by physical literary journals and handwritten annotations in well-read volumes, we believe great ideas deserve generous whitespace and high-fidelity typography.
              </p>
            </div>

            <div className="pt-2">
              <div className="inline-block font-serif italic text-sm text-rose border-l-2 border-rose pl-3">
                “Margins are not wasted space; they are where the real conversation begins.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="text-center py-12 px-6 sm:px-12 bg-ivory-darker/40 border border-ivory-darkest rounded-md max-w-3xl mx-auto space-y-6 animate-fade-in">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
          {user ? `Welcome back, ${user.name}` : 'Ready to share your voice?'}
        </h2>
        
        <p className="font-serif italic text-ink-muted text-base max-w-lg mx-auto">
          {user 
            ? 'Your drafting desk is open. Continue working on your manuscripts or explore recent publications.'
            : 'Join our independent community of authors and readers. Distraction-free publishing, simplified.'
          }
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="bg-forest hover:bg-forest-hover text-ivory text-xs uppercase tracking-wider font-sans font-semibold px-6 py-3 rounded-sm shadow-sm transition-all"
              >
                Go to your desk
              </Link>
              <Link
                to="/editor"
                className="border border-ivory-darkest hover:border-forest text-ink text-xs uppercase tracking-wider font-sans px-6 py-3 rounded-sm transition-all"
              >
                Draft new article
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-forest hover:bg-forest-hover text-ivory text-xs uppercase tracking-wider font-sans font-semibold px-6 py-3 rounded-sm shadow-sm transition-all"
              >
                Start Writing Today
              </Link>
              <Link
                to="/login"
                className="border border-ivory-darkest hover:border-forest text-ink text-xs uppercase tracking-wider font-sans px-6 py-3 rounded-sm transition-all"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
