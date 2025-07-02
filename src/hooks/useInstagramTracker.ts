import { useState, useEffect, useMemo } from 'react';
import type { InstagramData, InstagramStats } from '../types';

const STORAGE_KEY = 'instagram-tracker-data';

export const useInstagramTracker = () => {
  const [data, setData] = useState<InstagramData[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Inicializar com dados históricos se não houver dados salvos
        initializeWithHistoricalData();
      }
    } else {
      // Inicializar com dados históricos
      initializeWithHistoricalData();
    }
  }, []);

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const initializeWithHistoricalData = () => {
    const historicalData: InstagramData[] = [
      {
        id: '1',
        date: '2025-04-01',
        followers: 31,
        notes: 'Início do tracking'
      },
      {
        id: '2',
        date: '2025-04-15',
        followers: 31,
        notes: 'Dados históricos'
      },
      {
        id: '3',
        date: '2025-04-29',
        followers: 53,
        notes: 'Dados históricos'
      },
      {
        id: '4',
        date: '2025-06-15',
        followers: 61,
        notes: 'Dados históricos'
      },
      {
        id: '5',
        date: new Date().toISOString().split('T')[0],
        followers: 79,
        notes: 'Dados atuais'
      }
    ];
    setData(historicalData);
  };

  const addEntry = (entry: Omit<InstagramData, 'id'>) => {
    const newEntry: InstagramData = {
      ...entry,
      id: Date.now().toString(),
    };
    
    setData(prev => {
      // Verificar se já existe entrada para esta data
      const existingIndex = prev.findIndex(item => item.date === entry.date);
      if (existingIndex >= 0) {
        // Atualizar entrada existente
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        // Adicionar nova entrada
        return [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    });
  };

  const deleteEntry = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<InstagramData>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Calcular estatísticas
  const stats: InstagramStats = useMemo(() => {
    if (data.length === 0) {
      return {
        totalGrowth: 0,
        dailyGrowth: 0,
        weeklyGrowth: 0,
        monthlyGrowth: 0,
        averageDailyGrowth: 0,
        daysTracking: 0,
        currentFollowers: 0,
        startFollowers: 0
      };
    }

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startFollowers = sortedData[0].followers;
    const currentFollowers = sortedData[sortedData.length - 1].followers;
    const totalGrowth = currentFollowers - startFollowers;
    
    const startDate = new Date(sortedData[0].date);
    const endDate = new Date(sortedData[sortedData.length - 1].date);
    const daysTracking = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const averageDailyGrowth = daysTracking > 0 ? totalGrowth / daysTracking : 0;

    // Crescimento diário (comparando com ontem)
    let dailyGrowth = 0;
    if (sortedData.length >= 2) {
      const today = sortedData[sortedData.length - 1];
      const yesterday = sortedData[sortedData.length - 2];
      dailyGrowth = today.followers - yesterday.followers;
    }

    // Crescimento semanal (últimos 7 dias)
    let weeklyGrowth = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoData = sortedData.find(item => new Date(item.date) >= oneWeekAgo);
    if (weekAgoData) {
      weeklyGrowth = currentFollowers - weekAgoData.followers;
    }

    // Crescimento mensal (últimos 30 dias)
    let monthlyGrowth = 0;
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthAgoData = sortedData.find(item => new Date(item.date) >= oneMonthAgo);
    if (monthAgoData) {
      monthlyGrowth = currentFollowers - monthAgoData.followers;
    }

    return {
      totalGrowth,
      dailyGrowth,
      weeklyGrowth,
      monthlyGrowth,
      averageDailyGrowth,
      daysTracking,
      currentFollowers,
      startFollowers
    };
  }, [data]);

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `instagram-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setData(importedData);
      } catch (error) {
        console.error('Erro ao importar dados:', error);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    setData([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    stats,
    addEntry,
    deleteEntry,
    updateEntry,
    exportData,
    importData,
    clearAllData
  };
}; 