import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import { create, type StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import type { User } from "~/entities/User";
import type { Post } from "~/entities/Post";
import type { Comment } from "~/entities/Comment";

import { POSTED_COMMENTS, USERS, POSTS } from "./seed";

export type PostedComment = Comment & {
  post: Post;
  user: User;
  comments?: PostedComment[];
};

interface GlobalStore {
  user: User[];
  posts: Post[];
  comments: PostedComment[];

  addUser: (name: string) => User;
  addPost: (content: string) => Post;

  removeUser: (id: string) => string;
  removePost: (id: string) => string;

  addComment: (
    content: string,
    user: string,
    parentId?: string
  ) => PostedComment;

  removeComment: (id: string) => PostedComment | undefined;
  updateComment: (id: string, content: string) => string;
}

const initialState: StateCreator<
  GlobalStore,
  [["zustand/persist", unknown], ["zustand/immer", never]],
  [],
  GlobalStore
> = (set, get) => ({
  user: USERS,
  posts: POSTS,
  comments: POSTED_COMMENTS,

  addUser: (name: string) => {
    set((state) => {
      state.user.push({ id: uuidv4(), name });
    });

    return get().user.find((user) => user.name === name) as User;
  },

  addPost: (content: string) => {
    set((state) => {
      state.posts.unshift({
        id: uuidv4(),
        content,
        createdAt: dayjs().toISOString(),
      });
    });

    return get().posts.find((post) => post.content === content) as Post;
  },

  removeUser: (id) => {
    const removed = get().user.find((user) => user.id === id);
    if (!removed) return "";

    set((state) => {
      state.user = state.user.filter((user) => user.id !== id);
    });

    return removed.id;
  },

  removePost: (id) => {
    const removed = get().posts.find((post) => post.id === id);
    if (!removed) return "";

    set((state) => {
      state.posts = state.posts.filter((post) => post.id !== id);
    });

    return removed.id;
  },

  addComment: (content, author, parentId) => {
    const id = uuidv4();
    const post = get().addPost(content);
    let user = get().user.find((user) => user.name === author);

    const findParentComment = (
      comments: PostedComment[],
      parentId: string
    ): PostedComment | undefined => {
      for (const comment of comments) {
        if (comment.id === parentId) {
          return comment;
        }

        if (comment.comments) {
          const found = findParentComment(comment.comments, parentId);

          if (found) {
            return found;
          }
        }
      }
    };

    if (!user) {
      user = get().addUser(author);
    }

    if (parentId) {
      const parentComment = findParentComment(get().comments, parentId);

      if (parentComment) {
        set((state) => {
          const setNestedComment = (comments: PostedComment[]) => {
            return comments.map((comment) => {
              if (comment.id === parentId) {
                if (!comment.comments) {
                  comment.comments = [];
                }

                comment.comments.unshift({
                  id,
                  postId: post.id,
                  userId: user.id,
                  post,
                  user,
                  createdAt: dayjs().toISOString(),
                });
              } else if (comment.comments) {
                setNestedComment(comment.comments);
              }

              return comment;
            });
          };

          state.comments = setNestedComment(state.comments);
        });

        return parentComment.comments?.find(
          (comment) => comment.id === id
        ) as PostedComment;
      }
    }

    set((state) => {
      state.comments.unshift({
        id,
        postId: post.id,
        userId: user.id,
        post,
        user,
        createdAt: dayjs().toISOString(),
      });
    });

    return get().comments.find((comment) => comment.id === id) as PostedComment;
  },

  removeComment: (id) => {
    let found: PostedComment | undefined;

    set((state) => {
      const findAndRemoveComment = (comments: PostedComment[]) => {
        if (!comments) return;

        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];

          if (comment.id === id) {
            found = comment;

            const postIndex = state.posts.findIndex(
              (post) => post.id === comment.postId
            );

            if (postIndex !== -1) {
              state.posts = state.posts.filter(
                (post) => post.id !== comment.postId
              );
            }

            return comments.filter((_, index) => index !== i);
          }

          if (comment.comments) {
            comment.comments = findAndRemoveComment(comment.comments);
          }
        }

        return comments;
      };

      const c = findAndRemoveComment(state.comments) as PostedComment[];

      state.comments = c;
    });

    return found;
  },

  updateComment: (id, content) => {
    const comment = get().comments.find((comment) => comment.id === id);
    if (!comment) return "";

    const post = get().posts.find((post) => post.id === comment.postId);
    if (!post) return "";

    set((state) => {
      state.comments = state.comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            post: { ...post, content },
            updatedAt: dayjs().toISOString(),
          };
        }
        return comment;
      });
    });

    return comment.id;
  },
});

const createGlobalStore = persist(immer(initialState), {
  name: "__comment-global-store",
});

export const useGlobalStore = create<GlobalStore>()(createGlobalStore);
