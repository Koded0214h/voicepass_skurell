'use client';

import { useState } from 'react';

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
        <div className="border-b border-slate-200">
          <div className="flex gap-6">
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
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@voicepass.io',
    company: 'VoicePass Inc.',
    phone: '+234 801 234 5678',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h3>
      
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="size-20 rounded-full bg-gradient-to-br from-[#5da28c] to-[#4a8572] flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>
          <div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
              Change Avatar
            </button>
            <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max. 2MB)</p>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none"
            />
          </div>

          <button className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold">
            Update Password
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
  const apiKey = 'vp_live_1234567890abcdefghijklmnopqrstuvwxyz';

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
          <label className="block text-sm font-medium text-slate-700 mb-2">Production API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg bg-slate-50 font-mono text-sm"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showApiKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <button className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined">content_copy</span>
            </button>
            <button className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Last used: 2 hours ago</p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-3">Test Mode</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#5da28c] focus:ring-[#5da28c]" />
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
          <button className="px-6 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors font-bold">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function WebhooksTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Webhook Endpoints</h3>
          <button className="px-4 py-2 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] transition-colors text-sm font-bold">
            + Add Endpoint
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 border border-slate-200 rounded-lg hover:border-[#5da28c]/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-mono text-sm text-slate-900">https://api.myapp.com/webhooks/voicepass</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Events: call.completed, call.failed</span>
              <span>•</span>
              <span>Last delivery: 5 mins ago</span>
            </div>
          </div>

          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">webhook</span>
            <p className="text-sm text-slate-500">No additional webhooks configured</p>
          </div>
        </div>
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
            <label key={event} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-[#5da28c] focus:ring-[#5da28c]" />
              <span className="font-mono text-sm text-slate-700">{event}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}