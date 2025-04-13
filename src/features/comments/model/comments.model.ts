import { useGlobalStore } from "~/app/store";

export const useGetComments = () => {
  const comments = useGlobalStore((state) => state.comments);
  return comments;
};

export const useAddComment = () => {
  const addComment = useGlobalStore((state) => state.addComment);
  return addComment;
};

export const useRemoveComment = () => {
  const removeComment = useGlobalStore((state) => state.removeComment);
  return removeComment;
};
