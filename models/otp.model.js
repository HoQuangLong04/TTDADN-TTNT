const mongoose = require('mongoose');


const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String, 
        require: true
    },
    time: {
        type: Date,
        require: true
    },
    expires: {
        type: Date,
        require: true
    }
},
{
    timestamps: true
})

const Otp = mongoose.model('Otp', OtpSchema);

const storeOTP = async (email, otp) => {
    const time = Date.now();
    const expires = Date.now() + 5 * 60 * 1000;
    const OptEntry = new Otp({
       email,
       otp,
       time,
       expires
    });
    try {
        await OptEntry.save();
    } catch (error) {
        console.error("Error when saving OTP:", error);
    }
}

const VerifyOtp = async (email, inputOtp) => {
    const OtpEntry = await Otp.findOne({
        email,
        otp: inputOtp
    }).exec();

    if (!OtpEntry) {
        return {
            success: false,
            message: 'OTP is incorrect'
        };
    }
    const currentTime = Date.now(); 
    const expiresTime = new Date(OtpEntry.expires).getTime();
   
    if (currentTime > expiresTime) {
        return {
            success: false,
            message: 'OTP has expired'
        }
    };

    return {
        success: true,
        message: 'Valid OTP'
    };
}

module.exports = {
    storeOTP,
    VerifyOtp
}