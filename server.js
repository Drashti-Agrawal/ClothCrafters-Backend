const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

// Configure the storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '5fdkyi2mas',
    database: 'clothcrafters'
});

// Helper function to execute SQL queries
const query = (sql, params) => new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
    });
});

// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
    connection.release();  // Release the connection back to the pool
});

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, phone_number, password, user_type, address } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await query(
            'INSERT INTO users (username, email, phone_number, password, user_type, address) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, phone_number, hashedPassword, user_type, address]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get user from the database
        const results = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ email: user.email, user_type: user.user_type }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Insert or update measurements for a user
app.post('/measurements', async (req, res) => {
    const { email, chest_size, waist_size, hip_size, height, shoulder_width } = req.body;

    try {
        // Check if the measurements for this user already exist
        const results = await query('SELECT * FROM Measurements WHERE email = ?', [email]);

        if (results.length > 0) {
            // Update the measurements if they already exist
            await query(
                'UPDATE Measurements SET chest_size = ?, waist_size = ?, hip_size = ?, height = ?, shoulder_width = ? WHERE email = ?',
                [chest_size, waist_size, hip_size, height, shoulder_width, email]
            );
            return res.status(200).json({ message: 'Measurements updated successfully!' });
        } else {
            // Insert new measurements if they don't exist
            await query(
                'INSERT INTO Measurements (email, chest_size, waist_size, hip_size, height, shoulder_width) VALUES (?, ?, ?, ?, ?, ?)',
                [email, chest_size, waist_size, hip_size, height, shoulder_width]
            );
            return res.status(201).json({ message: 'Measurements added successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get measurements for a user by email
app.get('/measurements/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch the user's measurements from the database
        const results = await query('SELECT chest_size, waist_size, hip_size, height, shoulder_width FROM Measurements WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Measurements not found for this user.' });
        }

        const measurements = results[0];
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/alter_clothes', upload.single('image'), async (req, res) => {
    const { email, category, description } = req.body;

    try {
        // Check if the user exists
        const user = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save the file path in the database
        const imagePath = req.file ? req.file.path : null;

        // Insert into the alter_clothes table
        await query(
            'INSERT INTO alter_clothes (email, category, image_path, description) VALUES (?, ?, ?, ?)',
            [email, category, imagePath, description]
        );

        res.status(201).json({ message: 'Clothes added for alteration successfully!' });
    } catch (error) {
        console.error('Error occurred while processing alteration request:', error); // Log the error
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));


// post into customize_clothes

// API to upload and save customize_clothes data
app.post('/customize_clothes', upload.single('image'), async (req, res) => {
    const { email, category, design_inspiration } = req.body;
    const imagePath = req.file ? req.file.path : null; // Path to the uploaded image

    try {
        // Insert the data into the customize_clothes table
        const result = await query(
            'INSERT INTO customize_clothes (email, category, design_inspiration, image_path) VALUES (?, ?, ?, ?)',
            [email, category, design_inspiration, imagePath]
        );

        res.status(201).json({ message: 'Customization added successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get api for the customize_clothe
app.get('/customize_clothes/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch the customization data for the given email
        const results = await query('SELECT * FROM customize_clothes WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No customizations found for this user.' });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get api for alter_clothes

app.get('/alter_clothes/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch the alteration data for the given email
        const results = await query('SELECT * FROM alter_clothes WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No alterations found for this user.' });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/ping', (req, res) => {
    res.send('Server is running and responding!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));