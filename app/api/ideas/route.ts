import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all ideas
export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

// POST a new idea
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, status, confidence, tags } = body;

    const newIdea = await prisma.idea.create({
      data: {
        name,
        description,
        status,
        confidence,
        tags: tags ? JSON.stringify(tags) : undefined,
      },
    });
    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
