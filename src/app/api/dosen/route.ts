import { NextResponse } from 'next/server';
import dosenData from '@/data/dosen.json';

export async function GET() {
  try {
    return NextResponse.json(dosenData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dosen data' },
      { status: 500 }
    );
  }
}
