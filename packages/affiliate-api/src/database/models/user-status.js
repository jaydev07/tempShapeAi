import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

const UserStatus = mongoose.model('UserStatus', statusSchema);

