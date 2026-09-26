const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const db = require('./config/database');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Test server
app.get('/', (req, res) => {
    res.send('Student Management System berhasil berjalan!');
});


// ===============================
// GET SEMUA SISWA
// ===============================
app.get('/api/siswa', async (req, res) => {

    try {

        const [rows] = await db.promise().query(
            'SELECT * FROM siswa ORDER BY id DESC'
        );

        res.json({
            status: true,
            message: 'Data siswa berhasil diambil',
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Gagal mengambil data siswa'
        });

    }

});


// ===============================
// GET SISWA BERDASARKAN ID
// ===============================
app.get('/api/siswa/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.promise().query(
            'SELECT * FROM siswa WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });

        }

        res.json({
            status: true,
            message: 'Data siswa ditemukan',
            data: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan'
        });

    }

});


// ===============================
// POST TAMBAH SISWA
// ===============================
app.post('/api/siswa', async (req, res) => {

    try {

        const {
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        } = req.body;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {

            return res.status(400).json({
                status: false,
                message: 'Semua data siswa wajib diisi'
            });

        }

        const sql = `
            INSERT INTO siswa
            (nis, nama, kelas, jurusan, alamat)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(sql, [
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        ]);

        res.status(201).json({
            status: true,
            message: 'Data siswa berhasil ditambahkan',
            data: {
                id: result.insertId,
                nis,
                nama,
                kelas,
                jurusan,
                alamat
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Gagal menambahkan siswa'
        });

    }

});


// ===============================
// PUT EDIT SISWA
// ===============================
app.put('/api/siswa/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        } = req.body;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {

            return res.status(400).json({
                status: false,
                message: 'Semua data siswa wajib diisi'
            });

        }

        const sql = `
            UPDATE siswa
            SET nis = ?,
                nama = ?,
                kelas = ?,
                jurusan = ?,
                alamat = ?
            WHERE id = ?
        `;

        const [result] = await db.promise().query(sql, [
            nis,
            nama,
            kelas,
            jurusan,
            alamat,
            id
        ]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });

        }

        res.json({
            status: true,
            message: 'Data siswa berhasil diubah'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Gagal mengubah data siswa'
        });

    }

});


// ===============================
// DELETE SISWA
// ===============================
app.delete('/api/siswa/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.promise().query(
            'DELETE FROM siswa WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });

        }

        res.json({
            status: true,
            message: 'Data siswa berhasil dihapus'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Gagal menghapus siswa'
        });

    }

});


// Jalankan server
app.listen(port, () => {

    console.log(
        `Server berjalan di http://localhost:${port}`
    );

});