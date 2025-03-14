const mongoose = require("mongoose");
const User = require("./user.model"); 


const Admin = User.discriminator(
  "Admin",
  new mongoose.Schema({}, { discriminatorKey: 'role' })
);


const Member = User.discriminator(
  "Member",
  new mongoose.Schema({}, { discriminatorKey: 'role' })
);


module.exports = { Admin, Member };
