const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Paths to our JSON "databases"
const hotelsDataPath = path.join(__dirname, 'data', 'hotels.json');
const bookingsDataPath = path.join(__dirname, 'data', 'bookings.json');

// Helper to read data
function readData(filePath) {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
}

// Helper to write data
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 1. GET /api/search-hotels
app.get('/api/search-hotels', (req, res) => {
    const { location } = req.query;
    let hotels = readData(hotelsDataPath);

    if (location) {
        const lowerLoc = location.toLowerCase();
        hotels = hotels.filter(h => 
            h.location.toLowerCase().includes(lowerLoc) || 
            h.name.toLowerCase().includes(lowerLoc)
        );
    }

    res.json(hotels);
});

// 2. GET /api/hotel-details/:id
app.get('/api/hotel-details/:id', (req, res) => {
    const hotels = readData(hotelsDataPath);
    const hotelId = parseInt(req.params.id);
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (hotel) {
        res.json(hotel);
    } else {
        res.status(404).json({ error: "Hotel not found" });
    }
});

// 3. POST /api/book
app.post('/api/book', (req, res) => {
    const { name, email, phone, hotel_id, hotel_name, check_in, check_out, price, guests } = req.body;
    
    let bookings = readData(bookingsDataPath);

    const newBooking = {
        id: "BKG" + Math.floor(100000 + Math.random() * 900000), // Random 6 digit string
        name,
        email,
        phone,
        hotel_id,
        hotel_name,
        check_in,
        check_out,
        guests,
        price,
        status: "Pending Payment",
        created_at: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeData(bookingsDataPath, bookings);

    res.json({ success: true, message: "Booking created successfully", bookingId: newBooking.id, total_price: price });
});

// 4. POST /api/payment
app.post('/api/payment', (req, res) => {
    const { booking_id, card_number, expiry, cvv } = req.body;
    
    // Very simple dummy validation
    if (!card_number || card_number.length < 12 || !expiry || !cvv) {
        return res.status(400).json({ success: false, error: "Invalid payment details" });
    }

    let bookings = readData(bookingsDataPath);
    let bookingFound = false;

    bookings = bookings.map(b => {
        if (b.id === booking_id) {
            b.status = "Confirmed";
            bookingFound = true;
        }
        return b;
    });

    if (bookingFound) {
        writeData(bookingsDataPath, bookings);
        res.json({ success: true, message: "Payment successful" });
    } else {
        res.status(404).json({ success: false, error: "Booking not found" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Travel Demo Server is running at http://localhost:${PORT}`);
});
