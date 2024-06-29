require('dotenv').config(); // Memuat variabel lingkungan dari file .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/test', (req, res) => {
    res.send('Server is running!');
});

app.post('/download', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
            params: { url },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        const videoUrl = response.data.data.play;

        if (!videoUrl) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json({ success: true, downloadUrl: videoUrl });
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Failed to download video. Please try again later.' });
    }
});

// Middleware untuk mengarahkan semua permintaan ke Vercel
app.use('/', createProxyMiddleware({
    target: 'https://front-tiktok.vercel.app/', // Ganti dengan URL frontend Vercel Anda
    changeOrigin: true,
    pathRewrite: { '^/': '/' }, // Mengarahkan root path ke root path Vercel
}));

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
