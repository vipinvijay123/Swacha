import React from 'react';

const CircularGauge = ({ score = 0, size = 140, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 90) return '#10B981'; // Emerald
    if (s >= 75) return '#3B82F6'; // Blue
    if (s >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getLabel = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Compliant';
    if (s >= 50) return 'Needs Improvement';
    return 'Non-Compliant';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800">{score}%</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">Score</span>
        </div>
      </div>
      <span
        className="mt-3 px-3 py-1 text-xs font-bold rounded-full border"
        style={{
          color: color,
          backgroundColor: `${color}15`,
          borderColor: `${color}30`,
        }}
      >
        {getLabel(score)}
      </span>
    </div>
  );
};

export default CircularGauge;
