const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/account.model'); // Điều chỉnh đường dẫn cho phù hợp

// const create_admin_account = async (req, res) => {
//   try {
//     const existEmail = await Admin.findOne({
//       email: req.body.email,
//     });
//     if (existEmail) {
//       return res.status(400).json({ message: 'Email đã được sử dụng.' });
//     }

//     const newAccount = new Admin(req.body);

//     const token = jwt.sign(
//       {
//         id: newAccount._id,
//         fullname: newAccount.fullname,
//         role: newAccount.role
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     newAccount.token = token;

//     await newAccount.save();

//     res.cookie("token", token, {
//       maxAge: 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       secure: true
//     });

//     res.status(201).json({
//       message: "Tạo tài khoản thành công",
//       account: newAccount,
//       token: newAccount.token
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating account!",
//       error: error.message
//     });
//   }
// };
const create_admin_account = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: 'Hệ thống chỉ cho phép có một admin duy nhất.' });
    }

    const newAccount = new Admin(req.body);

    const token = jwt.sign(
      {
        id: newAccount._id,
        fullname: newAccount.fullname,
        role: newAccount.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    newAccount.token = token;

    await newAccount.save();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true
    });

    res.status(201).json({
      message: "Tạo tài khoản admin thành công",
      account: newAccount,
      token: newAccount.token
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo tài khoản admin!",
      error: error.message
    });
  }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
        email: email
    });

    if (!admin) {
        return res.status(400).json({ message: 'Email đăng nhập không chính xác.' });
    }

    if (admin.password !== password) {
            return res.status(400).json({ message: 'Sai mật khẩu.' });
        }

    if (admin.role !== "admin") {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
    }

  
    const token = jwt.sign(
        { 
            id: admin.id,
            fullname: admin.fullname,
            role: admin.role,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    admin.token = token;
    await admin.save();
    
    // Lưu token vào cookie
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,  
        secure: true     
    });

    res.status(200).json({
        message: "Đăng nhập thành công!",
        user: admin.fullname,
        role: admin.role,
        token: admin.token,
    });
};




const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message : "Đăng xuất thành công!",
        })
    } catch (error) {
        res.status(400).json({
            message : "Error!",
            error : error.message
        })
    } 
}



module.exports = {
    create_admin_account,
    login,
    logout
};
