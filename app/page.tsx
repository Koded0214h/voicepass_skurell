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
  Webhook,
  Code
} from 'lucide-react';
import Link from 'next/link';

export default function VoicePassLanding() {
  const [activeTab, setActiveTab] = useState('integration');

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">VoicePass</span>
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
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          <div className="min-w-0 text-center md:text-left">
            <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Send <span className="text-primary">Voice OTP</span><br />
              via API
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl md:max-w-none mx-auto md:mx-0">
              Secure authentication via automated voice calls. 30% cheaper than SMS.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center md:justify-start">
              <Link href="/signup" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg text-center">
                Get Started
              </Link>
              <a href="#docs" className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary-light transition-colors text-center">
                View Documentation
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center md:text-left">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 sm:mb-1">30%</div>
                <div className="text-xs sm:text-sm text-slate-600">Cost Savings</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 sm:mb-1">95%+</div>
                <div className="text-xs sm:text-sm text-slate-600">Delivery Success</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 sm:mb-1">₦3.8</div>
                <div className="text-xs sm:text-sm text-slate-600">Per Auth</div>
              </div>
            </div>
          </div>
          
          <div className="relative min-w-0">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary-light rounded-full mx-auto mb-3 sm:mb-5 flex items-center justify-center relative">
                  <Phone className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-primary/30 animate-ping" />
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-900 mb-1 sm:mb-2">Incoming OTP Call</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3 tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.5em]">6294</div>
                <div className="text-xs sm:text-sm text-slate-600 px-1">
                  &quot;Your verification code is six-two-nine-four&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">The SMS OTP Problem</h2>
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
      <section id="comparison" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto min-w-0">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">SMS OTP vs VoicePass</h2>
            <p className="text-lg text-slate-600">
              See how VoicePass outperforms traditional SMS authentication in every metric
            </p>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[480px]">
                <thead className="bg-gradient-to-r from-primary to-primary-dark">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-white font-semibold text-sm sm:text-base">Feature</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-white font-semibold text-sm sm:text-base">SMS OTP</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-left text-white font-semibold text-sm sm:text-base">VoicePass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-slate-900 text-sm sm:text-base">Cost per Authentication</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>₦5.0 - ₦8.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>₦3.8</span>
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
                ₦3.8 vs ₦5-8 for SMS. Pay only for connected calls with no wasted spend on failures.
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
      <section id="docs" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto min-w-0">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">API Documentation</h2>
            <p className="text-base sm:text-lg text-slate-600">
              Simple integration in minutes with our REST API
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-sm inline-flex gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('integration')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  activeTab === 'integration'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                Integration Guide
              </button>
            </div>
          </div>

          {/* Integration Guide Tab */}
          {activeTab === 'integration' && (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm min-w-0">
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                      1
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">API Call to Trigger OTP</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Make a POST request to our API with the phone number and OTP code. System immediately triggers the voice call and returns a call ID for tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                      2
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Automated Voice Call</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        System dials the phone number, OTP is read clearly with digit-by-digit repetition, and call ends automatically after delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                      3
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Call Logging & Tracking</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Every call is logged with phone number, call ID, status (answered/failed/busy), duration, and timestamp for full visibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                      4
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Webhook Notifications</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Optional real-time webhooks notify your system when call is initiated, answered, failed, or completed for automated workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
                <div className="bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-700 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 truncate">Send OTP Request</span>
                    <Code className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                  <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
{`curl -X POST https://api.voicepass.com/v1/otp/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+234801*****",
    "otp": "6294"
  }'`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-700 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 truncate">API Response</span>
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  </div>
                  <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
{`{
  "call_id": "call-9f23ab21ess",
  "status": "queue",
  "message":"Voice OTP call initiated"
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-700 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 truncate">Webhook Event</span>
                    <Webhook className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  </div>
                  <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
{`{
  "call_id": "call-9f23ab21ess",
  "duration": 12,
  "cost": 3.8,
  "status": "ANSWERED", // ANSWERED, BUSY, FAILED, NOANSWER, UNAVAILABLE
  "created_at": "2026-02-06T14:30:12Z",
  "start_time": "2026-02-06T14:30:12Z",
  "answer_time": "2026-02-06T14:30:12Z",
  "ring_time": "2026-02-06T14:30:12Z",
  "end_at": "2026-02-06T14:30:12Z",
  "phone_number": "+234801*****",
  "otp": "6294",
  "gender": "female",
  "language": "en"
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
      <section id="demo" className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Save Money and Improve Security?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
            Join leading banks, fintechs, and enterprises using VoicePass
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg">
              Get Started
            </Link>
            <a href="#docs" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6">
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
                <li><a href="mailto:voicepass@skurel.com" className="hover:text-primary transition-colors">voicepass@skurel.com</a></li>
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