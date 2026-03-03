import { useMemo } from "react";
import type { TempDataPoint } from "@/lib/api/avalanche";

interface TempSparklineProps {
  data: TempDataPoint[];
  high: number | null;
  low: number | null;
  hours: number; // 24 or 72
  width?: number;
  height?: number;
}

export default function TempSparkline({ 
  data, 
  high, 
  low,
  hours,
  width = 100, 
  height = 48 
}: TempSparklineProps) {
  const pathData = useMemo(() => {
    if (!data || data.length < 2) return null;
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // Prevent division by zero
    
    // Padding for axes and labels
    const leftPadding = 18; // Space for y-axis labels
    const rightPadding = 12; // Space for x-axis "0h" label
    const topPadding = 4;
    const bottomPadding = 10; // Space for x-axis labels
    
    const usableWidth = width - leftPadding - rightPadding;
    const usableHeight = height - topPadding - bottomPadding;
    
    const points = data.map((d, i) => {
      const x = leftPadding + (i / (data.length - 1)) * usableWidth;
      const y = topPadding + (1 - (d.value - min) / range) * usableHeight;
      return { x, y, value: d.value };
    });
    
    // Create smooth path using line segments
    const path = points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
    
    return { 
      path, 
      points, 
      min, 
      max, 
      leftPadding, 
      rightPadding, 
      topPadding, 
      bottomPadding,
      usableWidth,
      usableHeight
    };
  }, [data, width, height]);
  
  if (!pathData || !data || data.length < 2) {
    return null;
  }

  const strokeColor = 'hsl(var(--muted-foreground))';
  const axisColor = 'hsl(var(--border))';
  const freezingLineColor = 'hsl(195 70% 50% / 0.4)'; // Faint blue for 32°F line
  
  // Calculate freezing line position if 32°F is within range
  const freezingTemp = 32;
  const showFreezingLine = pathData.min < freezingTemp && pathData.max > freezingTemp;
  const freezingY = showFreezingLine 
    ? pathData.topPadding + (1 - (freezingTemp - pathData.min) / (pathData.max - pathData.min)) * pathData.usableHeight
    : null;

  return (
    <svg 
      width={width} 
      height={height} 
      className="inline-block"
      aria-label={`Temperature trend: ${high !== null ? `High ${high}°` : ''} ${low !== null ? `Low ${low}°` : ''}`}
    >
      {/* Y-axis */}
      <line 
        x1={pathData.leftPadding} 
        y1={pathData.topPadding - 2} 
        x2={pathData.leftPadding} 
        y2={height - pathData.bottomPadding + 2} 
        stroke={axisColor} 
        strokeWidth={0.5}
      />
      
      {/* X-axis */}
      <line 
        x1={pathData.leftPadding} 
        y1={height - pathData.bottomPadding} 
        x2={width - pathData.rightPadding + 2} 
        y2={height - pathData.bottomPadding} 
        stroke={axisColor} 
        strokeWidth={0.5}
      />
      
      {/* Freezing line at 32°F */}
      {showFreezingLine && freezingY !== null && (
        <line 
          x1={pathData.leftPadding} 
          y1={freezingY} 
          x2={width - pathData.rightPadding} 
          y2={freezingY} 
          stroke={freezingLineColor} 
          strokeWidth={0.75}
          strokeDasharray="2,2"
        />
      )}
      {/* High/Low tick marks on Y-axis */}
      <line 
        x1={pathData.leftPadding - 2} 
        y1={pathData.topPadding} 
        x2={pathData.leftPadding} 
        y2={pathData.topPadding} 
        stroke={axisColor} 
        strokeWidth={0.5}
      />
      <line 
        x1={pathData.leftPadding - 2} 
        y1={height - pathData.bottomPadding} 
        x2={pathData.leftPadding} 
        y2={height - pathData.bottomPadding} 
        stroke={axisColor} 
        strokeWidth={0.5}
      />
      
      {/* Y-axis labels (high/low) */}
      <text 
        x={pathData.leftPadding - 3} 
        y={pathData.topPadding + 3} 
        fontSize={7} 
        fill="hsl(var(--muted-foreground))"
        textAnchor="end"
      >
        {pathData.max}°
      </text>
      <text 
        x={pathData.leftPadding - 3} 
        y={height - pathData.bottomPadding + 1} 
        fontSize={7} 
        fill="hsl(var(--muted-foreground))"
        textAnchor="end"
      >
        {pathData.min}°
      </text>
      
      {/* X-axis labels (time) */}
      <text 
        x={pathData.leftPadding} 
        y={height - 1} 
        fontSize={7} 
        fill="hsl(var(--muted-foreground))"
        textAnchor="start"
      >
        -{hours}h
      </text>
      <text 
        x={width - 2} 
        y={height - 1} 
        fontSize={7} 
        fill="hsl(var(--muted-foreground))"
        textAnchor="end"
      >
        0h
      </text>
      
      {/* Temperature line */}
      <path 
        d={pathData.path} 
        fill="none" 
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Start and end dots */}
      <circle 
        cx={pathData.points[0].x} 
        cy={pathData.points[0].y} 
        r={2} 
        fill={strokeColor}
      />
      <circle 
        cx={pathData.points[pathData.points.length - 1].x} 
        cy={pathData.points[pathData.points.length - 1].y} 
        r={2} 
        fill={strokeColor}
      />
    </svg>
  );
}
