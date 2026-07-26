const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cron = require('node-cron'); // Required for the scheduler
const { createUser, findUserByUsername, db } = require('./database.js');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-key-change-this';

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// === API ENDPOINTS ===

// --- User Authentication ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already taken.' });
        }
        const newUser = await createUser(username, email, password);
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { username: user.username } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
});

app.post('/api/password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both fields are required.' });
    }
    try {
        const userSql = 'SELECT password FROM users WHERE id = ?';
        db.get(userSql, [userId], async (err, user) => {
            if (err || !user) {
                return res.status(500).json({ success: false, message: 'User not found.' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password does not match.' });
            }
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
            const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
            db.run(updateSql, [hashedNewPassword, userId], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error updating password.' });
                }
                res.json({ success: true, message: 'Password updated successfully.' });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during password update.' });
    }
});

// --- Moods ---
app.get('/api/moods', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM moods WHERE userId = ? ORDER BY date DESC";
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.json({ moodHistory: rows || [] });
    });
});

app.post('/api/moods', authenticateToken, (req, res) => {
    const { mood, quote, date } = req.body;
    const sql = 'INSERT INTO moods (userId, mood, quote, date) VALUES (?,?,?,?)';
    db.run(sql, [req.user.id, mood, quote, date], function(err) {
        if (err) { res.status(400).json({ "error": err.message }); return; }
        res.json({ success: true, id: this.lastID });
    });
});

// --- Profile Page Data ---
app.get('/api/profile', authenticateToken, (req, res) => {
    const userSql = "SELECT username, email, creationDate FROM users WHERE id = ?";
    const moodsSql = "SELECT date FROM moods WHERE userId = ? ORDER BY date ASC";
    db.get(userSql, [req.user.id], (err, user) => {
        if (err || !user) return res.status(404).json({ "error": "User not found" });
        db.all(moodsSql, [req.user.id], (err, moods) => {
            if (err) return res.status(500).json({ "error": err.message });
            let longestStreak = 0;
            if (moods.length > 0) {
                const uniqueDays = [...new Set(moods.map(m => new Date(m.date).setHours(0,0,0,0)))];
                uniqueDays.sort((a, b) => a - b);
                let currentStreak = 1;
                longestStreak = 1;
                for (let i = 1; i < uniqueDays.length; i++) {
                    const diff = (uniqueDays[i] - uniqueDays[i-1]) / (1000 * 60 * 60 * 24);
                    currentStreak = (diff === 1) ? currentStreak + 1 : 1;
                    if (currentStreak > longestStreak) longestStreak = currentStreak;
                }
            }
            res.json({
                success: true,
                profile: { username: user.username, email: user.email, memberSince: user.creationDate },
                stats: { totalLogs: moods.length, longestStreak: longestStreak }
            });
        });
    });
});

// --- SCHEDULE API ENDPOINTS ---
app.get('/api/schedule', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM schedules WHERE userId = ?";
    db.get(sql, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ schedule: row || null });
    });
});

app.post('/api/schedule', authenticateToken, (req, res) => {
    const { email, frequency, time, category } = req.body;
    const sql = `INSERT OR REPLACE INTO schedules (userId, email, frequency, time, category) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [req.user.id, email, frequency, time, category], (err) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ success: true, message: "Schedule saved successfully." });
    });
});

app.delete('/api/schedule', authenticateToken, (req, res) => {
    const sql = 'DELETE FROM schedules WHERE userId = ?';
    db.run(sql, [req.user.id], (err) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ success: true, message: "Schedule canceled successfully." });
    });
});

// --- Email Sending ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shadow02460@gmail.com',
        pass: 'fxxo iuui rxvy llgz',
    },
});

const sendQuoteEmail = async (to, subject, quote) => {
    const emailBody = `Hello,\n\nHere is your requested quote:\n\n"${quote}"\n\nHave a great day!\nThe DailyQuoteAI Team`;
    try {
        await transporter.sendMail({
            from: '"DailyQuoteAI" <shadow02460@gmail.com>', // CORRECTED: Use your real email
            to,
            subject,
            text: emailBody
        });
        console.log(`Successfully sent email to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
    }
};

app.post('/send-email', (req, res) => {
    const { to, subject, quote } = req.body;
    sendQuoteEmail(to, subject, quote);
    res.status(200).json({ success: true, message: `Test email sent to ${to}!` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// === AUTOMATED SCHEDULER (CRON JOB) ===
const quotes = { happy: ["The purpose of our lives is to be happy. - Dalai Lama"], sad: ["The good times of today are the sad thoughts of tomorrow. - Bob Marley"], motivated: ["The only way to do great work is to love what you do. - Steve Jobs"], anxious: ["Worry is a misuse of imagination. - Dan Zadra"], calm: ["Calmness is the cradle of power. - Josiah Gilbert Holland"], thoughtful: ["The unexamined life is not worth living. - Socrates"], proud: ["If you can dream it, you can do it. - Walt Disney"], tired: ["Sleep is the best meditation. - Dalai Lama"] };
const getQuoteForMood = (mood) => quotes[mood][Math.floor(Math.random() * quotes[mood].length)];

console.log('Scheduler is active. Will check for emails to send every minute.');
cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDay = now.getDay();
    const dayMapping = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
    
    console.log(`Scheduler running at ${currentTime}...`);

    const sql = "SELECT s.*, u.username FROM schedules s JOIN users u ON s.userId = u.id WHERE s.time = ?";
    db.all(sql, [currentTime], (err, schedules) => {
        if (err) { console.error("Error fetching schedules:", err); return; }

        schedules.forEach(schedule => {
            let shouldSend = false;
            if (schedule.frequency === 'daily') {
                shouldSend = true;
            } else {
                const dayOfWeek = schedule.frequency.split('-')[1];
                if (dayMapping[currentDay] === dayOfWeek) { shouldSend = true; }
            }

            if (shouldSend) {
                console.log(`Found a match for ${schedule.username}! Sending email to ${schedule.email}`);
                let quoteCategory = schedule.category === 'auto' ? 'motivated' : schedule.category;
                const quote = getQuoteForMood(quoteCategory) || "Believe you can and you're halfway there. - Theodore Roosevelt";
                sendQuoteEmail(schedule.email, "Your Daily Quote", quote);
            }
        });
    });
});