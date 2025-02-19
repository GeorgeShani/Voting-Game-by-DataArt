import Joke from "../models/joke.model.js";
import axios from "axios";

// Controller to fetch a joke from the Teehee API and store or update it in the database
export const getJoke = async (req, res) => {
  try {
    // Fetch joke from the Teehee API
    const response = await axios.get("https://teehee.dev/api/joke");
    const fetchedJoke = response.data;

    // Check if the joke already exists in the database
    const existingJoke = await Joke.findOne({ teeheeId: fetchedJoke.id });
    
    // If the joke exists, return it from the database
    if (existingJoke) {
      return res.status(200).json(existingJoke);
    }

    // If the joke doesn't exist, create a new joke with initialized votes
    const newJoke = new Joke({
      teeheeId: fetchedJoke.id,
      question: fetchedJoke.question,
      answer: fetchedJoke.answer,
      votes: [
        { value: 0, label: "😂" },
        { value: 0, label: "👍" },
        { value: 0, label: "❤️" },
      ],
    });

    // Save the new joke to the database
    await newJoke.save();
    res.status(201).json(newJoke); // Respond with the newly created joke
  } catch (error) {
    console.error("Error in getJoke controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to handle voting on a joke
export const submitVote = async (req, res) => {
  const { id: jokeId } = req.params; // Extract joke ID from request parameters
  const { emoji } = req.body; // Extract emoji reaction from request body
  const loggedInUser = req.user; // Get the authenticated user from middleware

  try {
    const joke = await Joke.findById(jokeId);
    if (!joke) return res.status(404).json({ message: "Joke not found" });

    // Index mapping for predefined votes structure
    const emojiIndexMap = { "😂": 0, "👍": 1, "❤️": 2 };
    const emojiIndex = emojiIndexMap[emoji];

    if (emojiIndex === undefined) {
      return res.status(400).json({ message: "Invalid emoji selection" });
    }

    // Check if user already voted for this joke
    const existingVoteIndex = loggedInUser.votedJokes.findIndex(
      (vote) => vote.jokeId.toString() === joke._id.toString()
    );

    if (existingVoteIndex !== -1) {
      const oldEmoji = loggedInUser.votedJokes[existingVoteIndex].emoji;
      const oldEmojiIndex = emojiIndexMap[oldEmoji];

      if (oldEmoji === emoji) {
        // Same emoji clicked → Remove vote (unvote)
        loggedInUser.votedJokes.splice(existingVoteIndex, 1);
        joke.votes[emojiIndex].value = Math.max(0, joke.votes[emojiIndex].value - 1);
      } else {
        // Different emoji clicked → Switch vote
        loggedInUser.votedJokes[existingVoteIndex].emoji = emoji;
        joke.votes[oldEmojiIndex].value = Math.max(0, joke.votes[oldEmojiIndex].value - 1);
        joke.votes[emojiIndex].value += 1;
      }
    } else {
      // First time voting
      loggedInUser.votedJokes.push({ jokeId, emoji });
      joke.votes[emojiIndex].value += 1;
    }

    await loggedInUser.save();
    await joke.save();
    res.status(200).json({ message: "Vote updated!", joke });
  } catch (error) {
    console.error("Error in submitVote controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Automated task for deleting the jokes with 0 votes in total (for database cleanup purposes)
export const deleteJokesWithZeroVotes = async () => {
  try {
    const result = await Joke.deleteMany({
      $and: [
        { "votes.0.value": 0 },
        { "votes.1.value": 0 },
        { "votes.2.value": 0 },
      ],
    });

    if (result.deletedCount > 0) {
      console.log(`🗑 Deleted ${result.deletedCount} jokes with 0 votes.`);
    }
  } catch (error) {
    console.error("Error cleaning up jokes:", error.message);
  }
};