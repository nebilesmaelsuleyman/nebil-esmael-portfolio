import mongoose from 'mongoose';
import { Project } from './models.js';

const MONGODB_URI = 'mongodb+srv://nebiloo:nebiloo@cluster0.ramuxrb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

const defaultProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard. Built for scale with microservices architecture.',
    tech_stack: ['Next.js', 'TypeScript', 'Mongodb', 'Stripe'],
    live_url: 'https://scoothub-e-commerceweb.onrender.com/',
    github_url: 'https://github.com/nebilesmaelsuleyman/ScootHub-E-commerceweb',
    image_url: 'http://localhost:5000/uploads/ecommerce.png', // Please upload the image in the admin panel and replace this later
    user_id: 'dev-user', // Use a default user id or update this to your actual user id
    display_order: 0,
    is_visible: true
  },
  {
    title: 'sass personal Learning platform',
    description: 'A SaaS voice-AI platform using Clerk authentication and Vapi that lets users create custom topics and interact with an AI assistant through real-time voice',
    tech_stack: ['Nextjs', 'clerk', 'supabase', 'vapi voice Agent'],
    live_url: 'https://sass-personal-learning.vercel.app/',
    github_url: 'https://github.com/nebilesmaelsuleyman/sassPersonalLearning',
    image_url: 'http://localhost:5000/uploads/personallearning.png',
    user_id: 'dev-user',
    display_order: 1,
    is_visible: true
  },
  {
    title: 'Chat App',
    description: 'Real-time messaging platform built with React and Express. Supports one-to-one and group chats, live message updates via WebSockets, user authentication, and message persistence. Designed for low-latency communication, scalable backend APIs, and a responsive client interface.',
    tech_stack: ['React', 'Node.js', 'Socket.io', 'mongoDb', 'Vercel'],
    live_url: 'https://chat-app-5mtn.onrender.com',
    github_url: 'https://github.com/nebilesmaelsuleyman/chat-appm',
    image_url: 'http://localhost:5000/uploads/chatapp.png',
    user_id: 'dev-user',
    display_order: 2,
    is_visible: true
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Migrating projects...');
    await Project.deleteMany({});
    console.log('Cleared existing projects.');
    for (const p of defaultProjects) {
      const project = new Project(p);
      await project.save();
      console.log(`Migrated: ${p.title}`);
    }
    console.log('Migration completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
