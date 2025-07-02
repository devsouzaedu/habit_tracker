import { TrendingUp, TrendingDown, Users, Calendar, Target } from 'lucide-react';
import type { InstagramStats } from '../types';

interface InstagramStatsProps {
  stats: InstagramStats;
}

export const InstagramStatsComponent = ({ stats }: InstagramStatsProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${formatNumber(growth)}`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-500';
    if (growth < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Seguidores Atuais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Seguidores Atuais
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.currentFollowers)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Crescimento Total */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Crescimento Total
            </p>
            <p className={`text-2xl font-bold ${getGrowthColor(stats.totalGrowth)}`}>
              {formatGrowth(stats.totalGrowth)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${stats.totalGrowth >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <Target className={`w-6 h-6 ${stats.totalGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
        </div>
      </div>

      {/* Dias Acompanhando */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Dias Acompanhando
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.daysTracking}
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Crescimento Diário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Crescimento Diário
            </p>
            <div className="flex items-center gap-1">
              <p className={`text-2xl font-bold ${getGrowthColor(stats.dailyGrowth)}`}>
                {formatGrowth(stats.dailyGrowth)}
              </p>
              {getGrowthIcon(stats.dailyGrowth)}
            </div>
          </div>
        </div>
      </div>

      {/* Crescimento Semanal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Crescimento Semanal
            </p>
            <div className="flex items-center gap-1">
              <p className={`text-2xl font-bold ${getGrowthColor(stats.weeklyGrowth)}`}>
                {formatGrowth(stats.weeklyGrowth)}
              </p>
              {getGrowthIcon(stats.weeklyGrowth)}
            </div>
          </div>
        </div>
      </div>

      {/* Média Diária */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Média Diária
            </p>
            <p className={`text-2xl font-bold ${getGrowthColor(stats.averageDailyGrowth)}`}>
              {formatGrowth(Math.round(stats.averageDailyGrowth * 100) / 100)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 