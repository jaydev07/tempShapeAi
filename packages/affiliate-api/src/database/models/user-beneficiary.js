import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  vpa: String,
}, {
  timestamps: true,
});

const UserBeneficiary = mongoose.model('UserBeneficiary', beneficiarySchema);
export default UserBeneficiary;