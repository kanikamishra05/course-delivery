const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Learner is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    lastProgressAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollment — one learner per course
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

// Index to support queries by course (bulk enrollment, CSV export, dashboard)
enrollmentSchema.index({ courseId: 1 });

// Index to support inactivity alert queries (find stale IN_PROGRESS enrollments)
enrollmentSchema.index({ lastProgressAt: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
