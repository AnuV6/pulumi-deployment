// src/app/api/message/route.js
export async function GET() {
  return Response.json({
    message: 'Hello from the backend!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DATABASE_URL ? 'Connected' : 'Not configured'
  });
}

// This tells Next.js to only allow GET requests to this endpoint
export const dynamic = 'force-dynamic';
