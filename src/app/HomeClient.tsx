'use client';

import { useState } from 'react';
import { LogIn, Layers, Upload, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { type Snippet } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useSnippets } from '../hooks/useSnippets';
import { useFilters } from '../hooks/useFilters';
import { useClipboard } from '../hooks/useClipboard';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { SnippetCard } from '../components/SnippetCard';
import { SnippetModal } from '../components/SnippetModal';

function FirestoreError({ message }: { message: string }) {
  // Firestore index errors embed the creation URL directly in the message
  const indexUrl = message.match(/https:\/\/console\.firebase\.google\.com\S+/)?.[0];
  const isIndexError = message.includes('index') || message.includes('Index');
  const isPermissionError = message.includes('permission') || message.includes('Missing or insufficient');

  return (
    <div className="firestore-error">
      <AlertCircle size={18} />
      <div className="firestore-error-body">
        <strong>
          {isIndexError && 'Missing Firestore Index'}
          {isPermissionError && 'Firestore Permission Denied'}
          {!isIndexError && !isPermissionError && 'Firestore Error'}
        </strong>
        <p>
          {isIndexError && 'This query needs a composite index on (userId, createdAt).'}
          {isPermissionError && 'Check your Firestore security rules allow reads on the snippets collection.'}
          {!isIndexError && !isPermissionError && message}
        </p>
        {indexUrl && (
          <a href={indexUrl} target="_blank" rel="noopener noreferrer" className="error-link">
            <ExternalLink size={13} /> Create the index in Firebase Console
          </a>
        )}
        {isPermissionError && (
          <a
            href="https://console.firebase.google.com/project/_/firestore/rules"
            target="_blank"
            rel="noopener noreferrer"
            className="error-link"
          >
            <ExternalLink size={13} /> Open Firestore Rules
          </a>
        )}
        <details className="error-details">
          <summary>Raw error</summary>
          <code>{message}</code>
        </details>
      </div>
    </div>
  );
}

function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <Layers size={40} />
        </div>
        <h1>SnippetDeck <span>Pro</span></h1>
        <p>Smart technical snippets for effortless demos.</p>
        <button className="google-btn" onClick={onSignIn}>
          <LogIn size={18} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

interface SnippetAppProps {
  uid: string;
  displayName: string;
  onSignOut: () => void;
}

function SnippetApp({ uid, displayName, onSignOut }: SnippetAppProps) {
  const {
    snippets, loading, error, hasPendingWrites, fromCache,
    addSnippet, updateSnippet, deleteSnippet, toggleFavorite, seedSnippets,
  } = useSnippets({ uid, displayName });
  const { search, setSearch, selectedCategories, toggleCategory, filteredSnippets } =
    useFilters(snippets);
  const { copiedId, copy } = useClipboard();
  const { isOnline, forcedOffline, toggleNetwork } = useNetworkStatus();

  const syncStatus = !isOnline
    ? 'offline'
    : hasPendingWrites || fromCache
    ? 'syncing'
    : 'synced';

  const [showModal, setShowModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const handleSeedSnippets = async () => {
    setIsSeeding(true);
    setSeedError(null);
    try {
      await seedSnippets();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Check Firestore rules.';
      setSeedError(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const openAdd = () => {
    setEditingSnippet(null);
    setShowModal(true);
  };

  const openEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setShowModal(true);
  };

  const handleSave = async (data: Pick<Snippet, 'title' | 'description' | 'content' | 'categories'>) => {
    if (editingSnippet) {
      await updateSnippet(editingSnippet.id, data);
    } else {
      await addSnippet(data);
    }
    setShowModal(false);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header
          onAdd={openAdd}
          onSignOut={onSignOut}
          syncStatus={syncStatus}
          forcedOffline={forcedOffline}
          onToggleNetwork={toggleNetwork}
        />
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={selectedCategories} onToggle={toggleCategory} />

        <div className="snippet-list">
          {loading && <p className="empty-state">Loading snippets...</p>}
          {!loading && error && <FirestoreError message={error} />}
          {!loading && filteredSnippets.length === 0 && (
            <div className="empty-state">
              {snippets.length === 0 ? (
                <>
                  <p>Your snippet deck is empty.</p>
                  <button
                    className="seed-btn"
                    onClick={handleSeedSnippets}
                    disabled={isSeeding}
                  >
                    {isSeeding
                      ? <><RefreshCw size={14} className="spin" /> Uploading to Firebase…</>
                      : <><Upload size={14} /> Load sample snippets</>
                    }
                  </button>
                  {seedError && (
                    <div className="seed-error">
                      <AlertCircle size={14} />
                      {seedError}
                    </div>
                  )}
                </>
              ) : (
                <p>No snippets match your search.</p>
              )}
            </div>
          )}
          {filteredSnippets.map(snippet => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              copiedId={copiedId}
              onCopy={copy}
              onEdit={openEdit}
              onDelete={deleteSnippet}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {showModal && (
          <SnippetModal
            editingSnippet={editingSnippet}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { user, userProfile, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="login-screen">
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} />;
  }

  const displayName =
    userProfile?.displayName ?? user.displayName ?? user.email ?? user.uid;

  return (
    <SnippetApp
      uid={user.uid}
      displayName={displayName}
      onSignOut={signOut}
    />
  );
}
