const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      required: [true, 'Position is required'],
    },
  },
  { timestamps: true }
);

// Index to support fetching lessons in order for a given course
lessonSchema.index({ courseId: 1, position: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
