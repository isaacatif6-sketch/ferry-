const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let remainingSeats = 235;

app.get('/api/status', (req, res) => {
    res.json({ remaining: remainingSeats });
});

app.post('/api/book', (req, res) => {
    const { name, passport, route } = req.body;
    if (remainingSeats > 0) {
        remainingSeats--;
        const ticket = {
            id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
            seat: 236 - remainingSeats,
            name,
            passport,
            route,
            date: new Date().toLocaleDateString('ar-IQ')
        };
        res.json({ success: true, ticket });
    } else {
        res.json({ success: false, error: 'عذراً، لا توجد مقاعد شاغرة' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
