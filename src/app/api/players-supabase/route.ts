import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Exemplo de API usando Supabase diretamente (alternativa ao Prisma)
export async function GET() {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar jogadores:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar jogadores' },
        { status: 500 }
      )
    }

    return NextResponse.json(players)
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const { data: player, error } = await supabase
      .from('players')
      .insert([{ name }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar jogador:', error)
      return NextResponse.json(
        { error: 'Erro ao criar jogador' },
        { status: 500 }
      )
    }

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}