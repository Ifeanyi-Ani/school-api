const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

function generateUniversityID(role) {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  let prefix;

  if (role === 'student') {
    prefix = `RA/STUDENT/${year}`;
  } else if (role === 'dean' || role === 'teacher') {
    prefix = `RA/STAFF/${year}`;
  } else {
    throw new Error('Invalid role');
  }

  const universityID = `${prefix}/${randomNumber}`;

  return universityID;
}

const userSchema = new mongoose.Schema({
  universityID: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: [true, 'first name is required'],
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: String,
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['dean', 'student', 'teacher'],
    required: true,
  },
  pswd: {
    type: String,
    required: [true, 'password is required'],
    select: false,
  },
});
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.pswd = await bcrypt.hash(this.pswd, salt);
  if (!this.universityID) {
    this.universityID = generateUniversityID(this.role);
  }
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
  next
) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (err) {
    next(err);
  }
};
module.exports = mongoose.model('User', userSchema);
