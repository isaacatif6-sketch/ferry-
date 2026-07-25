const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// خزن الحجوزات في الذاكرة (سجل الحجوزات والتقارير)
let bookings = [];
let maxSeats = 235;

// جلب حالة المقاعد والتقارير
app.get('/api/status', (req, res) => {
    res.json({ 
        remaining: maxSeats - bookings.length, 
        totalBooked: bookings.length,
        bookings: bookings 
    });
});

// إضافة حجز جديد
app.post('/api/book', (req, res) => {
    const { name, passport, route, travelDate, source } = req.body;
    
    if (bookings.length >= maxSeats) {
        return res.json({ success: false, error: 'عذراً، الرحلة مكتملة العدد' });
    }

    const ticket = {
        id: 'TKT-' + Math.floor(10000 + Math.random() * 90000),
        seat: bookings.length + 1,
        name,
        passport,
        route,
        travelDate,
        source: source || 'مكتب البصرة', // مصدر الحجز
        createdDate: new Date().toLocaleDateString('ar-IQ')
    };

    bookings.push(ticket);
    res.json({ success: true, ticket });
});

// تعديل حجز
app.put('/api/book/:id', (req, res) => {
    const { id } = req.params;
    const { name, passport, route, travelDate, source } = req.body;
    const index = bookings.findIndex(b => b.id === id);

    if (index !== -1) {
        bookings[index] = { ...bookings[index], name, passport, route, travelDate, source };
        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'الحجز غير موجود' });
    }
});

// حذف حجز
app.delete('/api/book/:id', (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id !== id);
    // إعادة ترتيب أرقام المقاعد بعد الحذف
    bookings.forEach((b, i) => b.seat = i + 1);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
