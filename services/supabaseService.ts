
import { supabase } from './supabaseClient';
import { TradeSetup, KnowledgeResource } from '../types';

/** 
 * USER PROFILE MANAGEMENT 
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);
  
  if (error) throw error;
};

/** 
 * TRADE MANAGEMENT (JOURNAL)
 */
export const saveTradeToCloud = async (userId: string, trade: TradeSetup) => {
  const { error } = await supabase
    .from('trades')
    .insert([{ 
      user_id: userId,
      date: trade.date,
      pair: trade.pair,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      rrRatio: trade.rrRatio,
      status: trade.status,
      notes: trade.notes,
      conceptsUsed: trade.conceptsUsed
    }]);
  
  if (error) throw error;
};

export const updateTradeStatus = async (tradeId: string, status: 'WIN' | 'LOSS' | 'BE') => {
  const { error } = await supabase
    .from('trades')
    .update({ status })
    .eq('id', tradeId);
  
  if (error) throw error;
};

export const fetchUserTrades = async (userId: string) => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

/** 
 * KNOWLEDGE BASE MANAGEMENT
 */
export const saveKnowledgeToCloud = async (userId: string, resource: KnowledgeResource) => {
  const { error } = await supabase
    .from('knowledge')
    .insert([{ 
      user_id: userId,
      name: resource.name,
      type: resource.type,
      status: resource.status,
      content: resource.content 
    }]);
  
  if (error) throw error;
};

export const fetchUserKnowledge = async (userId: string) => {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
};

export const deleteUserKnowledge = async (userId: string) => {
  const { error } = await supabase
    .from('knowledge')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
};

/** 
 * ADMIN GESTION
 */
export const fetchGlobalRegistry = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const syncUserToCloud = async (user: any) => {
  const { id, ...updates } = user;
  if (!id) throw new Error("User ID is required for cloud synchronization.");
  return updateUserProfile(id, updates);
};

export const deleteProfile = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
