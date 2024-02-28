const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let logs = [];

// Check if logIngestor.json exists and load logs from it
const logIngestorPath = 'logIngestor.json';
if (fs.existsSync(logIngestorPath)) {
    const data = fs.readFileSync(logIngestorPath, 'utf8');
    try {
        logs = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing logIngestor.json:', error);
    }
}

// Authentication middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

// authentication route, dummy as of now
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Perform authentication logic here
    // For simplicity, let's assume any username and password combination is valid

    // Create a token (use a secret key and set expiration time in a real application)
    const token = jwt.sign({ username }, 'your-secret-key');

    // Send the token as a response
    res.json({ success: true, token });
});

// Protected route example (requires authentication)
app.get('/logs', authenticateToken, (req, res) => {
    const filteredLogs = applyFilters(req.query, logs);
    console.log('Filtered Logs:', filteredLogs);
    res.json(filteredLogs);
});

// Error handler middleware
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // Return a JSON response with a 403 status code for authentication errors
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next(err);
});

// Function to apply filters to logs
function applyFilters(filters, logs) {
    if (!filters) {
        return logs;
    }

    return logs.filter(log => {
        for (const key in filters) {
            if (log[key] !== filters[key]) {
                return false;
            }
        }
        return true;
    });
}

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Log Ingestor listening at http://localhost:${port}`);
});
 
