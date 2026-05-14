import express from 'express';
import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/manga
// @desc    Tạo bộ truyện mới
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
router.get('/', async (req, res) => {
  try {
    // Lấy truyện kèm theo thông tin chương mới nhất
    const mangas = await Manga.find().sort({ createdAt: -1 }).limit(20).lean();
    
    // Bổ sung số lượng chương cho mỗi truyện
    const mangasWithChapters = await Promise.all(mangas.map(async (manga) => {
      const chapterCount = await Chapter.countDocuments({ mangaId: manga._id });
      const lastChapter = await Chapter.findOne({ mangaId: manga._id }).sort({ number: -1 });
      return { ...manga, chapterCount, lastChapter };
    }));

    res.json(mangasWithChapters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga/user
// @desc    Lấy danh sách truyện của người dùng hiện tại
router.get('/user', auth, async (req, res) => {
  try {
    const mangas = await Manga.find({ uploader: req.user.id }).sort({ createdAt: -1 }).lean();
    
    const mangasWithChapters = await Promise.all(mangas.map(async (manga) => {
      const chapterCount = await Chapter.countDocuments({ mangaId: manga._id });
      return { ...manga, chapterCount };
    }));

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

    const { number, title, images, content } = req.body;

    const newChapter = new Chapter({
      mangaId: req.params.id,
      number,
      title,
      images,
      content
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

// @route   GET api/manga/chapters/:chapterId
// @desc    Lấy nội dung một chương cụ thể
router.get('/chapters/:chapterId', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Không tìm thấy chương' });
    res.json(chapter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/manga/:id
// @desc    Cập nhật thông tin truyện
router.put('/:id', auth, async (req, res) => {
  try {
    let manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    if (manga.uploader.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Quyền truy cập bị từ chối' });
    }

    const { title, otherTitle, description, author, cover, genres, type, status } = req.body;
    
    const updatedData = {
      title, otherTitle, description, author, cover, type, status,
      genres: Array.isArray(genres) ? genres : (genres || '').split(',').map(g => g.trim()).filter(g => g !== '')
    };

    manga = await Manga.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/manga/:id
// @desc    Xóa truyện và các chương liên quan
router.delete('/:id', auth, async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    if (manga.uploader.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Quyền truy cập bị từ chối' });
    }

    // Xóa tất cả chương của truyện này
    await Chapter.deleteMany({ mangaId: req.params.id });
    
    // Xóa truyện
    await Manga.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Đã xóa truyện thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manga/:id
// @desc    Lấy chi tiết truyện theo ID
router.get('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id).lean();
    if (!manga) return res.status(404).json({ message: 'Không tìm thấy truyện' });

    const chapters = await Chapter.find({ mangaId: req.params.id }).sort({ number: -1 });
    res.json({ ...manga, chapters });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
