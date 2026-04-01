import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './_utils/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'US-ID-SECRET-KEY-2026';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Fetch fresh user data from database
    const { data: user, error } = await supabaseAdmin
      .from('user')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      program: user.program,
      photo_url: user.photo_url,
      semester: user.semester,
      gpa: user.gpa
    };

    return res.status(200).json({ user: sessionUser });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
