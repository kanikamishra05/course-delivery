const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
  },
  { timestamps: true }
);

// Index to support filtering by status and category (used by course discovery)
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);
