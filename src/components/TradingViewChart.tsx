import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineData, LineStyle, LineSeries } from 'lightweight-charts';

interface TradingViewChartProps {
  data: Array<{
    time: string;
    price: number;
  }>;
  symbol: string;
  timeframe: string;
  height?: number;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  data, 
  symbol, 
  timeframe, 
  height = 300 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
        textColor: '#ffffff',
      },
      timeScale: {
        borderColor: '#2a2a2a',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    // Create line series
    // const lineSeries = chart.addLineSeries({
    //   color: '#FFB948',
    //   lineStyle: LineStyle.Solid,
    //   lineWidth: 2,
    // });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#FFB948',
      lineStyle: LineStyle.Solid,
      lineWidth: 2,
    });
    
    chartRef.current = chart;
    seriesRef.current = lineSeries;

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    // Convert data to TradingView format
    const chartData: LineData[] = data.map((item) => ({
      time: (new Date(item.time).getTime() / 1000) as any,
      value: item.price,
    }));

    // Set data
    seriesRef.current.setData(chartData);
    setIsLoading(false);

    // Fit content
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Update chart when timeframe changes
    chartRef.current.timeScale().fitContent();
  }, [timeframe]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{symbol} Price Chart</h3>
        <div className="text-sm text-gray-400">
          {timeframe} • {data.length} data points
        </div>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg z-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#FFB948] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">Loading chart...</span>
            </div>
          </div>
        )}
        
        <div 
          ref={chartContainerRef} 
          className="w-full rounded-lg overflow-hidden"
          style={{ height: `${height}px` }}
        />
      </div>
    </div>
  );
};

export default TradingViewChart;
