import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  headline: { type: String, required: true },
  bio: String,
  photo_url: String,
}, { timestamps: true });

// Transform _id to id
profileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const projectSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech_stack: [String],
  live_url: String,
  github_url: String,
  image_url: String,
  display_order: { type: Number, default: 0 },
  is_visible: { type: Boolean, default: true },
}, { timestamps: true });

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const cvFileSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  file_url: { type: String, required: true },
  file_name: { type: String, required: true },
}, { timestamps: true });

cvFileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

contactSubmissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

export const Profile = mongoose.model('Profile', profileSchema);
export const Project = mongoose.model('Project', projectSchema);
export const CVFile = mongoose.model('CVFile', cvFileSchema);
export const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
