import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export class AuthError {
  constructor(public readonly message: string) {}
}

const correctAuth = process.env.AUTH;

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.method === 'GET') {
    return;
  }

  const authorization = req.headers.get('authorization');

  if (!authorization) {
    return new Response('No authorization header', {
      status: 401,
    });
  }

  if (authorization !== correctAuth) {
    return new Response('Invalid authorization header', {
      status: 401,
    });
  }

  return NextResponse.next();
}
