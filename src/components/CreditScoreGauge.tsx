import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CreditScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  maxScore = 100,
  size = 180,
  strokeWidth = 15,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / maxScore) * circumference;
  const offset = circumference - progress;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // Green - Excellent
    if (score >= 60) return '#84cc16'; // Lime - Good
    if (score >= 40) return '#eab308'; // Yellow - Fair
    if (score >= 20) return '#f97316'; // Orange - Poor
    return '#ef4444'; // Red - Very Poor
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Building';
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* Center Content */}
        <View 
          className="absolute inset-0 items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text className="text-4xl font-bold text-dark-800">{score}</Text>
          <Text className="text-sm text-dark-500 mt-1">{label}</Text>
        </View>
      </View>
      <Text className="text-xs text-dark-400 mt-2">CreditGo Score</Text>
    </View>
  );
};
