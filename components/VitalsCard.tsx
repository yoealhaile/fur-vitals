import React from 'react';
import { Heart, Wind, Thermometer, Activity } from 'lucide-react';
import { CurrentVitals } from '@/lib/types';

interface VitalsCardProps {
  vitals: CurrentVitals;
  dogName: string;
}

export default function VitalsCard({ vitals, dogName }: VitalsCardProps) {
  // Helper function to get status and range info for each vital
  const getVitalInfo = (label: string, value: number): { status: string; range: string; position: string } => {
    switch (label) {
      case 'Heart Rate':
        const hrRange = '60-90';
        const hrStatus = value < 70 ? 'Optimal' : value < 90 ? 'Good' : 'Needs Attention';
        const hrPosition = `${value} BPM (Range: ${hrRange})`;
        return { status: hrStatus, range: hrRange, position: hrPosition };
      case 'Respiratory Rate':
        const rrRange = '18-25';
        const rrStatus = value < 22 ? 'Optimal' : value < 26 ? 'Good' : 'Needs Attention';
        const rrPosition = `${value} BrPM (Range: ${rrRange})`;
        return { status: rrStatus, range: rrRange, position: rrPosition };
      case 'Body Temp':
        const tempRange = '101-102.5';
        const tempStatus = value >= 101 && value <= 102.5 ? 'Optimal' : 'Good';
        const tempPosition = `${value}°F (Range: ${tempRange})`;
        return { status: tempStatus, range: tempRange, position: tempPosition };
      case 'HRV':
        const hrvRange = '40-60';
        const hrvStatus = value >= 50 ? 'Optimal' : value >= 40 ? 'Good' : 'Needs Attention';
        const hrvPosition = `${value} ms (Range: ${hrvRange})`;
        return { status: hrvStatus, range: hrvRange, position: hrvPosition };
      default:
        return { status: 'Good', range: 'N/A', position: `${value}` };
    }
  };

  const vitalMetrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: vitals.heart_rate_bpm,
      unit: 'BPM',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      ...getVitalInfo('Heart Rate', vitals.heart_rate_bpm),
    },
    {
      icon: Wind,
      label: 'Respiratory Rate',
      value: vitals.respiratory_rate_srr,
      unit: 'BrPM',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
      ...getVitalInfo('Respiratory Rate', vitals.respiratory_rate_srr),
    },
    {
      icon: Thermometer,
      label: 'Body Temp',
      value: vitals.body_temp_f,
      unit: '°F',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      ...getVitalInfo('Body Temp', vitals.body_temp_f),
    },
    {
      icon: Activity,
      label: 'HRV',
      value: vitals.hrv_ms,
      unit: 'ms',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      ...getVitalInfo('HRV', vitals.hrv_ms),
    },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-pink-200 rounded-2xl animate-float">
          <Heart className="w-6 h-6 text-pink-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {dogName}'s Vitals 💖
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(vitals.last_updated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {vitalMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-2xl p-4 
                         transition-all hover:shadow-lg hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-xs font-bold text-gray-700">
                  {metric.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
                <span className="text-sm font-semibold text-gray-500">{metric.unit}</span>
              </div>
              {/* Range Info */}
              <p className="text-xs text-gray-600 mb-2 font-semibold">
                Range: {metric.range}
              </p>
              {/* Status Badge */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                metric.status === 'Optimal' 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : metric.status === 'Good'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              }`}>
                {metric.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
