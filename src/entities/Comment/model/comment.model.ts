export type Comment = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
};
