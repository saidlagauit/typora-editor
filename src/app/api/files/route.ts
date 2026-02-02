import { NextResponse } from 'next/server';
import { getFileTree, createItem, deleteItem, renameItem } from '@/lib/fs';

export async function GET() {
  try {
    const tree = getFileTree();
    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { path, type } = await request.json();
    if (!path || !type) {
      return NextResponse.json({ error: 'Missing path or type' }, { status: 400 });
    }
    createItem(path, type);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }
    deleteItem(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { oldPath, newPath } = await request.json();
    if (!oldPath || !newPath) {
      return NextResponse.json({ error: 'Missing oldPath or newPath' }, { status: 400 });
    }
    renameItem(oldPath, newPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
