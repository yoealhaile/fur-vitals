'use client';

import React from 'react';
import { Syringe, Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DogData } from '@/lib/types';

interface VaccineTrackerProps {
  dogData: DogData;
}

interface Vaccine {
  name: string;
  date: string;
  status: string;
}

interface Reminder {
  type: string;
  due_date: string;
  status: string;
}

export default function VaccineTracker({ dogData }: VaccineTrackerProps) {
  const medicalRecords = (dogData as any).medical_records || { vaccines: [], upcoming_reminders: [] };
  const vaccines: Vaccine[] = medicalRecords.vaccines || [];
  const reminders: Reminder[] = medicalRecords.upcoming_reminders || [];

  const calculateDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getUrgencyColor = (days: number, status?: string): { bg: string; text: string; border: string; isUrgent: boolean } => {
    // Check if marked as urgent or due today (0 days)
    if (status === 'urgent' || days === 0) {
      return { 
        bg: 'bg-gradient-to-r from-red-100 via-orange-100 to-red-100', 
        text: 'text-red-800', 
        border: 'border-red-400',
        isUrgent: true
      };
    }
    if (days < 0) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', isUrgent: false };
    if (days <= 14) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', isUrgent: false };
    if (days <= 30) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', isUrgent: false };
    return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', isUrgent: false };
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-xl border-2 border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-2xl">
          <Syringe className="w-6 h-6 text-cyan-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Vaccine & Medical Tracker</h3>
          <p className="text-sm text-gray-600">Stay up to date with health care</p>
        </div>
      </div>

      {/* Completed Vaccines */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Completed Vaccinations
        </h4>
        <div className="space-y-2">
          {vaccines.map((vaccine, idx) => (
            <div 
              key={idx}
              className="bg-white/80 rounded-2xl p-4 border-2 border-white flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{vaccine.name}</p>
                  <p className="text-xs text-gray-600">{formatDate(vaccine.date)}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 rounded-full border border-green-300">
                <span className="text-xs font-bold text-green-700">✓ Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-white/80 rounded-2xl p-4 border-2 border-white">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          Next Up
        </h4>
        <div className="space-y-3">
          {reminders.map((reminder, idx) => {
            const daysRemaining = calculateDaysRemaining(reminder.due_date);
            const urgency = getUrgencyColor(daysRemaining, reminder.status);
            const isOverdue = daysRemaining < 0;
            const isDueToday = daysRemaining === 0 || reminder.status === 'urgent';
            
            return (
              <div 
                key={idx}
                className={`${urgency.bg} rounded-2xl p-4 border-2 ${urgency.border} group hover:shadow-md transition-shadow ${
                  urgency.isUrgent ? 'animate-pulse shadow-lg shadow-red-200' : ''
                }`}
              >
                {/* URGENT TODAY Banner */}
                {isDueToday && (
                  <div className="mb-3 -mt-2 -mx-2 px-4 py-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-t-2xl flex items-center justify-center gap-2">
                    <span className="animate-ping inline-block w-2 h-2 bg-white rounded-full"></span>
                    <span className="w-2 h-2 bg-white rounded-full -ml-2"></span>
                    <p className="text-white font-bold text-sm">
                      🚨 Action Required: {dogData.name} is due for {reminder.type} TODAY!
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${urgency.isUrgent ? 'bg-red-200 animate-pulse' : urgency.bg} rounded-full flex items-center justify-center border-2 ${urgency.border}`}>
                      {reminder.type.includes('Deworm') ? (
                        <Shield className={`w-5 h-5 ${urgency.text}`} />
                      ) : (
                        <Syringe className={`w-5 h-5 ${urgency.text}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-bold ${isDueToday ? 'text-red-900' : 'text-gray-900'}`}>
                        {reminder.type}
                      </p>
                      <p className="text-xs text-gray-600">Due: {formatDate(reminder.due_date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isOverdue ? (
                      <div className="flex items-center gap-1 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-bold">Overdue!</span>
                      </div>
                    ) : isDueToday ? (
                      <div className="flex items-center gap-1 text-red-800">
                        <AlertCircle className="w-5 h-5 animate-bounce" />
                        <span className="text-lg font-bold">TODAY</span>
                      </div>
                    ) : (
                      <>
                        <p className={`text-2xl font-bold ${urgency.text}`}>{daysRemaining}</p>
                        <p className="text-xs text-gray-600">days left</p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Progress bar */}
                {!isDueToday && !isOverdue && (
                  <div className="mt-3">
                    <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${
                          daysRemaining <= 14 
                            ? 'from-orange-400 to-red-400' 
                            : daysRemaining <= 30 
                            ? 'from-yellow-400 to-orange-400'
                            : 'from-green-400 to-emerald-400'
                        } transition-all`}
                        style={{ width: `${Math.max(10, 100 - (daysRemaining / 60) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Vaccines Up-to-Date</p>
          <p className="text-2xl font-bold text-green-600">{vaccines.length}</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Upcoming</p>
          <p className="text-2xl font-bold text-purple-900">{reminders.length}</p>
        </div>
      </div>
    </div>
  );
}
