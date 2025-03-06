import { NextResponse } from 'next/server';
import { FINNHUB_API_KEY } from '@/services/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const symbol = searchParams.get('symbol');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const resolution = searchParams.get('resolution');

  const baseUrl = 'https://finnhub.io/api/v1';
  let url = `${baseUrl}/${endpoint}?token=${FINNHUB_API_KEY}`;

  if (symbol) url += `&symbol=${symbol}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;
  if (resolution) url += `&resolution=${resolution}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
