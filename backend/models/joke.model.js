import mongoose from "mongoose";

const jokeSchema = new mongoose.Schema(
  {
    teeheeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    votes: [
      {
        _id: false,
        value: {
          type: Number,
          required: true,
          default: 0,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Joke = mongoose.model("Joke", jokeSchema);
export default Joke;
