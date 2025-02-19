import { useState } from "react";
import { useJoke } from "../hooks/useJoke";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { joke, isLoading, isError, vote, isVoting, refetchJoke, hasVotedFor } = useJoke();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Handles smooth joke transition when fetching new one
  const handleNextJoke = async () => {
    if (!joke || isTransitioning) return;

    setIsTransitioning(true); // Prevent multiple clicks
    setShowAnswer(false); // Hide answer on new joke

    // Wait for animation before fetching the next joke
    setTimeout(() => {
      refetchJoke();
      setIsTransitioning(false);
    }, 600); // Delay matches the animation duration
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent py-4 px-6">
      <div className="w-full max-w-xl space-y-8 text-center">
        {/* Loading & Error States */}
        {isLoading && (
          <Loader2 className="h-12 w-12 text-gray-600 animate-spin mx-auto" />
        )}
        {isError && (
          <p className="text-red-600 text-lg">
            Failed to load joke. Try again!
          </p>
        )}
        {/* Joke Card with Animation */}
        <div className="relative h-80 overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            {joke && (
              <motion.div
                key={joke._id}
                initial={{ opacity: 0, x: 300 }} // New joke enters from right
                animate={{ opacity: 1, x: 0 }} // Fully appears
                exit={{ opacity: 0, x: -300 }} // Old joke exits left
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col justify-center items-center bg-[#fafafa] shadow-2xl rounded-2xl p-8 w-full"
              >
                <p className="text-2xl font-bold">{joke.question}</p>
                {showAnswer && (
                  <p className="text-lg text-gray-700 mt-4">{joke.answer}</p>
                )}
                <button
                  className="mt-6 px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Vote Buttons */}
        {joke && (
          <div className="flex justify-center gap-4 sm:gap-6">
            {joke.votes.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => vote({ jokeId: joke._id, emoji: label })}
                disabled={isVoting}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-lg sm:text-xl font-bold rounded-lg border-2 ${
                  hasVotedFor(label)
                    ? "bg-yellow-300 text-white border-yellow-500"
                    : "bg-white text-gray-700 hover:bg-yellow-100 border-gray-300"
                } transition`}
              >
                <span className="text-xl sm:text-2xl">{label}</span>
                <span>{value}</span>
              </button>
            ))}
          </div>
        )}
        {/* Next Joke Button */}
        <button
          onClick={handleNextJoke}
          className="mt-8 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-yellow-300 text-white font-bold rounded-lg shadow-md hover:bg-yellow-400 transition"
          disabled={isTransitioning}
        >
          Next Joke →
        </button>
      </div>
    </div>
  );
}
