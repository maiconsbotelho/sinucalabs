import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const match = await prisma.match.findUnique({
      where: {
        id: id,
      },
      include: {
        team1Player1: true,
        team1Player2: true,
        team2Player1: true,
        team2Player2: true,
        games: {
          include: {
            winner: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { action, winnerId } = body;

    if (action === "add_game") {
      // Verificar se a partida existe
      const match = await prisma.match.findUnique({
        where: { id: id },
        include: {
          games: true,
        },
      });

      if (!match) {
        return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
      }

      if (match.isFinished) {
        return NextResponse.json({ error: "Partida já foi finalizada" }, { status: 400 });
      }

      // Verificar se o winnerId é válido (deve ser um dos 4 jogadores da partida)
      const validWinnerIds = [match.team1Player1Id, match.team1Player2Id, match.team2Player1Id, match.team2Player2Id];

      if (!validWinnerIds.includes(winnerId)) {
        return NextResponse.json({ error: "Vencedor inválido" }, { status: 400 });
      }

      // Determinar qual dupla venceu
      const isTeam1Winner = [match.team1Player1Id, match.team1Player2Id].includes(winnerId);

      // Criar o jogo
      const gameNumber = match.games.length + 1;
      const game = await prisma.game.create({
        data: {
          matchId: id,
          winnerId,
        },
      });

      // Atualizar contadores da partida
      const updateData = isTeam1Winner ? { team1Score: { increment: 1 } } : { team2Score: { increment: 1 } };

      const updatedMatch = await prisma.match.update({
        where: { id: id },
        data: updateData,
        include: {
          team1Player1: true,
          team1Player2: true,
          team2Player1: true,
          team2Player2: true,
          games: {
            include: {
              winner: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return NextResponse.json(updatedMatch);
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao atualizar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
