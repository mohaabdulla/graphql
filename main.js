const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// List of critical files that must exist
const criticalFiles = [
    'star.js',
    'profile.js',
    'profile.html',
    'index.html',
    'skills.js',
    'xpgraph.js',
    'style.css',
    'login.js',
    'error.js',
    'error.html',
    'audit.js'
];

// Create a complete in-line error page template with embedded CSS and JS
// This ensures we can display errors even if CSS/JS files are missing
const completeErrorTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - GraphQL</title>
    <style>
        /* Embedded core styles from style.css */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #0a0a1a;
            color: white;
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
            margin: 0;
            padding: 0;
        }
        
        /* Error page specific styles */
        .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
            position: relative;
            z-index: 10;
        }
        
        .error-card {
            position: relative;
            z-index: 10;
            width: 90%;
            max-width: 400px;
            min-height: 420px;
            background: rgba(10, 10, 30, 0.6);
            border-radius: 15px;
            padding: 60px 40px;
            border: 1px solid rgba(0, 238, 255, 0.3);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 238, 255, 0.3);
            animation: glow 3s infinite alternate;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .error-code {
            font-size: 6rem;
            color: #0ef;
            margin-bottom: 1rem;
            font-weight: bold;
            text-shadow: 0 0 30px rgba(0, 238, 255, 0.6);
        }
        
        .error-message {
            font-size: 1.8rem;
            color: white;
            margin-bottom: 2.5rem;
        }
        
        .back-button {
            width: 100%;
            padding: 15px;
            background-color: transparent;
            border: 2px solid #0ef;
            color: #0ef;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
            margin-top: 30px;
        }
        
        .back-button:hover {
            background-color: #0ef;
            color: #000;
            box-shadow: 0 0 15px rgba(0, 238, 255, 0.8);
        }

        /* Black Hole elements */
        .black-hole-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .black-hole, .event-horizon, .accretion-disk {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .black-hole {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: #000;
            box-shadow: 
                0 0 60px 30px rgba(0, 0, 0, 0.9),
                0 0 100px 60px rgba(10, 0, 40, 0.8),
                0 0 140px 90px rgba(5, 0, 20, 0.5);
        }

        .accretion-disk {
            width: 550px;
            height: 180px;
            border-radius: 50%;
            border: none;
            background: radial-gradient(
                ellipse at center,
                rgba(0, 238, 255, 0.8) 0%,
                rgba(45, 7, 98, 0.7) 25%,
                rgba(11, 1, 45, 0.5) 50%,
                rgba(0, 0, 0, 0) 70%
            );
            filter: blur(3px);
            opacity: 0.7;
            animation: rotate 20s linear infinite;
        }

        .event-horizon {
            width: 220px;
            height: 220px;
            border-radius: 50%;
            background: transparent;
            box-shadow: 0 0 100px 40px rgba(0, 238, 255, 0.2);
            animation: pulse 4s ease-in-out infinite alternate;
        }

        /* Animations */
        @keyframes glow {
            0% { box-shadow: 0 0 30px rgba(0, 238, 255, 0.3); }
            100% { box-shadow: 0 0 50px rgba(0, 238, 255, 0.7); }
        }
        
        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 100px 40px rgba(0, 238, 255, 0.1); }
            100% { box-shadow: 0 0 150px 60px rgba(0, 238, 255, 0.3); }
        }
    </style>
</head>
<body>
    <div class="black-hole-container">
        <div class="event-horizon"></div>
        <div class="accretion-disk"></div>
        <div class="black-hole"></div>
    </div>
    
    <div class="error-container">
        <div class="error-card">
            <div>
                <div class="error-code">500</div>
                <div class="error-message">Critical File Missing: FILENAME</div>
            </div>
            <a href="/" class="back-button">Back to Home</a>
        </div>
    </div>

    <script>
        // Very minimal JS for animations
        document.addEventListener('DOMContentLoaded', function() {
            // Update error details from URL if available
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const message = params.get('message');
            
            if (code) {
                document.querySelector('.error-code').textContent = code;
            }
            
            if (message) {
                document.querySelector('.error-message').textContent = message;
            }
        });
    </script>
</body>
</html>
`;

// Check for critical files at startup
const missingFiles = [];
criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
        console.error(`ERROR: Critical file missing: ${file}`);
    }
});

// Middleware to check critical files
app.use((req, res, next) => {
    // Only check for GET requests
    if (req.method !== 'GET') {
        return next();
    }
    
    // Skip checking for API endpoints
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Clean up the path (remove query string, etc.)
    const cleanPath = req.path.split('?')[0];
    const fileName = path.basename(cleanPath);
    
    // Check if it's a critical file
    if (criticalFiles.includes(fileName)) {
        const filePath = path.join(__dirname, fileName);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`Request for missing critical file: ${fileName}`);
            
            // Return the complete error template with embedded styles
            return res.status(500).send(
                completeErrorTemplate.replace('FILENAME', fileName)
            );
        }
    }
    
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
    if (!fs.existsSync(path.join(__dirname, 'index.html'))) {
        return res.status(500).send(
            completeErrorTemplate.replace('FILENAME', 'index.html')
        );
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the profile page
app.get('/profile', (req, res) => {
    if (!fs.existsSync(path.join(__dirname, 'profile.html'))) {
        return res.status(500).send(
            completeErrorTemplate.replace('FILENAME', 'profile.html')
        );
    }
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// 404 error handler
app.use((req, res, next) => {
    if (fs.existsSync(path.join(__dirname, 'error.html'))) {
        res.status(404).sendFile(path.join(__dirname, 'error.html'));
    } else {
        // Use embedded error template if error.html is missing
        res.status(404).send(
            completeErrorTemplate.replace('FILENAME', 'Page Not Found')
        );
    }
});

// 500 error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (fs.existsSync(path.join(__dirname, 'error.html'))) {
        res.status(500).sendFile(path.join(__dirname, 'error.html'));
    } else {
        // Use embedded error template if error.html is missing
        res.status(500).send(
            completeErrorTemplate.replace('FILENAME', err.message || 'Server Error')
        );
    }
});

// Start the server
app.listen(PORT, () => {
    if (missingFiles.length > 0) {
        console.warn(`WARNING: Server started but missing critical files: ${missingFiles.join(', ')}`);
    }
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL visualizations server started successfully`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    process.exit(0);
});