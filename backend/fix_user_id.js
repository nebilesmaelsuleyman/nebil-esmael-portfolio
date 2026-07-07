import mongoose from 'mongoose';
import { Project } from './models.js';

const MONGODB_URI = 'mongodb+srv://nebiloo:nebiloo@cluster0.ramuxrb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Updating user_id...');
    const result = await Project.updateMany(
      { user_id: 'dev-user' },
      { $set: { user_id: '30331ff5-c427-40e7-9067-bba73c7997e7' } }
    );
    console.log(`Updated ${result.modifiedCount} projects.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Update failed:', err);
    process.exit(1);
  });
