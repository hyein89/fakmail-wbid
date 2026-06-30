import { createClient } from '@supabase/supabase-js'

// Sistem pintar: Cek yang pakai NEXT_PUBLIC_ dulu, kalau kosong pakai yang biasa
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  // Mengatasi masalah CORS / Izin Akses dari luar jika diperlukan
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { address } = req.query

  if (!address) {
    return res.status(400).json({ error: 'Alamat email diperlukan' })
  }

  try {
    // Mengambil data email dari tabel 'inbox' berdasarkan alamat tujuan
    const { data, error } = await supabase
      .from('inbox')
      .select('*')
      .eq('recipient', address)
      // Gunakan id sebagai alternatif jika created_at belum dibuat di struktur tabel
      .order('id', { ascending: false }) 

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
