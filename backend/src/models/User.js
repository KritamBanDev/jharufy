import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address'
      }
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in queries by default
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    profilePic: {
      type: String,
      default: "",
      validate: {
        validator: function(url) {
          if (!url) return true; // Allow empty string
          // Allow both image URLs, avatar service URLs, and SVG avatars
          return /^https?:\/\/.+(\.(jpg|jpeg|png|gif|webp)|\/public\/\d+\.png|avatar\.iran\.liara\.run|api\.dicebear\.com.*\/svg(\?.*)?|dicebear\.com.*\/svg(\?.*)?)$/i.test(url);
        },
        message: 'Profile picture must be a valid image URL or avatar service URL'
      }
    },

    nativeLanguage: {
      type: String,
      default: "",
      maxlength: [50, 'Native language cannot exceed 50 characters'],
    },

    learningLanguage: {
      type: String,
      default: "",
      maxlength: [50, 'Learning language cannot exceed 50 characters'],
    },

    location: {
      type: String,
      default: "",
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Indexes for better performance
userSchema.index({ isOnboarded: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Add indexes for efficient querying
userSchema.index({ email: 1, status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ friends: 1 });
userSchema.index({ fullName: 'text', bio: 'text' });

const User = mongoose.model("User", userSchema);

export default User;