import React from 'react';
import { Dog } from 'lucide-react';

interface DogAvatarProps {
  breed: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
}

// Breed-specific emoji/icon mapping (stylized icons)
const BREED_ICONS: Record<string, string> = {
  'Golden Retriever': '🦮',
  'Labrador Retriever': '🦮',
  'French Bulldog': '🐶',
  'German Shepherd': '🐕',
  'Beagle': '🐕',
  'Poodle (Standard)': '🐩',
  'Dachshund': '🌭',
  'Chihuahua': '🐕',
  'Boxer': '🐶',
  'Rottweiler': '🐕',
  'Yorkshire Terrier': '🐕',
  'Bulldog': '🐶',
  'Pug': '🐕',
  'Shih Tzu': '🐶',
  'Great Dane': '🐕',
  'Husky': '🐺',
  'Siberian Husky': '🐺',
  'Corgi': '🐕',
  'Pembroke Welsh Corgi': '🐕',
};

const BREED_COLORS: Record<string, { bg: string; accent: string }> = {
  'Golden Retriever': { bg: 'bg-amber-100', accent: 'border-amber-300' },
  'Labrador Retriever': { bg: 'bg-yellow-100', accent: 'border-yellow-300' },
  'French Bulldog': { bg: 'bg-stone-100', accent: 'border-stone-300' },
  'German Shepherd': { bg: 'bg-orange-100', accent: 'border-orange-300' },
  'Beagle': { bg: 'bg-amber-100', accent: 'border-amber-300' },
  'Poodle (Standard)': { bg: 'bg-gray-100', accent: 'border-gray-300' },
  'Dachshund': { bg: 'bg-amber-100', accent: 'border-amber-300' },
  'Chihuahua': { bg: 'bg-orange-100', accent: 'border-orange-300' },
  'default': { bg: 'bg-teal-100', accent: 'border-teal-300' },
};

export default function DogAvatar({ breed, name, size = 'large' }: DogAvatarProps) {
  const icon = BREED_ICONS[breed] || '🐕';
  const colors = BREED_COLORS[breed] || BREED_COLORS['default'];
  
  const sizeClasses = {
    small: 'w-16 h-16 text-3xl',
    medium: 'w-24 h-24 text-5xl',
    large: 'w-32 h-32 text-7xl',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${sizeClasses[size]} ${colors.bg} ${colors.accent} 
        border-4 rounded-full flex items-center justify-center 
        playful-shadow animate-float relative overflow-hidden`}
      >
        {/* Cute background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-white rounded-full"></div>
        </div>
        
        {/* Main icon */}
        <span className="relative z-10 animate-wiggle">{icon}</span>
      </div>
      
      {/* Name badge */}
      {size === 'large' && (
        <div className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 
                        rounded-full shadow-md border-2 border-white">
          <p className="text-white font-bold text-xl tracking-wide">{name}</p>
        </div>
      )}
      
      {size === 'medium' && (
        <p className="mt-2 text-sm font-semibold text-gray-700">{name}</p>
      )}
    </div>
  );
}
