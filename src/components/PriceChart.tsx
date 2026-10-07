import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  predictedPrice?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, predictedPrice }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-medium">Price history is not available for this product yet.</p>
      </div>
    );
  }

  const lastPoint = data[data.length - 1];
  const chartData = [...data];

  if (predictedPrice) {
    chartData.push({
      date: 'Next Wk',
      price: predictedPrice,
      isForecast: true
    });
  }

  const prices = data.map((d) => d.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      const isForecast = pointData.isForecast;
      return (
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-md">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            {isForecast && (
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                AI Forecast
              </span>
            )}
          </div>
          <p className={`text-base font-bold ${isForecast ? 'text-blue-600' : 'text-slate-900'}`}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Stats summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <span className="text-slate-500 block mb-0.5">Lowest Price</span>
          <span className="font-bold text-emerald-700">₹{lowestPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <span className="text-slate-500 block mb-0.5">Average Price</span>
          <span className="font-bold text-slate-800">₹{averagePrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <span className="text-slate-500 block mb-0.5">Highest Price</span>
          <span className="font-bold text-rose-700">₹{highestPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <span className="text-slate-500 block mb-0.5">Predicted (Next Wk)</span>
          <span className="font-bold text-blue-600">
            {predictedPrice ? `₹${predictedPrice.toLocaleString('en-IN')}` : 'Analyzing...'}
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-56 sm:h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {lastPoint && (
              <ReferenceLine x={lastPoint.date} stroke="#94a3b8" strokeDasharray="4 4" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Text summary for screen readers & quick scanning */}
      <p className="sr-only">
        Price history graph ranging from lowest price ₹{lowestPrice.toLocaleString('en-IN')} to highest price ₹{highestPrice.toLocaleString('en-IN')}, with an average of ₹{averagePrice.toLocaleString('en-IN')}.
      </p>
    </div>
  );
};

export default PriceChart;