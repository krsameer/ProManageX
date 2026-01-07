require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Issue = require('./models/Issue');
const Comment = require('./models/Comment');
const Activity = require('./models/Activity');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Project.deleteMany();
    await Issue.deleteMany();
    await Comment.deleteMany();
    await Activity.deleteMany();

    // Create users
    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@promanagex.com',
      password: 'admin123',
      role: 'admin'
    });

    const member1 = await User.create({
      name: 'Kumar Sameer',
      email: 'kumarsameer@promanagex.com',
      password: 'kumarsameer123',
      role: 'member'
    });

    const member2 = await User.create({
      name: 'Kunal Tiwari',
      email: 'kunaltiwari@promanagex.com',
      password: 'kunaltiwari123',
      role: 'member'
    });

    const member3 = await User.create({
      name: 'Shapun Poonja',
      email: 'shapunpoonja@promanagex.com',
      password: 'shapunpoonja123',
      role: 'member'
    });

    console.log('Users created successfully');

    // Create projects
    console.log('Creating projects...');
    const project1 = await Project.create({
      name: 'ProManageX Development',
      description: 'Main development project for ProManageX issue tracking system',
      owner: admin._id,
      members: [
        { user: admin._id, role: 'admin' },
        { user: member1._id, role: 'member' },
        { user: member2._id, role: 'member' }
      ],
      status: 'active'
    });

    const project2 = await Project.create({
      name: 'Mobile App',
      description: 'Mobile application development for iOS and Android',
      owner: admin._id,
      members: [
        { user: admin._id, role: 'admin' },
        { user: member2._id, role: 'member' },
        { user: member3._id, role: 'member' }
      ],
      status: 'active'
    });

    console.log('Projects created successfully');

    // Create issues for project 1
    console.log('Creating issues...');
    const issue1 = await Issue.create({
      title: 'Implement user authentication',
      description: 'Set up JWT-based authentication with login and signup',
      project: project1._id,
      status: 'Done',
      priority: 'High',
      assignee: member1._id,
      reporter: admin._id,
      tags: ['backend', 'authentication'],
      position: 0
    });

    const issue2 = await Issue.create({
      title: 'Design Kanban board UI',
      description: 'Create responsive Kanban board with drag-and-drop functionality',
      project: project1._id,
      status: 'In-Progress',
      priority: 'Critical',
      assignee: member2._id,
      reporter: admin._id,
      tags: ['frontend', 'ui'],
      position: 0
    });

    const issue3 = await Issue.create({
      title: 'Setup MongoDB database',
      description: 'Configure MongoDB connection and create necessary collections',
      project: project1._id,
      status: 'Done',
      priority: 'High',
      assignee: member1._id,
      reporter: admin._id,
      tags: ['database', 'backend'],
      position: 1
    });

    const issue4 = await Issue.create({
      title: 'Create analytics dashboard',
      description: 'Build dashboard with charts showing project statistics',
      project: project1._id,
      status: 'To-Do',
      priority: 'Medium',
      assignee: member2._id,
      reporter: admin._id,
      tags: ['frontend', 'analytics'],
      position: 0
    });

    const issue5 = await Issue.create({
      title: 'Implement comment system',
      description: 'Add ability to comment on issues with real-time updates',
      project: project1._id,
      status: 'Review',
      priority: 'Medium',
      assignee: member1._id,
      reporter: admin._id,
      tags: ['backend', 'frontend'],
      position: 0
    });

    const issue6 = await Issue.create({
      title: 'Add activity logging',
      description: 'Track all changes to issues and display activity timeline',
      project: project1._id,
      status: 'To-Do',
      priority: 'Low',
      assignee: null,
      reporter: admin._id,
      tags: ['backend'],
      position: 1
    });

    // Create issues for project 2
    const issue7 = await Issue.create({
      title: 'Setup React Native project',
      description: 'Initialize React Native project with necessary dependencies',
      project: project2._id,
      status: 'Done',
      priority: 'High',
      assignee: member3._id,
      reporter: admin._id,
      tags: ['mobile', 'setup'],
      position: 0
    });

    const issue8 = await Issue.create({
      title: 'Design mobile UI mockups',
      description: 'Create UI/UX designs for mobile app screens',
      project: project2._id,
      status: 'In-Progress',
      priority: 'High',
      assignee: member2._id,
      reporter: admin._id,
      tags: ['design', 'mobile'],
      position: 0
    });

    const issue9 = await Issue.create({
      title: 'Implement push notifications',
      description: 'Setup push notification service for iOS and Android',
      project: project2._id,
      status: 'To-Do',
      priority: 'Medium',
      assignee: member3._id,
      reporter: admin._id,
      tags: ['mobile', 'notifications'],
      position: 0
    });

    console.log('Issues created successfully');

    // Create comments
    console.log('Creating comments...');
    await Comment.create({
      issue: issue2._id,
      user: admin._id,
      content: 'Great progress! The drag-and-drop feature is working smoothly.'
    });

    await Comment.create({
      issue: issue2._id,
      user: member2._id,
      content: 'Thanks! I\'m now working on the responsive design for mobile devices.'
    });

    await Comment.create({
      issue: issue5._id,
      user: member1._id,
      content: 'Comment system backend is ready for review.'
    });

    console.log('Comments created successfully');

    // Create activity logs
    console.log('Creating activity logs...');
    await Activity.create({
      issue: issue1._id,
      user: admin._id,
      action: 'created',
      description: 'Issue created'
    });

    await Activity.create({
      issue: issue1._id,
      user: member1._id,
      action: 'status_changed',
      field: 'status',
      oldValue: 'To-Do',
      newValue: 'Done',
      description: 'Status changed from To-Do to Done'
    });

    await Activity.create({
      issue: issue2._id,
      user: admin._id,
      action: 'created',
      description: 'Issue created'
    });

    await Activity.create({
      issue: issue2._id,
      user: admin._id,
      action: 'priority_changed',
      field: 'priority',
      oldValue: 'High',
      newValue: 'Critical',
      description: 'Priority changed from High to Critical'
    });

    console.log('Activity logs created successfully');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@promanagex.com / admin123');
    console.log('Member 1: kumarsameer@promanagex.com / kumarsameer123');
    console.log('Member 2: kunaltiwari@promanagex.com / kunaltiwari123');
    console.log('Member 3: shapunpoonja@promanagex.com / shapunpoonja\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();