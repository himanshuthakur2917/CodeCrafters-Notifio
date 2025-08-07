"use client";

import { WavyBackground } from './Hero';

interface HeroSectionProps {
  totalEvents: number;
  urgentEvents: number;
  nextEventName?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  totalEvents, 
  urgentEvents, 
  nextEventName 
}) => {
  return (
    <WavyBackground
      className="max-w-4xl mx-auto pb-40"
      colors={[
        "#38bdf8",
        "#818cf8", 
        "#c084fc",
        "#e879f9",
        "#22d3ee",
      ]}
      waveWidth={50}
      waveOpacity={0.5}
      speed="fast"
      containerClassName="min-h-[80vh]"
      backgroundFill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <div className="text-center text-white px-4">
        {/* Status Badge */}
        <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8 border border-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
          Live Event Tracking System
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Never Miss An
          <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Important Event
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
          Smart event management with real-time notifications, countdown timers, and intelligent alerts. 
          Stay organized and never forget what matters most.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{totalEvents}</div>
            <div className="text-white/80 text-sm">Total Events</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-red-300">{urgentEvents}</div>
            <div className="text-white/80 text-sm">Urgent Events</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-lg font-bold text-white truncate">
              {nextEventName || 'None'}
            </div>
            <div className="text-white/80 text-sm">Next Event</div>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90 mb-12">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>🔔</span>
            <span>Smart Notifications</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>⏰</span>
            <span>Real-time Countdown</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>🎯</span>
            <span>Smart Alerts</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>💾</span>
            <span>Auto-Save</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            🚀 Get Started Now
          </button>
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all border border-white/30">
            📖 Learn More
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center mx-auto">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
          <p className="text-white/60 text-sm mt-2">Scroll to manage events</p>
        </div>
      </div>
    </WavyBackground>
  );
};
