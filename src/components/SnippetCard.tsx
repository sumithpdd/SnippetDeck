'use client';

import { useState } from 'react';
import { Star, Edit2, Trash2, Copy, Check, X } from 'lucide-react';
import { type Snippet } from '../types';

interface Props {
  snippet: Snippet;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function SnippetCard({
  snippet,
  copiedId,
  onCopy,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const isCopied = copiedId === snippet.id;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`snippet-card ${snippet.isFavorite ? 'fav' : ''}`}>
      <div className="card-header">
        <h3>{snippet.title}</h3>
        <div className="actions">
          {confirmDelete ? (
            <>
              <span className="delete-confirm-label">Delete?</span>
              <button
                className="delete-confirm-yes"
                onClick={() => onDelete(snippet.id)}
                aria-label="Confirm delete"
              >
                <Check size={14} /> Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                aria-label="Cancel delete"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleFavorite(snippet.id, snippet.isFavorite)}
                className={snippet.isFavorite ? 'active' : ''}
                aria-label={snippet.isFavorite ? 'Unmark favorite' : 'Mark as favorite'}
              >
                <Star size={16} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => onEdit(snippet)} aria-label="Edit snippet">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setConfirmDelete(true)} aria-label="Delete snippet">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      <pre className="content-box">{snippet.content}</pre>

      <div className="card-footer">
        <div className="tags">
          {snippet.categories.map(c => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <button
          className="copy-btn"
          onClick={() => onCopy(snippet.id, snippet.content)}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
