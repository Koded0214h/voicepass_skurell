'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account preferences and configurations</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {[
              { id: 'profile', label: 'Profile', icon: 'person' },
              { id: 'security', label: 'Security', icon: 'lock' },
              { id: 'api', label: 'API Keys', icon: 'key' },
              { id: 'notifications', label: 'Notifications', icon: 'notifications' },
              { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#5da28c] text-[#5da28c]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                <span className="font-semibold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'api' && <APITab showApiKey={showApiKey} setShowApiKey={setShowApiKey} />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'webhooks' && <WebhooksTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const user = data.user || data;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            company: user.company || '',
            phone: user.phone || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSaveChanges() {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h3>
      
      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading profile data...</div>
      ) : (
        <div className="space-y-6">
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="size-20 rounded-full bg-gradient-to-br from-[#5da28c] to-[#4a8572] flex items-center justify-center text-white text-2xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
                disabled={loading || isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
                disabled={loading || isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
                disabled={loading || isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
                disabled={loading || isSaving}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold disabled:bg-slate-400"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <button 
            onClick={handleUpdatePassword}
            disabled={loading}
            className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Two-Factor Authentication</h3>
        <p className="text-sm text-slate-600 mb-4">Add an extra layer of security to your account</p>
        
        <button className="px-6 py-2.5 border border-[#5da28c] text-[#5da28c] rounded-lg hover:bg-[#5da28c]/5 transition-colors font-bold">
          Enable 2FA
        </button>
      </div>
    </div>
  );
}

function APITab({ showApiKey, setShowApiKey }: { showApiKey: boolean; setShowApiKey: (v: boolean) => void }) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchApiKey() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setApiKey(data.api_key ?? '');
        }
      } catch (e) {
        console.error('Failed to fetch API key:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchApiKey();
  }, []);

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement('input');
      input.value = apiKey;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Are you sure? This will invalidate the current key. Any existing integrations using it will stop working.')) return;
    setRegenerating(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate_api_key: true }),
      });
      if (!res.ok) throw new Error('Failed to regenerate');
      const data = await res.json();
      setApiKey(data.api_key ?? '');
    } catch {
      console.error('Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">API Keys</h3>

      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div>
              <p className="text-sm font-semibold text-blue-900">Keep your API keys secure</p>
              <p className="text-sm text-blue-700 mt-1">
                Never share your API keys publicly or commit them to version control
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
          {loading ? (
            <div className="py-4 text-slate-500 text-sm">Loading...</div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  placeholder={apiKey ? undefined : 'No API key set'}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg bg-slate-50 font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title={showApiKey ? 'Hide' : 'Show'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showApiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <button
                onClick={handleCopy}
                disabled={!apiKey}
                className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                title="Copy to clipboard"
              >
                <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                {copied && <span className="text-sm text-green-600">Copied</span>}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                title={apiKey ? 'Regenerate key' : 'Generate key'}
              >
                <span className={`material-symbols-outlined text-[20px] ${regenerating ? 'animate-spin' : ''}`}>refresh</span>
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-3">Test Mode</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" disabled className="w-5 h-5 rounded border-slate-300 text-[#5da28c] focus:ring-[#5da28c]" />
            <div>
              <div className="text-sm font-medium text-slate-900">Enable test mode</div>
              <div className="text-xs text-slate-500">Use test API keys for development</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>
      
      <div className="space-y-6">
        {[
          { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { id: 'sms', label: 'SMS Alerts', desc: 'Get critical alerts via SMS' },
          { id: 'low-balance', label: 'Low Balance Alerts', desc: 'Notify when balance is below ₦100' },
          { id: 'failed-calls', label: 'Failed Call Alerts', desc: 'Alert on failed OTP deliveries' },
          { id: 'weekly-report', label: 'Weekly Reports', desc: 'Receive weekly analytics summary' },
        ].map((item) => (
          <label key={item.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-slate-300 text-[#5da28c] focus:ring-[#5da28c]" />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{item.label}</div>
              <div className="text-sm text-slate-500">{item.desc}</div>
            </div>
          </label>
        ))}

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [currentWebhookUrl, setCurrentWebhookUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchWebhook() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCurrentWebhookUrl(data.webhook_url ?? null);
        }
      } catch (e) {
        console.error('Failed to fetch webhook:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchWebhook();
  }, []);

  const openModal = () => {
    setWebhookUrl(currentWebhookUrl ?? '');
    setMessage(null);
    setShowWebhookModal(true);
  };

  const handleSaveWebhook = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_url: webhookUrl.trim() || '' }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setCurrentWebhookUrl(data.webhook_url ?? null);
      setShowWebhookModal(false);
      setMessage({ type: 'success', text: 'Webhook URL saved successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save webhook URL. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
          <h3 className="text-lg font-bold text-slate-900">Webhook Endpoint</h3>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors text-sm font-bold"
          >
            {currentWebhookUrl ? 'Edit Endpoint' : '+ Add Endpoint'}
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : currentWebhookUrl ? (
          <div className="space-y-3">
            <div className="p-4 border border-slate-200 rounded-lg hover:border-[#5da28c]/50 transition-colors">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  <span className="font-mono text-sm text-slate-900 break-all">{currentWebhookUrl}</span>
                </div>
                <button
                  onClick={openModal}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              <div className="text-xs text-slate-500">Call events (initiated, answered, failed, etc.) are sent to this URL.</div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">webhook</span>
            <p className="text-sm text-slate-500 mb-2">No webhook URL configured</p>
            <p className="text-xs text-slate-400">Add an endpoint to receive call status notifications.</p>
            <button
              onClick={openModal}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
            >
              + Add Endpoint
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Webhook Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'call.initiated',
            'call.ringing',
            'call.answered',
            'call.completed',
            'call.failed',
            'balance.low',
          ].map((event) => (
            <label key={event} className={`flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer ${event !== 'call.completed' ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input type="checkbox" className="rounded border-slate-300 text-[#5da28c] focus:ring-[#5da28c]" disabled={event !== 'call.completed'} />
              <span className={`font-mono text-sm ${event !== 'call.completed' ? 'text-slate-400' : 'text-slate-700'}`}>{event}</span>
            </label>
          ))}
        </div>
      </div>

      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {currentWebhookUrl ? 'Edit Webhook Endpoint' : 'Add Webhook Endpoint'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">Enter the URL where you want to receive call event notifications.</p>

            <input
              type="url"
              placeholder="https://your-app.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowWebhookModal(false); setWebhookUrl(''); setMessage(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWebhook}
                disabled={saving}
                className="px-4 py-2 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}