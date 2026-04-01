// api/counter.js — Vercel Serverless Function
// Tracks page visits in Vercel KV (free Redis)

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers for your domain
  res.setHeader('Access-Control-Allow-Origin', 'https://vinodhn.dev');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const today = new Date().toISOString().split('T')[0]; // "2026-04-01"
    const todayKey = `visits:${today}`;
    const totalKey = 'visits:total';

    // Increment both counters atomically
    const [todayCount, totalCount] = await Promise.all([
      kv.incr(todayKey),
      kv.incr(totalKey)
    ]);

    // Set today's key to expire after 48 hours (cleanup)
    await kv.expire(todayKey, 172800);

    res.status(200).json({
      today: todayCount,
      total: totalCount
    });
  } catch (error) {
    // If KV isn't set up yet, return placeholder
    res.status(200).json({ today: '-', total: '-' });
  }
}
