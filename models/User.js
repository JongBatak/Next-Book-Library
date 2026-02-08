import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    membershipNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      maxlength: [500, 'Address cannot be more than 500 characters'],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for active transactions
UserSchema.virtual('activeTransactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'userId',
  match: { status: 'borrowed' },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
