import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET a single idea by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
    });
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
  }
}

// PUT (update) an idea by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, status, confidence, tags } = body;

    const updatedIdea = await prisma.idea.update({
      where: { id: params.id },
      data: {
        name,
        description,
        status,
        confidence,
        tags: tags ? JSON.stringify(tags) : undefined,
      },
    });
    return NextResponse.json(updatedIdea);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

// DELETE an idea by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.idea.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
