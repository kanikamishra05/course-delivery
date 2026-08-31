const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: [true, 'Enrollment is required'],
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson is required'],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent recording the same lesson completion twice for the same enrollment
progressSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });

// Index to support dashboard aggregation — completions over last 8 weeks
progressSchema.index({ completedAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);
