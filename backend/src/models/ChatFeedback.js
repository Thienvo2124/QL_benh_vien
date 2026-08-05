const mongoose = require('mongoose');

const chatFeedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    aiResponse: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: String,
      enum: ['like', 'dislike', null],
      default: null,
    },
    correctedResponse: {
      type: String,
      trim: true,
      default: '',
    },
    isCorrected: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatFeedback', chatFeedbackSchema);
