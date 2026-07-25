const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MAX_CAPACITY = 235;
let bookings = [];

app.get('/', (req, res) => {
  res.send('<h1>نظام حجز سفينة (البصرة - المحمرة) يعمل بنجاح!</h1>');
});

app.get('/api/status', (req, res) => {
  res.json({
    total: MAX_CAPACITY,
    booked: bookings.length,
    remaining: MAX_CAPACITY - bookings.length
  });
});

app.post('/api/book', (req, res) => {
  if (bookings.length >= MAX_CAPACITY) {
    return res.status(400).json({ error: 'عذراً، الرحلة مكتملة بالكامل (235 راكب).' });
  }
  
  const { name, passport, route } = req.body;
  const ticket = {
    id: 'TKT-' + Math.floor(100000 + Math.random() * 900000),
    seat: bookings.length + 1,
    name,
    passport,
    route,
    date: new Date().toLocaleDateString('ar-IQ')
  };
  
  bookings.push(ticket);
  res.json({ success: true, ticket });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
