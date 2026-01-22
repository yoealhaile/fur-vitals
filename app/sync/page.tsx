'use client';

import React, { useState, useEffect } from 'react';
import { Bluetooth, CheckCircle, Loader, Radio, Shield, FileText, Plus, Edit, Trash2, Smartphone, Download, Apple } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';

interface Tracker {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  renewalDate: string;
  deductible: string;
}

export default function SyncPage() {
  const { dogData, updateDogData, connectedTrackers: globalTrackers, setConnectedTrackers: setGlobalTrackers } = useApp();
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const connectedTrackers = globalTrackers; // Use global state
  const [activeTab, setActiveTab] = useState<'trackers' | 'medical' | 'insurance' | 'wearables'>('wearables');
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [appleHealthConnected, setAppleHealthConnected] = useState(false);
  const [showAppleInstructions, setShowAppleInstructions] = useState(false);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [insurance, setInsurance] = useState<Insurance>({
    provider: '',
    policyNumber: '',
    renewalDate: '',
    deductible: '',
  });

  const trackers: Tracker[] = [
    {
      id: 'fitbark',
      name: 'FitBark',
      logo: '🐾',
      description: 'Track activity, sleep, and health insights',
      color: 'from-cyan-200 to-teal-200',
    },
    {
      id: 'whistle',
      name: 'Whistle',
      logo: '📍',
      description: 'GPS tracking and activity monitoring',
      color: 'from-purple-200 to-indigo-200',
    },
    {
      id: 'tractive',
      name: 'Tractive',
      logo: '🛰️',
      description: 'Real-time location and wellness tracking',
      color: 'from-rose-200 to-pink-200',
    },
  ];

  const handleConnect = (trackerId: string) => {
    setConnectingTo(trackerId);
    
    // Simulate connection process
    setTimeout(() => {
      setConnectedTrackers((prev) => [...prev, trackerId]);
      setConnectingTo(null);
    }, 3000);
  };

  const handleDisconnect = (trackerId: string) => {
    setGlobalTrackers(connectedTrackers.filter((id) => id !== trackerId));
  };

  // Check for Google Fit and Apple Health connection status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check cookies for connection status
      const googleFit = document.cookie.includes('google_fit_connected=true');
      const appleHealth = document.cookie.includes('apple_health_connected=true');
      setGoogleFitConnected(googleFit);
      setAppleHealthConnected(appleHealth);
    }
  }, []);

  // Handle Google Fit connection
  const handleGoogleFitConnect = () => {
    window.location.href = '/api/auth/google';
  };

  // Handle Google Fit disconnect
  const handleGoogleFitDisconnect = async () => {
    try {
      await fetch('/api/health/google', { method: 'DELETE' });
      setGoogleFitConnected(false);
      alert('Google Fit disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect Google Fit:', error);
      alert('Failed to disconnect Google Fit');
    }
  };

  // Handle Apple Health disconnect
  const handleAppleHealthDisconnect = async () => {
    try {
      await fetch('/api/health/apple', { method: 'DELETE' });
      setAppleHealthConnected(false);
      alert('Apple Health disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect Apple Health:', error);
      alert('Failed to disconnect Apple Health');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b-4 border-teal-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl">
              <Bluetooth className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                Medical Center
              </h1>
              <p className="text-sm text-gray-600 font-semibold">Manage health records & devices</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('wearables')}
              className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'wearables'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              }`}
            >
              📱 Wearables
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'medical'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              }`}
            >
              🏥 Medical
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'insurance'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              }`}
            >
              📋 Insurance
            </button>
            <button
              onClick={() => setActiveTab('trackers')}
              className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'trackers'
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              }`}
            >
              🐾 Dog Trackers
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Wearables Tab - Google Fit & Apple Health */}
        {activeTab === 'wearables' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-300 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-200 rounded-xl">
                  <Smartphone className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Sync Your Health Data</h3>
                  <p className="text-sm text-gray-700">
                    Connect Google Fit or Apple Health to automatically sync your activity data and improve {dogData?.name || 'your dog'}'s wellness tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Fit Card */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                    🏃
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Google Fit</h3>
                    <p className="text-sm text-gray-600">Track steps, activity & heart rate</p>
                  </div>
                </div>
                {googleFitConnected && (
                  <div className="px-3 py-1 bg-green-100 rounded-full flex items-center gap-2 border-2 border-green-300">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">Connected</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-4">
                {googleFitConnected 
                  ? 'Your Google Fit data is syncing automatically. Activity and health metrics will update daily.' 
                  : 'Connect your Google account to sync activity data from Google Fit, including steps, active minutes, and heart rate data.'}
              </p>

              {googleFitConnected ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Last Sync</p>
                        <p className="text-xs text-gray-600">Just now</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleFitDisconnect}
                    className="w-full py-3 rounded-full border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-all"
                  >
                    Disconnect Google Fit
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleFitConnect}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  Connect Google Fit
                </button>
              )}
            </div>

            {/* Apple Health Card */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                    ❤️
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Apple Health</h3>
                    <p className="text-sm text-gray-600">iOS Shortcuts integration</p>
                  </div>
                </div>
                {appleHealthConnected && (
                  <div className="px-3 py-1 bg-green-100 rounded-full flex items-center gap-2 border-2 border-green-300">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">Connected</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-4">
                {appleHealthConnected 
                  ? 'Your Apple Health data is syncing via Shortcuts. Data will update when you run the shortcut.' 
                  : 'Connect Apple Health using our iOS Shortcut to sync your activity data automatically.'}
              </p>

              {appleHealthConnected ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Last Sync</p>
                        <p className="text-xs text-gray-600">Today</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <button
                    onClick={handleAppleHealthDisconnect}
                    className="w-full py-3 rounded-full border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-all"
                  >
                    Disconnect Apple Health
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAppleInstructions(!showAppleInstructions)}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Apple className="w-5 h-5" />
                    Connect Apple Health
                  </button>

                  {showAppleInstructions && (
                    <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Setup Instructions
                      </h4>
                      <ol className="space-y-2 text-sm text-gray-700 mb-4">
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">1.</span>
                          <span>Open Safari on your iPhone</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">2.</span>
                          <span>Download the FurVitals shortcut below</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">3.</span>
                          <span>Tap "Add Shortcut" when prompted</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">4.</span>
                          <span>Run the shortcut daily to sync your health data</span>
                        </li>
                      </ol>
                      <a
                        href="/apple-health-shortcut.shortcut"
                        download
                        className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download FurVitals Shortcut
                      </a>
                      <p className="text-xs text-gray-600 mt-3 text-center">
                        The shortcut will send your activity data securely to FurVitals
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Data Privacy Notice */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200 p-6">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Your Data is Secure
              </h3>
              <p className="text-sm text-gray-700">
                We only access activity and health metrics. Your data is encrypted and never shared with third parties. You can disconnect at any time.
              </p>
            </div>
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            {/* Vaccine History */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-600" />
                  Vaccination History
                </h3>
                <button 
                  onClick={() => alert('Add vaccine feature - Coming in Phase 3!')}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white font-bold text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {(dogData as any).medical_records?.vaccines?.map((vaccine: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <div>
                      <p className="font-bold text-gray-900">{vaccine.name}</p>
                      <p className="text-sm text-gray-600">{new Date(vaccine.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-green-200 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-green-700" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Notes */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Medical Notes
              </h3>
              <textarea
                placeholder="Add any medical notes, allergies, or conditions..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold min-h-32"
              />
            </div>
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Insurance Policy</h3>
              
              {!showAddInsurance ? (
                <button
                  onClick={() => setShowAddInsurance(true)}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Insurance Policy
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={insurance.provider}
                    onChange={(e) => setInsurance({...insurance, provider: e.target.value})}
                    placeholder="Insurance Provider (e.g., Trupanion)"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                  />
                  <input
                    type="text"
                    value={insurance.policyNumber}
                    onChange={(e) => setInsurance({...insurance, policyNumber: e.target.value})}
                    placeholder="Policy Number"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                  />
                  <input
                    type="date"
                    value={insurance.renewalDate}
                    onChange={(e) => setInsurance({...insurance, renewalDate: e.target.value})}
                    placeholder="Renewal Date"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                  />
                  <input
                    type="number"
                    value={insurance.deductible}
                    onChange={(e) => setInsurance({...insurance, deductible: e.target.value})}
                    placeholder="Annual Deductible ($)"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                  />
                  <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-full text-white font-bold">
                    Save Policy
                  </button>
                </div>
              )}
            </div>

            {/* Coverage Checker */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's Covered?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Wellness Exams', 'Surgery', 'Emergency Care', 'Medications', 'Diagnostics', 'Dental'].map((item) => (
                  <div key={item} className="flex items-center gap-2 p-3 bg-green-50 rounded-2xl border-2 border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Coverage details based on your policy
              </p>
            </div>
          </div>
        )}

        {/* Trackers Tab */}
        {activeTab === 'trackers' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl border-2 border-yellow-300 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-200 rounded-xl">
                  <Radio className="w-6 h-6 text-yellow-700" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">How it works</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Make sure your tracker is powered on</li>
                    <li>• Enable Bluetooth on your device</li>
                    <li>• Click "Connect" to start scanning</li>
                    <li>• Follow any additional prompts from your tracker</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tracker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackers.map((tracker) => {
            const isConnecting = connectingTo === tracker.id;
            const isConnected = connectedTrackers.includes(tracker.id);

            return (
              <div
                key={tracker.id}
                className={`bg-white rounded-3xl shadow-lg border-2 p-6 transition-all ${
                  isConnected
                    ? 'border-green-400 shadow-green-100'
                    : 'border-white/50 hover:shadow-xl hover:scale-102'
                }`}
              >
                {/* Logo */}
                <div className={`w-20 h-20 bg-gradient-to-br ${tracker.color} rounded-full flex items-center justify-center text-4xl mb-4 mx-auto shadow-md`}>
                  {tracker.logo}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {tracker.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center mb-4">
                  {tracker.description}
                </p>

                {/* Status */}
                {isConnected && (
                  <div className="mb-4 py-2 bg-green-100 rounded-full flex items-center justify-center gap-2 border-2 border-green-300">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Connected</span>
                  </div>
                )}

                {isConnecting && (
                  <div className="mb-4 py-2 bg-blue-100 rounded-full flex items-center justify-center gap-2 border-2 border-blue-300">
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-bold text-blue-700">Scanning...</span>
                  </div>
                )}

                {/* Connect/Disconnect Button */}
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(tracker.id)}
                    className="w-full py-3 rounded-full border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(tracker.id)}
                    disabled={isConnecting}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            );
          })}
            </div>

            {/* Connected Devices Summary */}
            {connectedTrackers.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Active Connections
            </h3>
            <div className="space-y-2">
              {connectedTrackers.length > 0 ? (
                connectedTrackers.map((trackerId) => {
                  const tracker = trackers.find((t) => t.id === trackerId);
                  if (!tracker) return null;
                  return (
                    <div
                      key={trackerId}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tracker.logo}</span>
                        <div>
                          <p className="font-bold text-gray-900">{tracker.name}</p>
                          <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Connected
                          </p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  No devices connected. Go to Trackers tab to connect.
                </p>
              )}
            </div>
          </div>
            )}

            {/* Coming Soon */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 font-semibold">
                More integrations coming soon! 🚀
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <span className="text-3xl opacity-50">⌚</span>
                <span className="text-3xl opacity-50">📱</span>
                <span className="text-3xl opacity-50">🏥</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
