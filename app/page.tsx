'use client';

import { useState } from 'react';
import { 
  Phone, 
  Shield, 
  TrendingUp, 
  Zap, 
  Clock, 
  Lock, 
  DollarSign, 
  Frown,
  CheckCircle2,
  XCircle,
  Wallet,
  ShieldCheck,
  PhoneCall,
  Smile,
  Building2,
  ShoppingCart,
  Heart,
  Building,
  Radio,
  Briefcase,
  Key,
  Webhook,
  Code,
  BarChart3,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function VoicePassLanding() {
  const [activeTab, setActiveTab] = useState('integration');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">VoicePass</span>
          </div>
          
          <ul className="hidden md:flex items-center gap-8">
            <li><a href="#features" className="text-slate-600 hover:text-primary transition-colors font-medium">Features</a></li>
            <li><a href="#comparison" className="text-slate-600 hover:text-primary transition-colors font-medium">Comparison</a></li>
            <li><a href="#docs" className="text-slate-600 hover:text-primary transition-colors font-medium">Documentation</a></li>
            <li><a href="#use-cases" className="text-slate-600 hover:text-primary transition-colors font-medium">Use Cases</a></li>
          </ul>
          
          <div className="flex gap-3">
            <Link href="/login" className="hidden sm:block px-5 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary-light transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Voice OTP <span className="text-primary">Authentication</span> System
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Secure authentication via automated voice calls. 30% cheaper than SMS, 
              fraud-resistant, and 95%+ delivery success. No internet required.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/signup" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg">
                Get Started
              </Link>
              <a href="#docs" className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary-light transition-colors">
                View Documentation
              </a>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-1">30%</div>
                <div className="text-sm text-slate-600">Cost Savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-1">95%+</div>
                <div className="text-sm text-slate-600">Delivery Success</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-1">₦3.5</div>
                <div className="text-sm text-slate-600">Per Authentication</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-primary-light rounded-full mx-auto mb-5 flex items-center justify-center relative">
                  <Phone className="w-10 h-10 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                </div>
                <div className="font-semibold text-slate-900 mb-2">Incoming OTP Call</div>
                <div className="text-5xl font-bold text-primary mb-3 tracking-[0.5em]">6294</div>
                <div className="text-sm text-slate-600">
                  "Your verification code is six-two-nine-four"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The SMS OTP Problem</h2>
            <p className="text-lg text-slate-600">
              Why businesses are losing money and customers with traditional SMS authentication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Delivery Issues</h3>
              <p className="text-slate-600 leading-relaxed">
                SMS frequently delayed or never delivered, especially in poor network areas. Users abandon authentication flows.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Security Vulnerabilities</h3>
              <p className="text-slate-600 leading-relaxed">
                Exposed to SIM swap attacks, SMS interception, and SS7 exploits that compromise user accounts.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hidden Costs</h3>
              <p className="text-slate-600 leading-relaxed">
                You pay for failed messages, retries, and undelivered SMS. Costs add up quickly without guarantees.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <Frown className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Poor User Experience</h3>
              <p className="text-slate-600 leading-relaxed">
                Users must wait, read carefully, and type correctly. Often frustrating for elderly or visually impaired users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">SMS OTP vs VoicePass</h2>
            <p className="text-lg text-slate-600">
              See how VoicePass outperforms traditional SMS authentication in every metric
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-primary-dark">
                  <tr>
                    <th className="px-6 py-5 text-left text-white font-semibold">Feature</th>
                    <th className="px-6 py-5 text-left text-white font-semibold">SMS OTP</th>
                    <th className="px-6 py-5 text-left text-white font-semibold">VoicePass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Cost per Authentication</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>₦5.0 - ₦8.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>₦3.5</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Delivery Success Rate</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>70-85%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>95%+</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Payment Model</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Pay even if failed</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Pay only for connected calls</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">SIM Swap Protection</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Vulnerable</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Protected</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">SMS Interception Risk</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>High Risk</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>No Text to Intercept</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">SS7 Exploit Immunity</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Vulnerable</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Voice routing bypasses SMS</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Works in Poor Coverage</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Often Fails</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Reliable</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Accessible for Elderly</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Difficult</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Easy - Just listen</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">Visually Impaired Support</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Poor</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Excellent</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Calculate Your Savings</h2>
            <p className="text-lg text-slate-600">
              See how much you'll save by switching to VoicePass authentication
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">
              Cost Comparison: 1 Million OTP Authentications
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-red-50 rounded-2xl p-8 text-center border-2 border-red-200">
                <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">SMS OTP</div>
                <div className="text-5xl font-bold text-red-600 mb-2">₦5M</div>
                <div className="text-sm text-slate-600">1,000,000 × ₦5.0</div>
              </div>
              
              <div className="bg-primary-light rounded-2xl p-8 text-center border-2 border-primary">
                <div className="text-sm font-bold text-primary uppercase tracking-wider mb-3">VoicePass</div>
                <div className="text-5xl font-bold text-primary mb-2">₦3.5M</div>
                <div className="text-sm text-slate-600">1,000,000 × ₦3.5</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-10 text-center text-white">
              <h3 className="text-2xl font-semibold mb-3">Total Annual Savings</h3>
              <div className="text-6xl font-bold mb-3">₦1.5M</div>
              <p className="text-white/90">Pure operational savings with better reliability and security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose VoicePass</h2>
            <p className="text-lg text-slate-600">
              Four compelling reasons to switch your authentication system
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-8 text-center hover:bg-primary-light hover:-translate-y-2 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">30-55% Lower Cost</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ₦3.5 vs ₦5-8 for SMS. Pay only for connected calls with no wasted spend on failures.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 text-center hover:bg-primary-light hover:-translate-y-2 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fraud-Resistant</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Immune to SIM swap, SMS interception, and SS7 exploits. User must answer in real-time.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 text-center hover:bg-primary-light hover:-translate-y-2 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <PhoneCall className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">95%+ Delivery Rate</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Calls connect when SMS fails. Works in rural areas with instant delivery and no delays.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 text-center hover:bg-primary-light hover:-translate-y-2 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Smile className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Better UX</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No reading or typing stress. Accessible for elderly and visually impaired users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">API Documentation</h2>
            <p className="text-lg text-slate-600">
              Simple integration in minutes with our REST API
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-2 rounded-xl shadow-sm inline-flex gap-2">
              <button
                onClick={() => setActiveTab('integration')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'integration'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                Integration Guide
              </button>
              <button
                onClick={() => setActiveTab('api-reference')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'api-reference'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                API Reference
              </button>
            </div>
          </div>

          {/* Integration Guide Tab */}
          {activeTab === 'integration' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">API Call to Trigger OTP</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Make a POST request to our API with the phone number and OTP code. System immediately triggers the voice call and returns a call ID for tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Voice Call</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        System dials the phone number, OTP is read clearly with digit-by-digit repetition, and call ends automatically after delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Call Logging & Tracking</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Every call is logged with phone number, call ID, status (answered/failed/busy), duration, and timestamp for full visibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Webhook Notifications</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Optional real-time webhooks notify your system when call is initiated, answered, failed, or completed for automated workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Send OTP Request</span>
                    <Code className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`curl -X POST https://api.voicepass.com/v1/otp/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+2348012345678",
    "otp_code": "6294",
    "callback_url": "https://yourapp.com/webhook"
  }'`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">API Response</span>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "success": true,
  "call_id": "VPC-20240129-ABC123",
  "status": "initiated",
  "timestamp": "2024-01-29T14:30:00Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Webhook Event</span>
                    <Webhook className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "event": "call.answered",
  "call_id": "VPC-20240129-ABC123",
  "duration": 12,
  "cost": 3.5,
  "timestamp": "2024-01-29T14:30:12Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Reference Tab */}
          {activeTab === 'api-reference' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Authentication</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        Include your API key in the Authorization header
                      </p>
                      <div className="bg-slate-900 rounded-lg p-3">
                        <code className="text-xs text-slate-300">Authorization: Bearer YOUR_API_KEY</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Request Parameters</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-slate-900">phone_number</span>
                          <span className="text-red-500">*</span>
                          <p className="text-slate-600">International format with country code</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">otp_code</span>
                          <span className="text-red-500">*</span>
                          <p className="text-slate-600">4-6 digit code to be delivered</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">callback_url</span>
                          <p className="text-slate-600">Optional webhook endpoint for events</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Rate Limiting</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        100 requests per minute per API key. Contact sales for higher limits or enterprise plans.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Webhook Events</h3>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">call.initiated</span> - Call started</div>
                        <div><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">call.answered</span> - User picked up</div>
                        <div><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">call.failed</span> - Delivery failed</div>
                        <div><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">call.completed</span> - Call ended</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Reference Code Examples */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Get Call Status</span>
                    <Code className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`curl -X GET https://api.voicepass.com/v1/otp/:call_id \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "call_id": "VPC-20240129-ABC123",
  "phone_number": "+234801****678",
  "status": "answered",
  "duration": 12,
  "cost": 3.5,
  "created_at": "2024-01-29T14:30:00Z",
  "completed_at": "2024-01-29T14:30:12Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Get Account Balance</span>
                    <Wallet className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`curl -X GET https://api.voicepass.com/v1/account/balance \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "balance": 250000.00,
  "currency": "NGN"
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Get Call Logs</span>
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
{`curl -X GET "https://api.voicepass.com/v1/otp/logs?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "logs": [...],
  "total": 1250,
  "page": 1
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Ideal Use Cases</h2>
            <p className="text-lg text-slate-600">
              Perfect for industries where security and reliability matter most
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <Building2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">Banking & Fintech</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Secure account authentication, transaction authorization, and payment confirmation with fraud-resistant voice delivery.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <ShoppingCart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">E-commerce</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Login verification, password reset, and order confirmation with high delivery success rates across all networks.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">Healthcare</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Patient appointment verification, prescription authorization, and secure access to medical records with HIPAA compliance.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <Building className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">Government Services</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Citizen identity verification, benefits authorization, and secure access to government portals with accessibility features.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <Radio className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">Telecommunications</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                SIM activation, account recovery, and service changes with protection against SIM swap fraud attacks.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all">
              <Briefcase className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-3">Enterprise</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Employee authentication, VPN access, and sensitive system logins with enterprise-grade security and compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-20 px-6 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Save Money and Improve Security?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join leading banks, fintechs, and enterprises using VoicePass
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:08069335817" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg">
              Contact Sales: 08069335817
            </a>
            <a href="#docs" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VoicePass</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Voice OTP Authentication System by Skurel Limited. Cheaper, Safer & More Reliable Than SMS OTP.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#comparison" className="text-slate-400 hover:text-primary transition-colors">Comparison</a></li>
                <li><a href="#docs" className="text-slate-400 hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#use-cases" className="text-slate-400 hover:text-primary transition-colors">Use Cases</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-slate-400 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#support" className="text-slate-400 hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="tel:08069335817" className="hover:text-primary transition-colors">08069335817</a></li>
                <li><a href="mailto:sales@voicepass.com" className="hover:text-primary transition-colors">sales@voicepass.com</a></li>
                <li>Skurel Limited</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>&copy; 2024 VoicePass by Skurel Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}