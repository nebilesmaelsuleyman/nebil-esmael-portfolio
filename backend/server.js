import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sharp from 'sharp';
import { Profile, Project, CVFile, ContactSubmission } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Set up file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

const upload = multer({ storage: multer.memoryStorage() });

const MONGODB_URI = 'mongodb+srv://nebiloo:nebiloo@cluster0.ramuxrb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Upload endpoint with image compression
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    // Compress image using sharp
    let compressedBuffer = req.file.buffer;
    
    if (req.file.mimetype.startsWith('image/')) {
      compressedBuffer = await sharp(req.file.buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 75, effort: 6 })
        .toBuffer();
    }
    
    // Convert to base64 Data URI
    const b64 = compressedBuffer.toString('base64');
    const fileUrl = `data:image/webp;base64,${b64}`;
    
    res.json({ 
      url: fileUrl, 
      filename: req.file.originalname,
      size: compressedBuffer.length,
      originalSize: req.file.buffer.length
    });
  } catch (err) {
    console.error('Image compression error:', err);
    res.status(500).json({ error: 'Failed to compress image' });
  }
});

// Profiles
app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.params.userId });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profiles', async (req, res) => {
  try {
    let profile = await Profile.findOne({ user_id: req.body.user_id });
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = new Profile(req.body);
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    let query = {};
    if (req.query.is_visible) query.is_visible = req.query.is_visible === 'true';
    const projects = await Project.find(query).sort({ display_order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:userId', async (req, res) => {
  try {
    let query = {};
    if (req.params.userId && req.params.userId !== 'undefined') query.user_id = req.params.userId;
    if (req.query.is_visible) query.is_visible = req.query.is_visible === 'true';
    
    const projects = await Project.find(query).sort({ display_order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CV File
app.get('/api/cv/:userId', async (req, res) => {
  try {
    const cv = await CVFile.findOne({ user_id: req.params.userId });
    res.json(cv || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cv', async (req, res) => {
  try {
    const cv = await CVFile.findOne();
    res.json(cv || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/cv', async (req, res) => {
  try {
    let cv = await CVFile.findOne({ user_id: req.body.user_id });
    if (cv) {
      Object.assign(cv, req.body);
      await cv.save();
    } else {
      cv = new CVFile(req.body);
      await cv.save();
    }
    res.json(cv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cv/:id', async (req, res) => {
  try {
    await CVFile.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact Submissions
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await ContactSubmission.find().sort({ created_at: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new ContactSubmission(req.body);
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/messages/:id/read', async (req, res) => {
  try {
    const message = await ContactSubmission.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
