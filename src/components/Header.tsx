'use client';

import { Plus, LogOut, Wifi, WifiOff, RefreshCw } from 'lucide-react';

type SyncStatus = 'synced' | 'syncing' | 'offline';

interface Props {
  onAdd: () => void;
  onSignOut: () => void;
  syncStatus: SyncStatus;
  forcedOffline: boolean;
  onToggleNetwork: () => void;
}

const STATUS_CONFIG: Record<SyncStatus, { label: string; className: string }> = {
  synced:  { label: 'Synced',    className: 'status-synced' },
  syncing: { label: 'Syncing…',  className: 'status-syncing' },
  offline: { label: 'Offline',   className: 'status-offline' },
};

export function Header({ onAdd, onSignOut, syncStatus, forcedOffline, onToggleNetwork }: Props) {
  const { label, className } = STATUS_CONFIG[syncStatus];

  return (
    <header>
      <h1>
        SnippetDeck <span>Pro</span>
      </h1>
      <div className="header-actions">
        <button
          className={`status-badge ${className}`}
          onClick={onToggleNetwork}
          title={forcedOffline ? 'Forced offline (demo mode) — click to go online' : 'Click to toggle offline demo mode'}
          aria-label={`Network status: ${label}`}
        >
          {syncStatus === 'offline' && <WifiOff size={13} />}
          {syncStatus === 'syncing' && <RefreshCw size={13} className="spin" />}
          {syncStatus === 'synced'  && <Wifi size={13} />}
          {label}
          {forcedOffline && <span className="demo-tag">demo</span>}
        </button>

        <button className="add-btn" onClick={onAdd}>
          <Plus size={18} /> Add Snippet
        </button>
        <button className="icon-btn" onClick={onSignOut} aria-label="Sign out" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
