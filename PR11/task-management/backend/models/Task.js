const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [120, 'Title cannot exceed 120 characters'] },
  description: { type: String, trim: true, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
  dueDate: { type: Date, default: null },
  project: { type: String, trim: true, default: '' },
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = mongoose.model('Task', taskSchema)
