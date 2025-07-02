import { useState, useEffect, useMemo } from 'react';
import type { InstagramData, InstagramStats } from '../types';
import { supabase } from '../lib/supabase';

export const useInstagramTracker = () => {
  const [data, setData] = useState<InstagramData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'jose_dashboard_2025'; // ID fixo para José

  // Carregar dados do Supabase na inicialização
  useEffect(() => {
    loadFromSupabase();
  }, []);

  // Salvar no Supabase sempre que os dados mudarem (com debounce)
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToSupabase();
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    }
  }, [data, isLoading]);

  const loadFromSupabase = async () => {
    try {
      const { data: supabaseData, error } = await supabase
        .from('instagram_data')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar dados do Instagram:', error);
        // Se não há dados, inicializar com dados históricos
        initializeWithHistoricalData();
        return;
      }

      if (supabaseData && supabaseData.length > 0) {
        const instagramData: InstagramData[] = supabaseData.map(item => ({
          id: item.id,
          date: item.date,
          followers: item.followers,
          following: item.following || undefined,
          posts: item.posts || undefined,
          notes: item.notes || undefined,
        }));
        setData(instagramData);
      } else {
        // Se não há dados, inicializar com dados históricos
        initializeWithHistoricalData();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      initializeWithHistoricalData();
      setIsLoading(false);
    }
  };

  const saveToSupabase = async () => {
    try {
      console.log('💾 Salvando dados do Instagram para:', userId);
      
      // Deletar dados antigos do usuário
      await supabase
        .from('instagram_data')
        .delete()
        .eq('user_id', userId);

      // Inserir novos dados
      const supabaseData = data.map(item => ({
        id: item.id,
        user_id: userId,
        date: item.date,
        followers: item.followers,
        following: item.following,
        posts: item.posts,
        notes: item.notes,
      }));

      const { error } = await supabase
        .from('instagram_data')
        .insert(supabaseData);

      if (error) {
        console.error('❌ Erro ao salvar dados do Instagram:', error);
      } else {
        console.log('✅ Dados do Instagram salvos com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
    }
  };

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

  const clearAllData = async () => {
    try {
      // Limpar dados do Supabase
      await supabase
        .from('instagram_data')
        .delete()
        .eq('user_id', userId);
      
      setData([]);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  return {
    data,
    stats,
    isLoading,
    userId,
    addEntry,
    deleteEntry,
    updateEntry,
    exportData,
    importData,
    clearAllData,
    refreshData: loadFromSupabase
  };
}; 