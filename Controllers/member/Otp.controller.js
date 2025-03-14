// const Otp = require('../../models/otp.model');
// const { sendOTPEmail } = require('../../helpers/emailHelper'); 
// const User = require('../../models/user.model')

// const requestOtp = async (req, res) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const email = req.body.email;
//     const existEmail = await User.findOne({
//         email,
//         deleted: false
//     })
//     if (!existEmail) {
//         res.status(400).json({
//             message: "Email does not exist!",
//         })
//     }
//     try {
//         await Otp.storeOTP(email, otp);
//         await sendOTPEmail(email, otp);
//         res.status(200).json({
//             message: "OTP has been sent"
//         })
//     } catch (error) {
//         res.status(400).json({
//             message: "Error sending OTP",
//             error: error.message
//         })
//     }
// }

// const VerifyOtpController = async (req, res) => {
//     const { email, otp, newPassword } = req.body;
//     try {
//         const result = await Otp.VerifyOtp(email, otp);

//         if (result.success) {
//             const user = await User.findOne({
//                 email
//             });
//             if (!user) {
//                 return res.status(400).json({
//                     message: "User does not exist"
//                 });
//             }
//             user.password = newPassword;
//             await user.save();
//             res.status(200).json({
//                 message: "Otp is valid and password has been changed",
//             });
//         }
//         else {
//             res.status(400).json({
//                 message: result.message
//             })
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: "Error when determining OTP",
//         });
//     }
// }

// module.exports = {
//     requestOtp,
//     VerifyOtpController
// }
