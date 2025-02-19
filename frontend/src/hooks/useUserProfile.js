import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

// Fetch user's voted jokes
const fetchVotedJokes = async () => {
  const { data } = await apiClient.get("/user/voted-jokes");
  return data;
};

// Fetch most common emoji the user clicked
const fetchMostCommonEmoji = async () => {
  const { data } = await apiClient.get("/user/common-emoji");
  return data;
};

// Fetch vote count the user made in the last 24 hours
const fetchVoteCountLast24Hours = async () => {
  const { data } = await apiClient.get("/user/vote-count-24h");
  return data;
};

// Custom hook to manage user profile data (voted jokes, common emoji, vote count in last 24h)
export const useUserProfile = () => {
  const { authUser } = useAuth(); // Get user from AuthContext

  // Guard clause to ensure queries are only executed if the user is authenticated
  if (!authUser) {
    return {
      votedJokes: null,
      mostCommonEmoji: null,
      voteCount24h: null,
      isLoadingVotedJokes: false,
      isLoadingCommonEmoji: false,
      isLoadingVoteCount: false,
      isErrorVotedJokes: false,
      isErrorCommonEmoji: false,
      isErrorVoteCount: false,
    };
  }

  // Query to fetch the user's voted jokes
  const {
    data: votedJokes,
    isLoading: isLoadingVotedJokes,
    isError: isErrorVotedJokes,
    error: votedJokesError,
  } = useQuery({
    queryKey: ["user-voted-jokes"],
    queryFn: fetchVotedJokes,
    enabled: !!authUser, // Ensure the query only runs if the user is authenticated
  });

  // Query to fetch the most common emoji clicked by the user
  const {
    data: mostCommonEmoji,
    isLoading: isLoadingCommonEmoji,
    isError: isErrorCommonEmoji,
    error: mostCommonEmojiError,
  } = useQuery({
    queryKey: ["user-most-common-emoji"],
    queryFn: fetchMostCommonEmoji,
    enabled: !!authUser,
  });

  // Query to fetch the number of votes made by the user in the last 24 hours
  const {
    data: voteCount24h,
    isLoading: isLoadingVoteCount,
    isError: isErrorVoteCount,
    error: voteCountError,
  } = useQuery({
    queryKey: ["user-vote-count-24h"],
    queryFn: fetchVoteCountLast24Hours,
    enabled: !!authUser,
  });

  // Returning all the data and errors
  return {
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
  };
};
