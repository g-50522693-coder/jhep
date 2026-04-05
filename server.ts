import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';

const db = new Database('jhep.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  )
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send current state to newly connected client
    const row = db.prepare('SELECT data FROM state WHERE id = 1').get() as { data: string } | undefined;
    if (row) {
      socket.emit('state:init', JSON.parse(row.data));
    }

    // Handle state updates
    socket.on('state:update', (newState) => {
      const data = JSON.stringify(newState);
      db.prepare('INSERT OR REPLACE INTO state (id, data) VALUES (1, ?)').run(data);
      // Broadcast to all other clients
      socket.broadcast.emit('state:changed', newState);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
