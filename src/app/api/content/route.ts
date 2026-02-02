import { NextResponse } from 'next/server';
import { readFile, writeFile } from '@/lib/fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }
    
    const content = readFile(path);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { path, content } = await request.json();
    
    if (!path || content === undefined) {
      return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }
    
    writeFile(path, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
