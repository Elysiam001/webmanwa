import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ĐĂNG KÝ
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem user đã tồn tại chưa
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Tạo Token (Thẻ bài)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

export default router;
