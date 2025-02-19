import { useUserProfile } from "../hooks/useUserProfile";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { authUser } = useAuth(); // Retrieve user info

  // Use custom hook to fetch user profile data
  const {
    votedJokes,
    mostCommonEmoji,
    voteCount24h,
    isLoadingVotedJokes,
    isLoadingCommonEmoji,
    isLoadingVoteCount,
    isErrorVotedJokes,
    isErrorCommonEmoji,
    isErrorVoteCount,
    votedJokesError,
    mostCommonEmojiError,
    voteCountError,
  } = useUserProfile();

  if (isLoadingVotedJokes || isLoadingCommonEmoji || isLoadingVoteCount) {
    return <Loader2 className="h-12 w-12 text-gray-600 animate-spin mx-auto" />;
  }

  if (isErrorVotedJokes || isErrorCommonEmoji || isErrorVoteCount) {
    return (
      <div className="text-center text-red-500">
        {votedJokesError?.message ||
          mostCommonEmojiError?.message ||
          voteCountError?.message}
      </div>
    );
  }

  return (
    <div className="max-w-full md:max-w-[85%] mx-auto p-6">
      <div className="bg-[#fafafa] shadow-lg rounded-lg flex flex-col items-center justify-center gap-4 p-8">
        {/* User Profile Info */}
        <div className="text-center flex-col flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">
            {authUser?.firstName} {authUser?.lastName}
          </h1>
          <p className="text-gray-500">{authUser?.email}</p>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-center text-2xl font-medium">
            Total Jokes Voted:
          </h2>
          <p className="text-xl mt-2 sm:mt-0">{votedJokes.length || 0}</p>
        </div>
        {/* Most Common Emoji */}
        {mostCommonEmoji && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between">
            <h2 className="text-center text-2xl font-medium">
              Most Common Emoji:
            </h2>
            <p className="text-xl mt-2 sm:mt-0">
              {mostCommonEmoji.mostCommonEmoji || "No emoji voted yet."}
            </p>
          </div>
        )}
        {/* Vote Count in Last 24 Hours */}
        {voteCount24h && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between">
            <h2 className="text-center text-2xl font-medium">
              Votes in the Last 24 Hours:{" "}
            </h2>
            <p className="text-xl mt-2 sm:mt-0">
              {voteCount24h.voteCount || 0}
            </p>
          </div>
        )}
        {/* Voted Jokes List */}
        <div className="w-full space-y-6 mt-8">
          <h2 className="text-2xl md:text-left text-center font-medium">
            Recently Voted Jokes
          </h2>
          {votedJokes && votedJokes.length > 0 ? (
            // Sort jokes by voteTime in descending order and get the first 10 jokes
            votedJokes
              .sort((a, b) => new Date(b.voteTime) - new Date(a.voteTime)) // Sort by voteTime in descending order
              .slice(0, 10) // Get the first 10 jokes
              .map((joke) => (
                <div
                  key={joke._id}
                  className="bg-[#fafafa] shadow-lg rounded-lg p-6"
                >
                  <h3 className="text-xl font-medium">{joke.question}</h3>
                  <p className="text-gray-700 mt-2">{joke.answer}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        joke.userVote === "😂" ? "bg-yellow-300" : "bg-gray-200"
                      }`}
                      disabled
                    >
                      😂 {joke.votes[0].value}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        joke.userVote === "👍" ? "bg-yellow-300" : "bg-gray-200"
                      }`}
                      disabled
                    >
                      👍 {joke.votes[1].value}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        joke.userVote === "❤️" ? "bg-yellow-300" : "bg-gray-200"
                      }`}
                      disabled
                    >
                      ❤️ {joke.votes[2].value}
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>You haven't voted for any jokes yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}
