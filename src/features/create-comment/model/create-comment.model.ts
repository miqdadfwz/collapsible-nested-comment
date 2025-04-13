import { useGlobalStore } from "~/app/store";

export const useAddComment = () => {
  const addComment = useGlobalStore((state) => state.addComment);
  return addComment;
};
