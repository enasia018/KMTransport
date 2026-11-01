import { NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/db';

export async function GET() {
  try {
    const docs = await getDocuments();
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.member_id || !body.title || !body.category || !body.file_data) {
      return NextResponse.json(
        { error: 'Member, document title, category, and file are required' },
        { status: 400 }
      );
    }
    const created = await createDocument(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
