import { supabaseAdmin } from './_utils/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'US-ID-SECRET-KEY-2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Fetch user from Supabase using Admin client (to access full record)
    const { data: user, error } = await supabaseAdmin
      .from('user')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Create Session Token (JWT)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // 4. Return user info and token (avoid returning hashes)
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

    return res.status(200).json({
      message: 'Login successful',
      user: sessionUser,
      token: token
    });
  } catch (err) {
    console.error('Backend Login Error:', err);
    return res.status(500).json({ error: 'Falla interna del servidor' });
  }
}
