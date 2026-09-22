import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Server, Key, ExternalLink, Sparkles, X } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials, isSupabaseConfigured } from '../../lib/supabaseClient';
import { seedDatabaseToSupabase } from '../../services/supabaseService';
import './SupabaseStatusModal.css';

export const SupabaseStatusModal = ({ isOpen, onClose, supabaseStatus }) => {
  const creds = getSupabaseCredentials();
  const [urlInput, setUrlInput] = useState(creds.url || '');
  const [keyInput, setKeyInput] = useState(creds.key || '');
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [seedError, setSeedError] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!urlInput || !keyInput) return;
    saveSupabaseCredentials(urlInput, keyInput);
  };

  const handleClear = () => {
    clearSupabaseCredentials();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    setSeedError(null);
    try {
      const res = await seedDatabaseToSupabase();
      setSeedResult(res);
    } catch (err) {
      setSeedError(err.message || 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySchemaNotice = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isConnected = supabaseStatus === 'connected' || isSupabaseConfigured();

  return (
    <div className="supabase-modal-backdrop" onClick={onClose}>
      <div className="supabase-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="supabase-modal-header">
          <div className="supabase-modal-title">
            <Database className="supabase-header-icon" />
            <div>
              <h3>Supabase Database Hub</h3>
              <p className="supabase-subtitle">Connect PostgreSQL Cloud Database to Meethi Kahani</p>
            </div>
          </div>
          <button className="supabase-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="supabase-modal-body">
          {/* Connection Status Badge Banner */}
          <div className={`supabase-status-banner ${isConnected ? 'connected' : 'fallback'}`}>
            <div className="status-banner-left">
              {isConnected ? (
                <CheckCircle2 className="status-icon green" size={24} />
              ) : (
                <AlertCircle className="status-icon amber" size={24} />
              )}
              <div>
                <strong>
                  {isConnected ? 'Supabase Live Connected' : 'Local Fallback Mode Active'}
                </strong>
                <p>
                  {isConnected
                    ? 'Storefront is synced with your Supabase PostgreSQL cloud database.'
                    : 'Currently using local storage & mock data. Enter your Supabase keys below to connect.'}
                </p>
              </div>
            </div>
            <span className={`status-pill ${isConnected ? 'active' : 'demo'}`}>
              {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
            </span>
          </div>

          {/* Setup / Configuration Form */}
          <form onSubmit={handleSave} className="supabase-config-form">
            <div className="form-group">
              <label>
                <Server size={15} /> Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Key size={15} /> Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                required
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-supabase-save">
                <Sparkles size={16} /> Save & Connect Database
              </button>
              {creds.isConfigured && (
                <button type="button" onClick={handleClear} className="btn-supabase-clear">
                  Disconnect / Reset
                </button>
              )}
            </div>
          </form>

          {/* Quick Actions & Seeding Section */}
          <div className="supabase-tools-section">
            <h4><Database size={16} /> Database Seeder & Schema Tools</h4>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-info">
                  <strong>1-Click Database Seeder</strong>
                  <p>Populates your empty Supabase tables with initial products, categories & reviews.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSeed}
                  disabled={!isConnected || isSeeding}
                  className="btn-tool-action"
                >
                  {isSeeding ? <RefreshCw className="spin" size={16} /> : <Sparkles size={16} />}
                  {isSeeding ? 'Seeding...' : 'Seed Database'}
                </button>
              </div>

              <div className="tool-card">
                <div className="tool-info">
                  <strong>SQL Editor Schema Script</strong>
                  <p>Located in <code>supabase/schema.sql</code> inside project directory.</p>
                </div>
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-tool-link"
                >
                  Supabase Dashboard <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Seed Results Alert */}
            {seedResult && (
              <div className="seed-alert success">
                <CheckCircle2 size={18} />
                <span>Successfully seeded {seedResult.cookies} cookies, {seedResult.categories} categories, {seedResult.coupons} coupons & {seedResult.reviews} reviews!</span>
              </div>
            )}
            {seedError && (
              <div className="seed-alert error">
                <AlertCircle size={18} />
                <span>{seedError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="supabase-modal-footer">
          <button onClick={onClose} className="btn-close-modal">Close</button>
        </div>
      </div>
    </div>
  );
};
