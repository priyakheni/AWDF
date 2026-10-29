import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A task title is required.'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Keep titles clean when documents are created or saved directly.
taskSchema.pre('save', function trimTitle() {
  if (typeof this.title === 'string') this.title = this.title.trim()
})

const Task = mongoose.model('Task', taskSchema)

export default Task
