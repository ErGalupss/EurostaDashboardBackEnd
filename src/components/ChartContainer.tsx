import React, { useState, useLayoutEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: React.ReactElement;
  minHeight?: number;
  aspectRatio?: string; // e.g., "16/9"
  className?: string;
}

/**
 * Robust Chart Container to prevent "width(-1) and height(-1)" Recharts warnings.
 * Ensures dimensions are calculated before mounting the chart.
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  minHeight = 300,
  aspectRatio,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
    
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      
      const { width, height } = entries[0].contentRect;
      
      // Only update if dimensions are valid
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Determine container styles based on props
  const containerStyles = aspectRatio 
    ? { aspectRatio } 
    : { height: '100%', minHeight: `${minHeight}px` };

  return (
    <div 
      ref={containerRef}
      className={`w-full relative overflow-hidden ${className}`}
      style={containerStyles}
    >
      {isMounted && dimensions.width > 0 && dimensions.height > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 animate-pulse rounded-xl">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/**
 * Usage Example in Flex Layout
 */
export const FlexDashboardSection = ({ title, children }: { title: string, children: React.ReactElement }) => {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {/* flex-1 and min-h-0 are critical for nested charts in flexbox */}
      <div className="flex-1 min-h-0 w-full">
        <ChartContainer minHeight={350}>
          {children}
        </ChartContainer>
      </div>
    </div>
  );
};

/**
 * Usage Example in Grid Layout with Aspect Ratio
 */
export const GridDashboardItem = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <ChartContainer aspectRatio="16/9">
        {children}
      </ChartContainer>
    </div>
  );
};
