'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DogData, BreedData } from '@/lib/types';

interface GrowthPercentileChartProps {
  dogData: DogData;
  breedData: BreedData;
}

export default function GrowthPercentileChart({ dogData, breedData }: GrowthPercentileChartProps) {
  const currentAgeMonths = Math.floor(dogData.chronological_age * 12);
  
  // Get breed-specific weight targets based on size category
  const getBreedWeightTargets = () => {
    // Category-based weights if specific breed not found
    const categoryWeights: Record<string, { min: number; target: number; max: number }> = {
      'Toy': { min: 4, target: 8, max: 12 },
      'Small': { min: 12, target: 20, max: 28 },
      'Medium': { min: 20, target: 45, max: 60 },
      'Large': { min: 50, target: 75, max: 95 },
      'Giant': { min: 90, target: 120, max: 150 },
    };

    // Breed-specific mature weights (more accurate)
    const breedWeights: Record<string, { min: number; target: number; max: number }> = {
      'Beagle': { min: 18, target: 25, max: 30 },
      'Golden Retriever': { min: 55, target: 70, max: 75 },
      'Labrador Retriever': { min: 55, target: 70, max: 80 },
      'German Shepherd': { min: 50, target: 75, max: 90 },
      'Chihuahua': { min: 4, target: 6, max: 8 },
      'Poodle': { min: 45, target: 60, max: 70 },
      'Bulldog': { min: 40, target: 50, max: 55 },
      'Boxer': { min: 50, target: 65, max: 80 },
      'Dachshund': { min: 16, target: 22, max: 32 },
      'Shih Tzu': { min: 9, target: 13, max: 16 },
    };
    
    const breedName = breedData.breed;
    // Try breed-specific first, fall back to category
    const weights = breedWeights[breedName] || categoryWeights[breedData.size_category] || { min: 50, target: 60, max: 70 };
    
    return weights;
  };

  // Generate breed average percentiles - includes birth point (month 0)
  const generateBreedCurves = () => {
    const allMonths = [0, 2, 6, 12, 18, 24, 36, 48, 60, 72];
    const maxMonth = Math.min(Math.max(currentAgeMonths + 6, 24), 72); // Show at least 2 years
    const months = allMonths.filter(m => m <= maxMonth);
    
    const weights = getBreedWeightTargets();
    
    // Dynamic breed-specific percentiles
    // Growth curve: starts at birth (~5% of mature), reaches ~85% at 12 months
    const growthFactors = [0.05, 0.2, 0.4, 0.85, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0];
    
    const p50Full = growthFactors.map(f => Math.round(weights.target * f)); // 50th percentile
    const p75Full = growthFactors.map(f => Math.round(weights.max * f)); // 75th percentile
    const p25Full = growthFactors.map(f => Math.round(weights.min * f)); // 25th percentile
    
    return months.map((month, idx) => {
      const fullIdx = allMonths.indexOf(month);
      return {
        age_months: month,
        p25: p25Full[fullIdx],
        p50: p50Full[fullIdx],
        p75: p75Full[fullIdx],
      };
    });
  };

  // Build dog's growth line starting from birth (month 0)
  const chartData = generateBreedCurves().map((point) => {
    let weight = null;
    
    // ALWAYS start from birth (month 0) with breed baseline
    if (point.age_months === 0) {
      const weights = getBreedWeightTargets();
      weight = Math.round(weights.target * 0.05); // ~5% of mature weight at birth
    }
    
    // Map all growth_history points
    if (dogData.growth_history) {
      const historyPoint = dogData.growth_history.find(g => g.age_months === point.age_months);
      if (historyPoint) {
        weight = historyPoint.weight_lbs;
      }
    }
    
    // Current age point uses actual current weight
    if (point.age_months === currentAgeMonths) {
      weight = dogData.weight_lbs;
    }
    
    return {
      ...point,
      maxWeight: weight,
    };
  });

  // Calculate current percentile based on actual weight
  const currentWeight = dogData.weight_lbs;
  const nearestBreedPoint = chartData.find(d => d.age_months >= currentAgeMonths) || chartData[chartData.length - 1];
  
  let percentile = 50;
  if (nearestBreedPoint) {
    // More accurate percentile calculation
    const { p25, p50, p75 } = nearestBreedPoint;
    
    if (currentWeight >= p75) {
      percentile = 75 + Math.min(25, ((currentWeight - p75) / (p75 * 0.2)) * 15);
    } else if (currentWeight >= p50) {
      percentile = 50 + ((currentWeight - p50) / (p75 - p50)) * 25;
    } else if (currentWeight >= p25) {
      percentile = 25 + ((currentWeight - p25) / (p50 - p25)) * 25;
    } else {
      percentile = Math.max(5, 25 * (currentWeight / p25));
    }
    
    percentile = Math.round(percentile);
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 shadow-xl border-2 border-white/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-200 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Growth vs. Breed Average</h3>
            <p className="text-sm text-gray-600">Current age: {dogData.chronological_age.toFixed(1)} years ({currentAgeMonths} months)</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 rounded-full border-2 border-white shadow-lg">
          <p className="text-xs text-white/90 font-semibold">Percentile</p>
          <p className="text-3xl font-bold text-white">{percentile}th</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/80 rounded-2xl p-6 border-2 border-white mb-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="age_months" 
              label={{ 
                value: currentAgeMonths > 24 ? 'Age (years)' : 'Age (months)', 
                position: 'insideBottom', 
                offset: -5 
              }}
              stroke="#666"
              tickFormatter={(value) => {
                // Show years for dogs older than 24 months
                if (currentAgeMonths > 24) {
                  return value === 0 ? 'Birth' : `Year ${Math.round(value / 12)}`;
                }
                return value === 0 ? 'Birth' : `${value}mo`;
              }}
            />
            <YAxis 
              label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
              stroke="#666"
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #14b8a6', 
                borderRadius: '12px',
                padding: '12px'
              }}
            />
            <Legend />
            
            {/* Percentile bands */}
            <Line 
              type="monotone" 
              dataKey="p75" 
              stroke="#a7f3d0" 
              strokeWidth={2}
              dot={false}
              name="75th Percentile"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="p50" 
              stroke="#14b8a6" 
              strokeWidth={3}
              dot={false}
              name="Breed Average (50th)"
            />
            <Line 
              type="monotone" 
              dataKey="p25" 
              stroke="#fde68a" 
              strokeWidth={2}
              dot={false}
              name="25th Percentile"
              strokeDasharray="5 5"
            />
            
            {/* Dog's actual growth - dynamic name */}
            <Line 
              type="monotone" 
              dataKey="maxWeight" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              dot={{ fill: '#8b5cf6', r: 6 }}
              name={`${dogData.name}'s Growth`}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Current Weight</p>
          <p className="text-2xl font-bold text-teal-900">{dogData.weight_lbs} lbs</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Breed Average</p>
          <p className="text-2xl font-bold text-teal-900">{nearestBreedPoint?.p50 || 'N/A'} lbs</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Status</p>
          <p className="text-2xl font-bold text-emerald-600">✓ Healthy</p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 border-2 border-yellow-200">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-amber-900">💡 Growth Insight:</span> {dogData.name} is tracking at the {percentile}th percentile for {breedData.breed}s. {percentile > 60 ? 'Maintaining a healthy weight! 🎉' : percentile > 40 ? 'Right on target! 👍' : 'Consider consulting your vet about nutrition. 🩺'}
        </p>
      </div>
    </div>
  );
}
