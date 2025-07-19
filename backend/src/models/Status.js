import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
    default: 'like'
  }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [250, 'Reply cannot exceed 250 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const statusSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: [2000, 'Status content cannot exceed 2000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      maxlength: [100, 'Alt text cannot exceed 100 characters']
    }
  }],
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'friends'
  },
  reactions: [reactionSchema],
  comments: [commentSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reaction counts
statusSchema.virtual('reactionCounts').get(function() {
  const counts = {
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0,
    total: 0
  };
  
  this.reactions.forEach(reaction => {
    counts[reaction.type]++;
    counts.total++;
  });
  
  return counts;
});

// Virtual for comment count
statusSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index for better performance
statusSchema.index({ author: 1, createdAt: -1 });
statusSchema.index({ createdAt: -1 });
statusSchema.index({ 'reactions.user': 1 });

export default mongoose.model('Status', statusSchema);
