const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');
const Alert = require('../models/Alert');

const DEMO_USERS = [
  { name: 'Suman Shukla', email: 'shuklasuman224@gmail.com', password: '1234@59#Di', role: 'INSTRUCTOR' },
  { name: 'Kanika Rocks', email: 'kanikarocks11@gmail.com', password: 'DemoLearner123!', role: 'LEARNER' },
  { name: 'Kanika Mishra', email: 'mishrakanika59@gmail.com', password: '1234@59#Pa', role: 'LEARNER' }
];

async function runSeed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Setup Demo Users
    console.log('\n--- Seeding Users ---');
    const userIds = {};
    for (const u of DEMO_USERS) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        user = await User.create({ name: u.name, email: u.email, password: hashedPassword, role: u.role });
        console.log(`Created user: ${u.email}`);
      } else {
        // Ensure password is correct if it was changed
        user.password = await bcrypt.hash(u.password, 10);
        await user.save();
        console.log(`Updated existing user: ${u.email}`);
      }
      userIds[u.email] = user._id;
    }

    const instructorId = userIds['shuklasuman224@gmail.com'];
    const learner1Id = userIds['kanikarocks11@gmail.com'];
    const learner2Id = userIds['mishrakanika59@gmail.com'];

    // 2. Clear old demo data (Enrollments, Progress, Alerts, Activity)
    // To be safe and idempotent, we clear only data related to these specific users or courses they own
    console.log('\n--- Cleaning up old demo data ---');
    const oldEnrollments = await Enrollment.find({ learnerId: { $in: [learner1Id, learner2Id] } });
    const oldEnrollmentIds = oldEnrollments.map(e => e._id);
    await Progress.deleteMany({ enrollmentId: { $in: oldEnrollmentIds } });
    await Alert.deleteMany({ enrollmentId: { $in: oldEnrollmentIds } });
    await Enrollment.deleteMany({ _id: { $in: oldEnrollmentIds } });
    
    const instructorCourses = await Course.find({ instructorId });
    const instructorCourseIds = instructorCourses.map(c => c._id);
    await ActivityLog.deleteMany({ courseId: { $in: instructorCourseIds } });
    console.log('Cleared old enrollments and activity logs for demo users.');

    // 3. Reuse and Reassign Existing Courses
    console.log('\n--- Reusing Existing Courses ---');
    const existingCourses = await Course.find().lean();
    if (existingCourses.length === 0) {
      console.warn('No existing courses found in DB! Seed expects existing local data to reuse.');
      // Fallback: we could create them, but instructions said reuse.
    }

    const courseMap = {};
    for (const c of existingCourses) {
      // Reassign to demo instructor
      let status = 'PUBLISHED';
      if (c.title.includes('JavaScript')) status = 'DRAFT';
      if (c.title.includes('Data Structures')) status = 'ARCHIVED';

      await Course.updateOne({ _id: c._id }, { $set: { instructorId, status } });
      courseMap[c.title] = c;
      console.log(`Reassigned course to demo instructor: "${c.title}" [${status}]`);
    }

    // Grab IDs for specific scenarios
    const fullStackCourse = existingCourses.find(c => c.title.includes('Full Stack'));
    const dbmsCourse = existingCourses.find(c => c.title.includes('Database'));
    const networkCourse = existingCourses.find(c => c.title.includes('Network'));

    // 4. Enrollments & Progress
    console.log('\n--- Seeding Enrollments & Progress ---');
    
    // Dates for scenarios
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const sixteenDaysAgo = new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
    const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);

    if (fullStackCourse) {
      // Learner 1: COMPLETED course
      const e1 = await Enrollment.create({ courseId: fullStackCourse._id, learnerId: learner1Id, lastProgressAt: twoDaysAgo });
      const lessons = await Lesson.find({ courseId: fullStackCourse._id });
      for (const lesson of lessons) {
        await Progress.create({ enrollmentId: e1._id, lessonId: lesson._id, completedAt: twoDaysAgo });
      }
      console.log(`Learner 1 enrolled in '${fullStackCourse.title}' (COMPLETED)`);
    }

    if (fullStackCourse) {
      // Learner 2: NOT_STARTED course
      await Enrollment.create({ courseId: fullStackCourse._id, learnerId: learner2Id, lastProgressAt: now });
      console.log(`Learner 2 enrolled in '${fullStackCourse.title}' (NOT_STARTED)`);
    }

    if (dbmsCourse) {
      // Learner 2: IN_PROGRESS + 14-day Inactivity Alert
      const e2 = await Enrollment.create({ courseId: dbmsCourse._id, learnerId: learner2Id, lastProgressAt: sixteenDaysAgo });
      const dbmsLessons = await Lesson.find({ courseId: dbmsCourse._id });
      if (dbmsLessons.length > 0) {
        await Progress.create({ enrollmentId: e2._id, lessonId: dbmsLessons[0]._id, completedAt: sixteenDaysAgo });
      }
      // No alert dismissal record created, so this will trigger a fresh alert
      console.log(`Learner 2 enrolled in '${dbmsCourse.title}' (IN_PROGRESS, Inactive > 14 days)`);
    }

    if (networkCourse) {
      // Learner 1: IN_PROGRESS + Dismissed Alert Reappearance Scenario
      const e3 = await Enrollment.create({ courseId: networkCourse._id, learnerId: learner1Id, lastProgressAt: sixteenDaysAgo });
      const networkLessons = await Lesson.find({ courseId: networkCourse._id });
      if (networkLessons.length > 0) {
        await Progress.create({ enrollmentId: e3._id, lessonId: networkLessons[0]._id, completedAt: sixteenDaysAgo });
      }
      // Create Alert record that was dismissed BEFORE the current inactivity period
      await Alert.create({
        enrollmentId: e3._id,
        dismissedAt: twentyDaysAgo,
        lastProgressAtWhenDismissed: twentyFiveDaysAgo
      });
      console.log(`Learner 1 enrolled in '${networkCourse.title}' (IN_PROGRESS, Reappearing Alert Scenario)`);
    }

    // 5. Activity History
    console.log('\n--- Seeding Activity History ---');
    if (fullStackCourse) {
      await ActivityLog.create({
        courseId: fullStackCourse._id,
        actorId: instructorId,
        eventType: 'COURSE_PUBLISHED',
        createdAt: twentyDaysAgo
      });
      await ActivityLog.create({
        courseId: fullStackCourse._id,
        actorId: learner1Id,
        eventType: 'ENROLLMENT_CREATED',
        metadata: { type: 'self' },
        createdAt: sixteenDaysAgo
      });
      await ActivityLog.create({
        courseId: fullStackCourse._id,
        actorId: learner1Id,
        eventType: 'COMMENT',
        metadata: { text: 'This course is amazing! Very helpful for my career.' },
        createdAt: twoDaysAgo
      });
      console.log(`Created activity history for '${fullStackCourse.title}'`);
    }

    console.log('\n✅ Demo seed data successfully applied!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runSeed();
