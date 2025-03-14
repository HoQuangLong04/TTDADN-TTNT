const { Member } = require('../../models/account.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;
        
        if (!fullname || !email || !phone || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }
        
        const existEmail = await Member.findOne({ email});
        if (existEmail) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }
        
        // Tạo tài khoản member mới
        const newMember = new Member({
            fullname,
            email,
            phone,
            password
        });
        
        await newMember.save();
        
        res.status(201).json({
            message: 'Đăng ký thành công!',
            member: {
                fullname: newMember.fullname,
                email: newMember.email,
                role: newMember.role
            },
        });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({
            message: 'Đăng ký thất bại!'
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message : "Đăng xuất thành công!",
        });
    } catch (error) {
        res.status(400).json({
            message : "Error!",
            error : error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm tài khoản member theo email
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(400).json({ message: 'Email đăng nhập không chính xác.' });
        }
        
        // Kiểm tra mật khẩu trực tiếp (plain text, không hash)
        if (member.password !== password) {
            return res.status(400).json({ message: 'Sai mật khẩu.' });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: member.id, fullname: member.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        member.token = token;
        await member.save();
        
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });
        
        res.status(200).json({
            message: "Đăng nhập thành công!",
            member: member.fullname,
            role: member.role,
            token: member.token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã có lỗi xảy ra." });
    }
};

module.exports = {
    register,
    logout,
    login
};
