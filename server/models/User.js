import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['User', 'Author', 'Admin'], default: 'User' },
  followedManga: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }],
  readingHistory: [{
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    chapter: Number,
    updatedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
