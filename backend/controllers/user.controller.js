import User from "../models/user.model.js";
import Joke from "../models/joke.model.js";

export const getVotedJokes = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request

    // Fetch the user to get the list of jokes they voted on
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user doesn't exist
    }

    // Extract joke IDs from the user's votedJokes array
    const jokeIds = user.votedJokes.map((vote) => vote.jokeId);

    // Fetch the jokes from the Joke collection using the extracted joke IDs
    const jokes = await Joke.find({ _id: { $in: jokeIds } });

    // Map each vote to its respective joke, including the emoji voted by the user
    const votedJokes = user.votedJokes
      .map((vote) => {
        const joke = jokes.find((j) => j._id.equals(vote.jokeId)); // Find the joke by ID
        return joke
          ? {
              jokeId: joke._id, // Joke ID
              question: joke.question, // Joke question
              answer: joke.answer, // Joke answer
              userVote: vote.emoji, // Emoji reaction from the user
              votedAt: vote.votedAt, // Time the user voted
              votes: joke.votes,
            }
          : null;
      })
      .filter((j) => j !== null); // Filter out any null values (in case the joke was deleted)

    res.status(200).json(votedJokes); // Return the list of voted jokes
  } catch (error) {
    console.error("Error in getVotedJokes controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMostCommonUserEmoji = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request

    // Fetch the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user doesn't exist
    }

    // Check if the user has any votes; if no votes, return null for most common emoji
    if (!user.votedJokes.length) {
      return res.status(200).json({ mostCommonEmoji: null });
    }

    // Create an object to count the occurrences of each emoji
    const emojiCount = {};
    user.votedJokes.forEach((vote) => {
      if (vote.emoji) {
        emojiCount[vote.emoji] = (emojiCount[vote.emoji] || 0) + 1; // Count the emoji occurrences
      }
    });

    // Find the most common emoji by comparing the counts
    const mostCommonEmoji = Object.keys(emojiCount).reduce(
      (a, b) => (emojiCount[a] > emojiCount[b] ? a : b) // Compare to get the emoji with the highest count
    );

    res.status(200).json({ mostCommonEmoji }); // Return the most common emoji
  } catch (error) {
    console.error("Error in getMostCommonUserEmoji controller:", error); // Log any errors
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};

export const getUserVoteCountLast24Hours = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request

    // Fetch the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user doesn't exist
    }

    // Define the timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24); // Subtract 24 hours from the current time

    // Filter the votes made by the user in the last 24 hours
    const recentVotes = user.votedJokes.filter(
      (vote) => vote.votedAt >= twentyFourHoursAgo // Check if the vote timestamp is within the last 24 hours
    );

    res.status(200).json({ voteCount: recentVotes.length }); // Return the count of votes in the last 24 hours
  } catch (error) {
    console.error("Error in getUserVoteCountLast24Hours controller:", error); // Log any errors
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};
