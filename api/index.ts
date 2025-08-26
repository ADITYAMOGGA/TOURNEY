// Vercel serverless function entry point
import { handler } from '../server/index.js';

export default async function(req: any, res: any) {
  const app = await handler();
  return app(req, res);
}