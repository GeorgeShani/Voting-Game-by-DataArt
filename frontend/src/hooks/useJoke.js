import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Fetch joke from backend
const fetchJoke = async () => {
  const { data } = await apiClient.get("/jokes");
  return data;
};

// Submit a vote for a joke
const submitVote = async ({ jokeId, emoji }) => {
  const { data } = await apiClient.post(`/jokes/${jokeId}`, { emoji });
  return data;
};

// Custom hook to manage joke fetching & voting
export const useJoke = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuth(); // Get user from AuthContext

  // Query to fetch the joke
  const { 
    data: joke, 
    isLoading, 
    isError, 
    refetch: refetchJoke 
  } = useQuery({
    queryKey: ["joke"],
    queryFn: fetchJoke,
  });

  // Helper to check if user has voted for a specific emoji
  const hasVotedFor = (emojiLabel) => {
    if (!authUser?.votedJokes || !joke?._id) return false;
    
    return authUser.votedJokes.some(
      vote => vote.jokeId === joke._id && vote.emoji === emojiLabel
    );
  };

  // Mutation to submit a vote
  const { mutate: vote, isPending: isVoting } = useMutation({
    mutationFn: submitVote,
    onMutate: async ({ jokeId, emoji }) => {
      await queryClient.cancelQueries({ queryKey: ["joke"] });
      const prevJoke = queryClient.getQueryData(["joke"]);
      
      // Optimistically update joke votes
      queryClient.setQueryData(["joke"], (oldJoke) => {
        if (!oldJoke) return oldJoke;
        
        const emojiIndexMap = { "😂": 0, "👍": 1, "❤️": 2 };
        const emojiIndex = emojiIndexMap[emoji];
        const updatedVotes = [...oldJoke.votes];
        
        // Check if user has already voted
        const existingVote = authUser?.votedJokes?.find(
          vote => vote.jokeId === jokeId
        );
        
        if (existingVote) {
          // If same emoji, unvote (remove)
          if (existingVote.emoji === emoji) {
            updatedVotes[emojiIndex].value = Math.max(0, updatedVotes[emojiIndex].value - 1);
          } else {
            // If different emoji, switch vote
            const oldEmojiIndex = emojiIndexMap[existingVote.emoji];
            updatedVotes[oldEmojiIndex].value = Math.max(0, updatedVotes[oldEmojiIndex].value - 1);
            updatedVotes[emojiIndex].value += 1;
          }
        } else {
          // First time voting
          updatedVotes[emojiIndex].value += 1;
        }
        
        return { ...oldJoke, votes: updatedVotes };
      });
      
      return { prevJoke };
    },
    onSuccess: (response) => {
      queryClient.setQueryData(["joke"], response.joke);
      toast.success(response.message || "Vote submitted!");
    },
    onError: (error, _, context) => {
      toast.error(error.response?.data?.message || "Voting failed");
      
      // Rollback to previous state if error occurs
      if (context?.prevJoke) {
        queryClient.setQueryData(["joke"], context.prevJoke);
      }
    },
    onSettled: () => {
      // Since auth user is managed in context, we only invalidate the joke query
      queryClient.invalidateQueries({ queryKey: ["joke"] });
    },
  });

  return { 
    joke, 
    isLoading, 
    isError, 
    vote, 
    isVoting, 
    refetchJoke,
    hasVotedFor 
  };
};