import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildwithvibe';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema & Model
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  productLiveUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ timestamp: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const { name, productName, description, productLiveUrl } = req.body;
    
    if (!name || !productName || !description || !productLiveUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newSubmission = new Submission({
      name,
      productName,
      description,
      productLiveUrl
    });

    await newSubmission.save();

    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
