import mongoose from 'mongoose';
import express from 'express';
import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/manga/debug/all
// @desc    KIỂM TRA HỆ THỐNG CÔNG KHAI
router.get('/debug/all', async (req, res) => {
  try {
    const total = await Manga.countDocuments();
    const all = await Manga.find().select('title uploader createdAt').sort({ createdAt: -1 }).limit(10).lean();
    
    // Chuẩn hóa dữ liệu uploader để nhìn cho rõ
    const allMapped = all.map(m => ({
      ...m,
      uploader: m.uploader ? m.uploader.toString() : 'TRỐNG (MỒ CÔI)'
    }));

    res.json({
      totalInDatabase: total,
      recentStories: allMapped
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/manga
// @desc    Tạo bộ truyện mới
router.post('/', auth, async (req, res) => {
  try {
    const { title, otherTitle, description, author, cover, genres, type } = req.body;

    console.log('🚀 Đang tạo truyện mới cho User ID:', req.user.id);

    const newManga = new Manga({
      title,
      otherTitle,
      description,
      author,
      cover,
      genres: (genres || '').split(',').map(g => g.trim()).filter(g => g !== ''),
      type,
      uploader: new mongoose.Types.ObjectId(req.user.id)
    });

    const manga = await newManga.save();
    console.log('✅ Truyện đã được lưu vào DB với ID:', manga._id);
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga
// @desc    Lấy tất cả truyện (cho trang chủ)
router.get('/', async (req, res) => {
  try {
    const mangas = await Manga.find().sort({ createdAt: -1 }).limit(20).lean();
    
    const mangasWithChapters = await Promise.all(mangas.map(async (manga) => {
      const chapterCount = await Chapter.countDocuments({ mangaId: manga._id });
      const lastChapter = await Chapter.findOne({ mangaId: manga._id }).sort({ number: -1 });
      return { 
        ...manga, 
        uploader: manga.uploader ? manga.uploader.toString() : null,
        chapterCount, 
        lastChapter 
      };
    }));

    res.json(mangasWithChapters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga/:id
// @desc    Lấy chi tiết một bộ truyện và danh sách chương
router.get('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id).lean();
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    const chapters = await Chapter.find({ mangaId: req.params.id }).sort({ number: -1 });
    res.json({ 
      ...manga, 
      uploader: manga.uploader ? manga.uploader.toString() : null,
      chapters 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Không tìm thấy truyện' });
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga/user
// @desc    Lấy danh sách truyện của người dùng hiện tại
router.get('/user', auth, async (req, res) => {
  try {
    console.log('🔍 Đang tìm truyện của User ID:', req.user.id);
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const mangas = await Manga.find({ uploader: userObjectId }).sort({ createdAt: -1 }).lean();
    
    const mangasWithChapters = await Promise.all(mangas.map(async (manga) => {
      const chapterCount = await Chapter.countDocuments({ mangaId: manga._id });
      return { 
        ...manga, 
        uploader: manga.uploader ? manga.uploader.toString() : null,
        chapterCount 
      };
    }));

    console.log(`📊 Tìm thấy ${mangasWithChapters.length} bộ truyện hợp lệ.`);
    res.json(mangasWithChapters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/manga/:id/chapters
// @desc    Thêm chương mới vào truyện
router.post('/:id/chapters', auth, async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    if (manga.uploader.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Quyền truy cập bị từ chối' });
    }

    const { number, title, images } = req.body;

    const newChapter = new Chapter({
      mangaId: req.params.id,
      number,
      title,
      images
    });

    await newChapter.save();
    res.json(newChapter);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: `Chương ${req.body.number} đã tồn tại!` });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/manga/:id
// @desc    Xóa bộ truyện và tất cả chương của nó
router.delete('/:id', auth, async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    // Kiểm tra quyền: Chỉ chủ sở hữu HOẶC nếu truyện không có chủ (mồ côi) mới được xóa
    if (manga.uploader && manga.uploader.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Bạn không có quyền xóa truyện này' });
    }

    // Xóa tất cả chương của truyện này trước
    await Chapter.deleteMany({ mangaId: req.params.id });
    
    // Xóa truyện
    await Manga.findByIdAndDelete(req.params.id);

    res.json({ message: 'Đã xóa truyện thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
