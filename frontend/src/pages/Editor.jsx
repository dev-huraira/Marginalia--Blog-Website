import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Marked } from 'marked';
import { Eye, Edit3, Save, ArrowLeft, Bold, Italic, Quote, Heading1, Heading2, Link } from 'lucide-react';

const Editor = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft'); // draft or published

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Tab control for mobile view (Write vs Preview)
  const [activeTab, setActiveTab] = useState('write'); // write or preview

  const markedObj = new Marked();

  // Load existing post if in edit mode
  useEffect(() => {
    if (id) {
      const fetchPostDetails = async () => {
        setFetchLoading(true);
        try {
          // Note: we can fetch my posts specifically to ensure we can edit drafts too
          const res = await api.posts.getMyPosts();
          if (res.success) {
            const existingPost = res.posts.find(p => p._id === id);
            if (existingPost) {
              setTitle(existingPost.title);
              setExcerpt(existingPost.excerpt);
              setContent(existingPost.content);
              setTagsInput(existingPost.tags ? existingPost.tags.join(', ') : '');
              setStatus(existingPost.status);
            } else {
              setError('Post not found or unauthorized to edit.');
            }
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch post details for edit.');
        } finally {
          setFetchLoading(false);
        }
      };

      fetchPostDetails();
    }
  }, [id]);

  // Insert markdown tag helper at cursor position
  const insertMarkdown = (syntaxType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    let replacement = '';

    switch (syntaxType) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'heading1':
        replacement = `\n# ${selected || 'Heading 1'}\n`;
        break;
      case 'heading2':
        replacement = `\n## ${selected || 'Heading 2'}\n`;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'Quote'}\n`;
        break;
      case 'link':
        replacement = `[${selected || 'link text'}](https://example.com)`;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    // Reposition cursor after state update
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      setError('Title, pull-quote excerpt, and content are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const tagsArray = tagsInput
      ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const postData = {
      title,
      excerpt,
      content,
      tags: tagsArray,
      status,
    };

    try {
      let res;
      if (id) {
        res = await api.posts.update(id, postData);
      } else {
        res = await api.posts.create(postData);
      }

      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while saving manuscript.');
    } finally {
      setLoading(false);
    }
  };

  const getHTMLPreview = () => {
    if (!content) {
      return `<p class="text-ink-light italic">Type in the canvas panel to see it typeset here...</p>`;
    }
    return markedObj.parse(content);
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center py-24 text-ink-muted">
        <div className="w-16 h-[1px] bg-forest mb-4 animate-pulse"></div>
        <p className="font-serif italic animate-pulse text-lg">Retrieving post manuscript...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Editor Header Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-ivory-darkest">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-sans tracking-widest text-ink-muted hover:text-ink uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>

        <h1 className="font-serif text-xl font-semibold italic text-ink">
          {id ? 'Edit Manuscript' : 'New Manuscript'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-light text-rose text-sm border border-rose/15 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Title and Excerpt Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs uppercase tracking-wider text-ink-muted font-sans font-medium">Post Title</label>
            <input
              type="text"
              placeholder="e.g. The Quiet Solitude of Margins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-ivory-darker border border-ivory-darkest rounded px-4 py-2.5 font-serif text-lg focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-ink placeholder-ink-light/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-ink-muted font-sans font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="poetry, history, notes"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-ivory-darker border border-ivory-darkest rounded px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-ink placeholder-ink-light/50"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-ink-muted font-sans font-medium flex justify-between">
            <span>Excerpt / Pull-quote</span>
            <span className="text-[10px] text-ink-light lowercase">({excerpt.length}/300 chars)</span>
          </label>
          <textarea
            placeholder="Write a brief, evocative summary or a central quote from the article. This serves as the reader's gateway."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
            rows="2"
            className="w-full bg-ivory-darker border border-ivory-darkest rounded px-4 py-2.5 font-serif italic text-base focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-ink-muted placeholder-ink-light/50 resize-none"
          />
        </div>

        {/* Desktop Tab Selector (Write vs Preview Side-by-Side) */}
        {/* On mobile, this switches tabs. On desktop, both are visible side-by-side. */}
        <div className="flex md:hidden border-b border-ivory-darkest mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-sans font-semibold border-b-2 flex items-center justify-center space-x-1.5 ${
              activeTab === 'write' ? 'border-forest text-forest' : 'border-transparent text-ink-muted'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-sans font-semibold border-b-2 flex items-center justify-center space-x-1.5 ${
              activeTab === 'preview' ? 'border-forest text-forest' : 'border-transparent text-ink-muted'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Dual Panel Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
          {/* Write Panel */}
          <div className={`flex flex-col space-y-2 ${activeTab === 'write' ? 'block' : 'hidden md:flex'}`}>
            <div className="flex items-center justify-between bg-ivory-darker border border-b-0 border-ivory-darkest px-3 py-1.5 rounded-t gap-1">
              <span className="text-[10px] uppercase font-sans tracking-wider text-ink-muted">Formatting Tools</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => insertMarkdown('bold')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('italic')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('heading1')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Heading 1"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('heading2')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Heading 2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('quote')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('link')}
                  className="p-1 hover:bg-ivory-darkest text-ink rounded"
                  title="Link"
                >
                  <Link className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              placeholder="Enter markdown formatted text. Rest your mind and write..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-grow w-full bg-ivory-darker border border-ivory-darkest rounded-b p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-forest text-ink placeholder-ink-light/50 h-[450px]"
            />
          </div>

          {/* Preview Panel */}
          <div className={`flex flex-col space-y-2 ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
            <div className="bg-ivory-darker border border-b-0 border-ivory-darkest px-4 py-2 rounded-t">
              <span className="text-[10px] uppercase font-sans tracking-wider text-ink-muted">Page Typographer Preview</span>
            </div>
            
            <div className="flex-grow border border-ivory-darkest bg-ivory/50 rounded-b p-6 overflow-y-auto h-[450px] markdown-content select-none">
              <div dangerouslySetInnerHTML={{ __html: getHTMLPreview() }} />
            </div>
          </div>
        </div>

        {/* Footer controls: Status and Publish buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-ivory-darkest pt-6 gap-4">
          {/* Status Selection */}
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-wider text-ink-muted font-sans font-medium">Publication State:</span>
            <div className="inline-flex rounded-sm border border-ivory-darkest p-0.5 bg-ivory-darker">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-sans rounded-sm transition-all ${
                  status === 'draft'
                    ? 'bg-rose text-ivory font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-sans rounded-sm transition-all ${
                  status === 'published'
                    ? 'bg-forest text-ivory font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Publish
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-initial text-xs uppercase tracking-wider text-ink-muted hover:text-ink font-sans px-5 py-2.5 border border-ivory-darkest rounded transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-6 py-2.5 rounded shadow-sm font-semibold transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Manuscript'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;
