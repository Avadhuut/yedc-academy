import { NextResponse } from 'next/server';

const BACKEND_PING_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/courses`
  : 'https://yedc-backend.onrender.com/api/v1/courses';

export async function GET() {
  try {
    const startTime = Date.now();
    const res = await fetch(BACKEND_PING_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-KeepAlive-Cron/1.0',
      },
      cache: 'no-store'
    });

    const duration = Date.now() - startTime;

    if (!res.ok) {
      return NextResponse.json(
        { status: 'error', durationMs: duration, message: `Backend ping returned status ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({
      status: 'ok',
      durationMs: duration,
      backendResponse: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to ping backend' },
      { status: 500 }
    );
  }
}
