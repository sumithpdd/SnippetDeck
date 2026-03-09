import { useState } from 'react';
import { MOCK_DATA, CATEGORIES, type Snippet } from './types';
import { Search, Plus, Trash2, Edit2, Copy, Star, Check, X } from 'lucide-react';

const App = () => {
  const [snippets, setSnippets] = useState<Snippet[]>(MOCK_DATA);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<Snippet | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Snippet>>({
    title: '',
    content: '',
    categories: []
  });

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
                             selectedCategories.every(cat => s.categories.includes(cat));
    return matchesSearch && matchesCategories;
  }).sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  const toggleCategoryFilter = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const copyToClipboard = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.content);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) return;

    if (isEditing) {
      setSnippets(prev => prev.map(s => s.id === isEditing.id ? { 
        ...s, 
        ...formData, 
        updatedAt: new Date().toISOString() 
      } as Snippet : s));
    } else {
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        title: formData.title!,
        content: formData.content!,
        categories: formData.categories || [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSnippets(prev => [...prev, newSnippet]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', categories: [] });
    setIsEditing(null);
    setShowForm(false);
  };

  const deleteSnippet = (id: string) => {
    if (confirm('Delete this snippet?')) {
      setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  return (
    <div className="app-container">
      <header>
        <h1>SnippetDeck <span>Pro</span></h1>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Snippet
        </button>
      </header>

      {/* Search & Filters */}
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search snippets..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <div className="categories-filter">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`tag-btn ${selectedCategories.includes(cat) ? 'active' : ''}`}
            onClick={() => toggleCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Snippet List */}
      <div className="snippet-list">
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className={`snippet-card ${snippet.isFavorite ? 'fav' : ''}`}>
            <div className="card-header">
              <h3>{snippet.title}</h3>
              <div className="actions">
                <button onClick={() => toggleFavorite(snippet.id)} className={snippet.isFavorite ? 'active' : ''}>
                  <Star size={16} fill={snippet.isFavorite ? "currentColor" : "none"} />
                </button>
                <button onClick={() => { setIsEditing(snippet); setFormData(snippet); setShowForm(true); }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteSnippet(snippet.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <pre className="content-box">{snippet.content}</pre>
            
            <div className="card-footer">
              <div className="tags">
                {snippet.categories.map(c => <span key={c} className="tag">{c}</span>)}
              </div>
              <button className="copy-btn" onClick={() => copyToClipboard(snippet)}>
                {copiedId === snippet.id ? <Check size={16} /> : <Copy size={16} />}
                {copiedId === snippet.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal Overlay */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Snippet' : 'New Snippet'}</h2>
              <button onClick={resetForm}><X size={20} /></button>
            </div>
            
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label>Content (Multiline)</label>
              <textarea 
                rows={5} 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Categories (Select Multiple)</label>
              <div className="category-select">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`tag-btn ${formData.categories?.includes(cat) ? 'active' : ''}`}
                    onClick={() => {
                      const current = formData.categories || [];
                      const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
                      setFormData({...formData, categories: updated});
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save Snippet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
