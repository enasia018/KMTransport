import { NextResponse } from 'next/server';
import { getMembers, createMember } from '@/lib/db';

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.first_name || !body.last_name || !body.contact_number) {
      return NextResponse.json(
        { error: 'First name, last name, and contact number are required' },
        { status: 400 }
      );
    }
    const created = await createMember(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
