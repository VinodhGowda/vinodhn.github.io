// api/counter.js — Vercel Serverless Function
// Tracks page visits in Vercel KV (free Redis)
import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://vinodhn.dev');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `visits:${today}`;
    const totalKey = 'visits:total';
    const [todayCount, totalCount] = await Promise.all([
      kv.incr(todayKey),
      kv.incr(totalKey)
    ]);
    await kv.expire(todayKey, 172800);
    res.status(200).json({
      today: todayCount,
      total: totalCount
    });
  } catch (error) {
    res.status(200).json({ today: '-', total: '-' });
  }
}
