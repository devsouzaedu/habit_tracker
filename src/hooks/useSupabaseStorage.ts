import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { InstagramData } from '../types';

interface StorageOptions {
  useSupabase?: boolean;
  userId?: string;
}

export const useSupabaseStorage = (options: StorageOptions = {}) => {
  const { useSupabase: enableSupabase = false, userId = 'anonymous' } = options;
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  // Verificar conectividade
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Instagram Data Storage
  const saveInstagramData = async (data: InstagramData[]): Promise<boolean> => {
    try {
      // Sempre salvar no localStorage primeiro (backup local)
      localStorage.setItem('instagram-tracker-data', JSON.stringify(data));

      // Se Supabase estiver habilitado e online, sincronizar
      if (enableSupabase && isOnline) {
        setSyncStatus('syncing');
        
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
          console.error('Erro ao sincronizar com Supabase:', error);
          setSyncStatus('error');
          return false;
        }

        setSyncStatus('idle');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const loadInstagramData = async (): Promise<InstagramData[]> => {
    try {
      // Se Supabase estiver habilitado e online, tentar carregar de lá
      if (enableSupabase && isOnline) {
        setSyncStatus('syncing');
        
        const { data: supabaseData, error } = await supabase
          .from('instagram_data')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true });

        if (!error && supabaseData && supabaseData.length > 0) {
          const instagramData: InstagramData[] = supabaseData.map(item => ({
            id: item.id,
            date: item.date,
            followers: item.followers,
            following: item.following || undefined,
            posts: item.posts || undefined,
            notes: item.notes || undefined,
          }));

          // Salvar no localStorage também
          localStorage.setItem('instagram-tracker-data', JSON.stringify(instagramData));
          setSyncStatus('idle');
          return instagramData;
        }
      }

      // Fallback para localStorage
      const localData = localStorage.getItem('instagram-tracker-data');
      if (localData) {
        return JSON.parse(localData);
      }

      setSyncStatus('idle');
      return [];
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSyncStatus('error');
      
      // Fallback para localStorage em caso de erro
      const localData = localStorage.getItem('instagram-tracker-data');
      return localData ? JSON.parse(localData) : [];
    }
  };

  // Habits Data Storage
  const saveHabitsData = async (data: any): Promise<boolean> => {
    try {
      // Sempre salvar no localStorage primeiro
      localStorage.setItem('habit-tracker-state', JSON.stringify(data));

      // Se Supabase estiver habilitado e online, sincronizar
      if (enableSupabase && isOnline) {
        setSyncStatus('syncing');

        const { error } = await supabase
          .from('habits_data')
          .upsert({
            user_id: userId,
            habit_data: data,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Erro ao sincronizar hábitos com Supabase:', error);
          setSyncStatus('error');
          return false;
        }

        setSyncStatus('idle');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar dados dos hábitos:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const loadHabitsData = async (): Promise<any> => {
    try {
      // Se Supabase estiver habilitado e online, tentar carregar de lá
      if (enableSupabase && isOnline) {
        setSyncStatus('syncing');

        const { data: supabaseData, error } = await supabase
          .from('habits_data')
          .select('habit_data')
          .eq('user_id', userId)
          .single();

        if (!error && supabaseData) {
          // Salvar no localStorage também
          localStorage.setItem('habit-tracker-state', JSON.stringify(supabaseData.habit_data));
          setSyncStatus('idle');
          return supabaseData.habit_data;
        }
      }

      // Fallback para localStorage
      const localData = localStorage.getItem('habit-tracker-state');
      setSyncStatus('idle');
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Erro ao carregar dados dos hábitos:', error);
      setSyncStatus('error');
      
      // Fallback para localStorage
      const localData = localStorage.getItem('habit-tracker-state');
      return localData ? JSON.parse(localData) : null;
    }
  };

  // Função para forçar sincronização
  const forcSync = async () => {
    if (!enableSupabase || !isOnline) return false;

    try {
      setSyncStatus('syncing');

      // Sincronizar dados do Instagram
      const instagramData = localStorage.getItem('instagram-tracker-data');
      if (instagramData) {
        await saveInstagramData(JSON.parse(instagramData));
      }

      // Sincronizar dados dos hábitos
      const habitsData = localStorage.getItem('habit-tracker-state');
      if (habitsData) {
        await saveHabitsData(JSON.parse(habitsData));
      }

      setSyncStatus('idle');
      return true;
    } catch (error) {
      console.error('Erro na sincronização forçada:', error);
      setSyncStatus('error');
      return false;
    }
  };

  return {
    // Estados
    isOnline,
    syncStatus,
    isSupabaseEnabled: enableSupabase,

    // Métodos
    saveInstagramData,
    loadInstagramData,
    saveHabitsData,
    loadHabitsData,
    forcSync,
  };
}; 