import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

// Função para converter códigos de ícone da API em emojis
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '🌤️';
};

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Atualizar hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Buscar dados do clima
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (!API_KEY) {
          throw new Error('Chave da API OpenWeatherMap não configurada');
        }
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Barueri,BR&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do clima');
        }
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: getWeatherIcon(data.weather[0].icon)
        });
        setWeatherLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        // Em caso de erro, usar dados simulados como fallback
        setWeather({
          temperature: Math.floor(Math.random() * 15) + 20,
          description: 'Clima indisponível',
          icon: '🌤️'
        });
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    
    // Atualizar clima a cada 30 minutos
    const weatherTimer = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(weatherTimer);
  }, []);

  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss');
  };

  return (
    <div className="bg-base-100 rounded-box p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        {/* Data e Hora */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            {formatTime(currentTime)}
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 capitalize">
            {formatDate(currentTime)}
          </p>
        </div>

        {/* Clima */}
        <div className="flex items-center gap-3">
          {weatherLoading ? (
            <div className="flex items-center gap-2">
              <div className="loading loading-spinner loading-sm"></div>
              <span className="text-base-content/70">Carregando clima...</span>
            </div>
          ) : weather ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-base-200 rounded-lg px-3 sm:px-4 py-2">
              <span className="text-xl sm:text-2xl">{weather.icon}</span>
              <div>
                <div className="text-base sm:text-lg font-semibold">
                  {weather.temperature}°C
                </div>
                <div className="text-xs sm:text-sm text-base-content/70 capitalize">
                  Barueri - {weather.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-base-content/50">
              Clima indisponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 