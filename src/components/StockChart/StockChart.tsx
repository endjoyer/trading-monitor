import { FC, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { CandleData } from '@/utils/indicators';
import { calculateRSI, calculateMACD } from '@/utils/indicators';

interface StockChartProps {
  data: CandleData[];
  symbol: string;
}

export const StockChart: FC<StockChartProps> = ({ data, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);
    const candlestickSeries = chartRef.current.addCandlestickSeries();

    // Add RSI
    const rsiValues = calculateRSI(data.map((d) => d.close));
    const rsiSeries = chartRef.current.addLineSeries({
      color: '#22c55e',
      title: 'RSI',
      priceScaleId: 'rsi',
    });

    // Add MACD
    const { macdLine, signalLine, histogram } = calculateMACD(
      data.map((d) => d.close)
    );
    const macdSeries = chartRef.current.addLineSeries({
      color: '#3b82f6',
      title: 'MACD',
      priceScaleId: 'macd',
    });

    const signalSeries = chartRef.current.addLineSeries({
      color: '#ef4444',
      title: 'Signal',
      priceScaleId: 'macd',
    });

    // Set data
    candlestickSeries.setData(data);
    rsiSeries.setData(
      rsiValues.map((value, i) => ({
        time: data[i].time,
        value,
      }))
    );

    macdSeries.setData(
      macdLine.map((value, i) => ({
        time: data[i].time,
        value,
      }))
    );

    signalSeries.setData(
      signalLine.map((value, i) => ({
        time: data[i].time,
        value,
      }))
    );

    chartRef.current.timeScale().fitContent();

    return () => {
      chartRef.current.remove();
    };
  }, [data]);

  if (!data.length) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">{symbol} Chart</h2>
        <div className="flex justify-center items-center h-96 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">{symbol} Chart</h2>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
