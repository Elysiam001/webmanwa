import express from 'express';
import Manga from '../models/Manga.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/manga
// @desc    Tạo bộ truyện mới
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, otherTitle, description, author, cover, genres, type } = req.body;

    const newManga = new Manga({
      title,
      otherTitle,
      description,
      author,
      cover,
      genres: (genres || '').split(',').map(g => g.trim()).filter(g => g !== ''),
      type,
      uploader: req.user.id
    });

    const manga = await newManga.save();
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga
// @desc    Lấy tất cả truyện (cho trang chủ)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const mangas = await Manga.find().sort({ createdAt: -1 }).limit(20);
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga/user
// @desc    Lấy danh sách truyện của người dùng hiện tại
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const mangas = await Manga.find({ uploader: req.user.id }).sort({ createdAt: -1 });
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/manga/:id/chapters
// @desc    Thêm chương mới vào truyện
// @access  Private
router.post('/:id/chapters', auth, async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);

    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    // Kiểm tra quyền (chỉ người đăng mới được thêm chương)
    if (manga.uploader.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Quyền truy cập bị từ chối' });
    }

    const { number, title, images } = req.body;

    const newChapter = {
      number,
      title,
      images
    };

    manga.chapters.push(newChapter);
    await manga.save();

    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
