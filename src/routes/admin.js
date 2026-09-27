const express = require('express');
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/stats', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Menunggu')::int AS menunggu,
        COUNT(*) FILTER (WHERE status = 'Diproses')::int AS diproses,
        COUNT(*) FILTER (WHERE status = 'Selesai')::int AS selesai
      FROM tickets
    `);
    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat statistik.' });
  }
});

router.get('/tickets', async (req, res) => {
  try {
    const status = String(req.query.status || '').trim();
    const search = String(req.query.search || '').trim();

    const values = [];
    const clauses = [];

    if (status && ['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
      values.push(status);
      clauses.push(`t.status = $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      clauses.push(`(t.ticket_code ILIKE $${values.length} OR t.subject ILIKE $${values.length} OR u.name ILIKE $${values.length})`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email AS user_email,
              COUNT(r.id)::int AS reply_count
       FROM tickets t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN ticket_replies r ON r.ticket_id = t.id
       ${where}
       GROUP BY t.id, u.name, u.email
       ORDER BY
         CASE t.status WHEN 'Menunggu' THEN 1 WHEN 'Diproses' THEN 2 ELSE 3 END,
         t.created_at DESC`,
      values
    );

    res.json({ tickets: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat daftar tiket.' });
  }
});

router.patch('/tickets/:id/status', async (req, res) => {
  try {
    const status = String(req.body.status || '').trim();
    if (!['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
      return res.status(400).json({ message: 'Status tiket tidak valid.' });
    }

    const result = await pool.query(
      'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    res.json({ message: 'Status tiket berhasil diperbarui.', ticket: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui status tiket.' });
  }
});

module.exports = router;
