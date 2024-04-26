const { Schema, model, default: mongoose } = require("mongoose");

const EventModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ticketsAvailable: {
      type: Number,
    },
    eventPicture: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    themes: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("events", EventModel);
