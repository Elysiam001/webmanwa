import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
  number: { type: Number, required: true },
  title: String,
  images: [String], // Lưu Base64 hoặc URL ảnh
  content: String, // Lưu nội dung văn bản tiểu thuyết
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Đảm bảo mỗi truyện không có 2 chương trùng số
ChapterSchema.index({ mangaId: 1, number: 1 }, { unique: true });

export default mongoose.model('Chapter', ChapterSchema);
