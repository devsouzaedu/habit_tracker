import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { InstagramData } from '../types';

interface InstagramChartProps {
  data: InstagramData[];
}

export const InstagramChart = ({ data }: InstagramChartProps) => {
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      ...item,
      dateFormatted: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
      fullDate: format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.fullDate}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Seguidores: <span className="font-bold">{data.followers.toLocaleString('pt-BR')}</span>
          </p>
          {data.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {data.notes}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Nenhum dado disponível para exibir o gráfico.</p>
          <p className="text-sm mt-2">Adicione alguns dados para ver o progresso!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Crescimento de Seguidores no Instagram
      </h3>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-700" 
            />
            
            <XAxis 
              dataKey="dateFormatted"
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString('pt-BR')}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="followers"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#colorFollowers)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#1D4ED8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium">Período:</span> {chartData[0]?.fullDate} - {chartData[chartData.length - 1]?.fullDate}
        </div>
        <div>
          <span className="font-medium">Total de registros:</span> {chartData.length}
        </div>
      </div>
    </div>
  );
}; 