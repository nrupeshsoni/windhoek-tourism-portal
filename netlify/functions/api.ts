import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/routers';
import { createContext } from '../../server/_core/context';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  // Convert Netlify event to Fetch Request
  const url = new URL(event.rawUrl);
  const request = new Request(url, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: event.body ? event.body : undefined,
  });

  // Handle tRPC request
  const response = await fetchRequestHandler({
    endpoint: '/.netlify/functions/api',
    req: request,
    router: appRouter,
    createContext: () => createContext({ req: request as any, res: {} as any }),
  });

  // Convert Fetch Response to Netlify response
  const body = await response.text();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    statusCode: response.status,
    headers: {
      ...headers,
      'Access-Control-Allow-Origin': '*',
    },
    body,
  };
};

export { handler };
