import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    // No roles — everyone is an inspector now
    // No assignedBuildings field — handled by Building.createdBy

    lastLogin: { type: Date },

    isActive: { type: Boolean, default: true },

    emailVerified: { type: Boolean, default: false },

    passwordResetToken: { type: String },

    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
