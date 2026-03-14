import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(import.meta.dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, 'dist')));

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.get('/api/submissions', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/submissions', (req, res) => {
  try {
    const { name, productName, description, productLiveUrl } = req.body;
    
    if (!name || !productName || !description || !productLiveUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newSubmission = {
      id: Date.now().toString(),
      name,
      productName,
      description,
      productLiveUrl,
      timestamp: new Date().toISOString()
    };

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parseData = JSON.parse(data);
    parseData.push(newSubmission);

    fs.writeFileSync(DATA_FILE, JSON.stringify(parseData, null, 2));

    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(import.meta.dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
