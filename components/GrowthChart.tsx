import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { DogData, BreedData } from '@/lib/types';

interface GrowthChartProps {
  dogData: DogData;
  breedData: BreedData;
}

interface GrowthPoint {
  age_months: number;
  weight_lbs: number;
  height_inches?: number;
}

export default function GrowthChart({ dogData, breedData }: GrowthChartProps) {
  // Breed standard growth curve for Golden Retrievers (Large breed)
  const breedStandard: GrowthPoint[] = [
    { age_months: 2, weight_lbs: 15, height_inches: 10 },
    { age_months: 6, weight_lbs: 40, height_inches: 17 },
    { age_months: 12, weight_lbs: 60, height_inches: 21 },
    { age_months: 24, weight_lbs: 68, height_inches: 22.5 },
    { age_months: 36, weight_lbs: 70, height_inches: 23 },
    { age_months: 48, weight_lbs: 70, height_inches: 23 },
    { age_months: 60, weight_lbs: 70, height_inches: 23 },
    { age_months: 74, weight_lbs: 70, height_inches: 23 },
  ];

  const dogGrowth = (dogData as any).growth_history || [];

  // Calculate percentile (simplified)
  const calculatePercentile = (age: number, weight: number): number => {
    const standardAtAge = breedStandard.find(p => p.age_months === age);
    if (!standardAtAge) return 50; // default
    
    const diff = weight - standardAtAge.weight_lbs;
    const percentile = 50 + (diff / standardAtAge.weight_lbs) * 30; // rough approximation
    return Math.max(10, Math.min(90, percentile));
  };

  // Find max values for scaling
  const maxWeight = Math.max(
    ...dogGrowth.map((p: GrowthPoint) => p.weight_lbs),
    ...breedStandard.map(p => p.weight_lbs)
  ) + 10;

  const maxAge = Math.max(
    ...dogGrowth.map((p: GrowthPoint) => p.age_months),
    ...breedStandard.map(p => p.age_months)
  );

  // Simple line chart renderer
  const chartWidth = 100; // percentage
  const chartHeight = 200; // pixels

  const getX = (age: number) => (age / maxAge) * chartWidth;
  const getY = (weight: number) => chartHeight - (weight / maxWeight) * chartHeight;

  // Generate SVG path for dog's growth
  const dogPath = dogGrowth
    .map((point: GrowthPoint, idx: number) => {
      const x = getX(point.age_months);
      const y = getY(point.weight_lbs);
      return idx === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate SVG path for breed standard
  const breedPath = breedStandard
    .map((point, idx) => {
      const x = getX(point.age_months);
      const y = getY(point.weight_lbs);
      return idx === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const currentPercentile = dogGrowth.length > 0 
    ? calculatePercentile(dogGrowth[dogGrowth.length - 1].age_months, dogGrowth[dogGrowth.length - 1].weight_lbs)
    : 50;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-200 rounded-2xl animate-float">
            <TrendingUp className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Growth Percentile</h3>
            <p className="text-sm text-gray-600">vs. {breedData.breed} standard</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 bg-teal-200 px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-teal-700" />
            <span className="font-bold text-teal-900">{currentPercentile.toFixed(0)}th</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">percentile</p>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white/80 rounded-2xl p-6 border-2 border-white">
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={(y / 100) * chartHeight}
                x2={chartWidth}
                y2={(y / 100) * chartHeight}
                stroke="#e5e7eb"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}

            {/* Breed standard line (dashed) */}
            <path
              d={breedPath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />

            {/* Dog's growth line */}
            <path
              d={dogPath}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="3"
            />

            {/* Data points for dog's growth */}
            {dogGrowth.map((point: GrowthPoint, idx: number) => (
              <circle
                key={idx}
                cx={getX(point.age_months)}
                cy={getY(point.weight_lbs)}
                r="3"
                fill="#14b8a6"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-teal-500 rounded-full"></div>
            <span className="text-xs font-semibold text-gray-700">{dogData.name}'s Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gray-400 rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(to right, #94a3b8 0, #94a3b8 5px, transparent 5px, transparent 10px)' }}></div>
            <span className="text-xs font-semibold text-gray-700">Breed Average</span>
          </div>
        </div>

        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>2 mos</span>
          <span>1 yr</span>
          <span>2 yrs</span>
          <span>3+ yrs</span>
        </div>
      </div>

      {/* Growth stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1">Current</p>
          <p className="text-lg font-bold text-teal-900">{dogData.weight_lbs} lbs</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1">Ideal Range</p>
          <p className="text-lg font-bold text-teal-900">65-75 lbs</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1">Status</p>
          <p className="text-lg font-bold text-teal-900">✓ Healthy</p>
        </div>
      </div>
    </div>
  );
}
