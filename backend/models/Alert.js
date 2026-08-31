const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: [true, 'Enrollment is required'],
    },
    dismissedAt: {
      type: Date,
      default: null, // null = alert is active; set when instructor dismisses
    },
    lastProgressAtWhenDismissed: {
      type: Date,
      default: null, // snapshot of Enrollment.lastProgressAt at dismissal time
      // Used to detect if learner made progress after dismissal:
      //   Enrollment.lastProgressAt > lastProgressAtWhenDismissed
      //   → learner engaged again → new inactivity period can trigger a new alert
    },
  },
  { timestamps: true }
);

// One alert record per enrollment — used for dismissal tracking
alertSchema.index({ enrollmentId: 1 }, { unique: true });

module.exports = mongoose.model('Alert', alertSchema);
