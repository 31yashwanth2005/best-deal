
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
  // Combine historical and forecast for the chart
  const lastPoint = data[data.length - 1];
  const chartData = [...data];
  
  if (predictedPrice) {
    chartData.push({
      date: 'Next Week',
      price: predictedPrice,
      isForecast: true
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isForecast = payload[0].payload.isForecast;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xl">
          <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
          <p className={`text-lg font-bold ${isForecast ? 'text-indigo-600' : 'text-slate-900'}`}>
            ₹{payload[0].value.toFixed(2)}
          </p>
          {isForecast && (
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
              AI FORECAST
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date"
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone"
            dataKey="price" 
            stroke="#4f46e5"
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
          {lastPoint && (
            <ReferenceLine x={lastPoint.date} stroke="#cbd5e1" strokeDasharray="5 5" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;