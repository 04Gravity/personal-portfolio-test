import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bare = createBareServer('/bare/');
const app = express();

// 1. FIX: Automatically serve Ultraviolet files (The "Engine")
app.use('/uv/', express.static(uvPath));

// 2. FIX: Automatically look for your HTML/JS in all common folders
app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'public')));

// 3. FIX: Route the main page correctly
app.get('/', (req, res) => {
    // This looks for main.html first, then index.html
    res.sendFile(path.join(__dirname, 'main.html'), (err) => {
        if (err) res.sendFile(path.join(__dirname, 'index.html'), (err2) => {
            if (err2) res.status(404).send("Error: Could not find main.html or index.html in your repository.");
        });
    });
});

const server = createServer();

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.route(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
