import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

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
        // Usando OpenWeatherMap API (você pode usar uma chave gratuita)
        // Para desenvolvimento, vou simular dados do clima
        // Em produção, você deve usar uma API real como OpenWeatherMap
        
        // Simulação de dados do clima para Barueri
        setTimeout(() => {
          const mockWeather: WeatherData = {
            temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
            description: ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuva leve'][Math.floor(Math.random() * 4)],
            icon: '☀️'
          };
          setWeather(mockWeather);
          setWeatherLoading(false);
        }, 1000);

        // Código real para API do clima (descomente quando tiver a chave da API):
        /*
        const API_KEY = 'sua_chave_da_api';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Barueri,BR&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: getWeatherIcon(data.weather[0].icon)
        });
        setWeatherLoading(false);
        */
      } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
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
    <div className="bg-base-100 rounded-box p-6 mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Data e Hora */}
        <div className="space-y-1">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">
            {formatTime(currentTime)}
          </h2>
          <p className="text-base-content/70 capitalize">
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
            <div className="flex items-center gap-3 bg-base-200 rounded-lg px-4 py-2">
              <span className="text-2xl">{weather.icon}</span>
              <div>
                <div className="text-lg font-semibold">
                  {weather.temperature}°C
                </div>
                <div className="text-sm text-base-content/70 capitalize">
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