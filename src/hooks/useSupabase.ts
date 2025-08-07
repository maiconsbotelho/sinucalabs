'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Player {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface Match {
  id: string
  team1_player1_id: string
  team1_player2_id: string
  team2_player1_id: string
  team2_player2_id: string
  team1_score: number
  team2_score: number
  is_finished: boolean
  created_at: string
  updated_at: string
}

// Hook para buscar jogadores
export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setPlayers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar jogadores')
    } finally {
      setLoading(false)
    }
  }

  const addPlayer = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{ name }])
        .select()
        .single()

      if (error) throw error
      setPlayers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar jogador')
    }
  }

  return {
    players,
    loading,
    error,
    refetch: fetchPlayers,
    addPlayer
  }
}

// Hook para buscar partidas
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1_player1:players!team1_player1_id(*),
          team1_player2:players!team1_player2_id(*),
          team2_player1:players!team2_player1_id(*),
          team2_player2:players!team2_player2_id(*),
          games(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMatches(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar partidas')
    } finally {
      setLoading(false)
    }
  }

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches
  }
}

// Hook para realtime updates
export function useRealtimeMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Buscar dados iniciais
    fetchInitialMatches()

    // Configurar realtime
    const matchesChannel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          console.log('Match updated:', payload)
          // Atualizar estado baseado no tipo de evento
          if (payload.eventType === 'INSERT') {
            setMatches(prev => [payload.new as Match, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setMatches(prev => 
              prev.map(match => 
                match.id === payload.new.id ? payload.new as Match : match
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMatches(prev => 
              prev.filter(match => match.id !== payload.old.id)
            )
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games'
        },
        () => {
          // Quando um jogo é adicionado, recarregar as partidas
          fetchInitialMatches()
        }
      )
      .subscribe()

    setChannel(matchesChannel)

    return () => {
      if (matchesChannel) {
        supabase.removeChannel(matchesChannel)
      }
    }
  }, [])

  const fetchInitialMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team1_player1:players!team1_player1_id(*),
        team1_player2:players!team1_player2_id(*),
        team2_player1:players!team2_player1_id(*),
        team2_player2:players!team2_player2_id(*),
        games(*)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setMatches(data)
    }
  }

  return {
    matches,
    isConnected: channel?.state === 'joined'
  }
}

// Hook para autenticação (opcional)
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}