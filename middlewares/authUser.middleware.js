const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/user.model")

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập tài nguyên này.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; 
        const user = await User.findOne({
            _id: userId
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
}; 
module.exports = authenticateToken;
  

