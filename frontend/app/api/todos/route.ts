import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function GET() {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
