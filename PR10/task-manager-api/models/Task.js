import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A task title is required.'],
    trim: true,
    maxlength: [120, 'Task titles must be 120 characters or fewer.'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [1000, 'Task descriptions must be 1000 characters or fewer.'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high.',
    },
    default: 'medium',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

taskSchema.pre('save', function trimTitle() {
  if (typeof this.title === 'string') this.title = this.title.trim()
})

taskSchema.set('toJSON', {
  transform(document, result) {
    delete result.user
    delete result.__v
    return result
  },
})

const Task = mongoose.model('Task', taskSchema)

export default Task
