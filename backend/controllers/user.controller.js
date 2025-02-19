import User from "../models/user.model.js";
import Joke from "../models/joke.model.js";

export const getVotedJokes = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authentication middleware sets req.user

    // Fetch the user to get voted joke IDs
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract joke IDs from the votedJokes array
    const jokeIds = user.votedJokes.map((vote) => vote.jokeId);
    // Fetch the actual joke documents from the Joke collection
    const jokes = await Joke.find({ _id: { $in: jokeIds } });

    // Map jokes to include the user's vote info
    const votedJokes = user.votedJokes
      .map((vote) => {
        const joke = jokes.find((j) => j._id.equals(vote.jokeId));
        return joke
          ? {
              jokeId: joke._id,
              question: joke.question,
              answer: joke.answer,
              userVote: vote.emoji, // User's emoji reaction
              votedAt: vote.votedAt,
            }
          : null;
      })
      .filter((j) => j !== null); // Filter out null values if a joke was deleted

    res.status(200).json(votedJokes);
  } catch (error) {
    console.error("Error in getVotedJokes controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMostCommonUserEmoji = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.votedJokes.length) {
      return res.status(200).json({ mostCommonEmoji: null });
    }

    // Count occurrences of each emoji
    const emojiCount = {};
    user.votedJokes.forEach((vote) => {
      if (vote.emoji) {
        emojiCount[vote.emoji] = (emojiCount[vote.emoji] || 0) + 1;
      }
    });

    // Find the most common emoji
    const mostCommonEmoji = Object.keys(emojiCount).reduce((a, b) =>
      emojiCount[a] > emojiCount[b] ? a : b
    );

    res.status(200).json({ mostCommonEmoji });
  } catch (error) {
    console.error("Error in getMostCommonUserEmoji controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserVoteCountLast24Hours = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define the timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Count votes made in the last 24 hours
    const recentVotes = user.votedJokes.filter(
      (vote) => vote.votedAt >= twentyFourHoursAgo
    );

    res.status(200).json({ voteCount: recentVotes.length });
  } catch (error) {
    console.error("Error in getUserVoteCountLast24Hours controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
