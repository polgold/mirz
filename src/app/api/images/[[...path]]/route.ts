import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const IMAGES_DIR = path.join(process.cwd(), 'source', 'images');
const MIMES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await params;
  if (!pathSegments?.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const safePath = pathSegments.filter((p) => !p.includes('..')).join(path.sep);
  const filePath = path.join(IMAGES_DIR, safePath);
  if (!filePath.startsWith(IMAGES_DIR)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIMES[ext] ?? 'application/octet-stream';
    const body = fs.readFileSync(filePath);
    return new NextResponse(body, {
      headers: { 'Content-Type': mime },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
