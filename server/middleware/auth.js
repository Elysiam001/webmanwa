import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token') || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'manhwahub_secret');
    req.user = decoded.user;
    
    // Đảm bảo req.user.id luôn tồn tại (đồng bộ id và _id)
    if (req.user && !req.user.id && req.user._id) {
      req.user.id = req.user._id;
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

export default auth;
