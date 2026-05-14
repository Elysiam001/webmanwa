import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  otherTitle: String,
  description: String,
  author: String,
  artist: String,
  cover: String,
  genres: [String],
  type: { type: String, enum: ['Manga', 'Manhwa', 'Manhua', 'Comic', 'Novel'], default: 'Manga' },
  status: { type: String, enum: ['Đang tiến hành', 'Hoàn thành', 'Tạm ngưng'], default: 'Đang tiến hành' },
  views: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Manga', MangaSchema);
