'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, type Snippet } from '../types';

type SnippetFormData = Pick<Snippet, 'title' | 'description' | 'content' | 'categories'>;

interface Props {
  editingSnippet: Snippet | null;
  onSave: (data: SnippetFormData) => void;
  onClose: () => void;
}

const EMPTY_FORM: SnippetFormData = { title: '', description: '', content: '', categories: [] };

export function SnippetModal({ editingSnippet, onSave, onClose }: Props) {
  const [form, setForm] = useState<SnippetFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof SnippetFormData, string>>>({});

  useEffect(() => {
    setForm(
      editingSnippet
        ? {
            title: editingSnippet.title,
            description: editingSnippet.description ?? '',
            content: editingSnippet.content,
            categories: editingSnippet.categories,
          }
        : EMPTY_FORM
    );
    setErrors({});
  }, [editingSnippet]);

  const handleSave = () => {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.content.trim()) next.content = 'Content is required.';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onSave(form);
  };

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingSnippet ? 'Edit Snippet' : 'New Snippet'}</h2>
          <button onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            className={errors.title ? 'input-error' : ''}
            onChange={e => {
              setForm(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
            }}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="Short summary of what this snippet does"
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Content (Multiline)</label>
          <textarea
            rows={5}
            value={form.content}
            className={errors.content ? 'input-error' : ''}
            onChange={e => {
              setForm(prev => ({ ...prev, content: e.target.value }));
              if (errors.content) setErrors(prev => ({ ...prev, content: undefined }));
            }}
          />
          {errors.content && <span className="field-error">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label>Categories (Select Multiple)</label>
          <div className="category-select">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`tag-btn ${form.categories.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Snippet
          </button>
        </div>
      </div>
    </div>
  );
}
