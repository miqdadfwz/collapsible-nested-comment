import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import { create, type StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import type { User } from "~/entities/User";
import type { Post } from "~/entities/Post";
import type { Comment } from "~/entities/Comment";

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
}

/**
 * State initialization for global store
 * Uses immer middleware for simplified state mutations
 * and persist middleware for automatic localStorage persistence
 */
const initialState: StateCreator<
  GlobalStore,
  [["zustand/persist", unknown], ["zustand/immer", never]],
  [],
  GlobalStore
> = (set, get) => ({
  user: [],
  posts: [],
  comments: [],

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

  /**
   * Add a comment to the store, either as a top-level comment or as a reply
   * to an existing comment (when parentId is provided)
   *
   * @param content - HTML content of the comment
   * @param author - Name of the comment author
   * @param parentId - Optional ID of the parent comment for replies
   * @returns The newly created comment object
   */
  addComment: (content, author, parentId) => {
    const id = uuidv4();
    const post = get().addPost(content);
    let user = get().user.find((user) => user.name === author);

    /**
     * Recursively search for a comment by its ID within the nested comment structure
     */
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
          /**
           * Recursively traverse comment tree and update the target comment
           * by adding the new reply to its comments array
           */
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

  /**
   * Remove a comment from the store and clean up related posts
   * Works with both top-level and nested comments
   *
   * @param id - ID of the comment to remove
   * @returns The removed comment or undefined if not found
   */
  removeComment: (id) => {
    let found: PostedComment | undefined;

    set((state) => {
      /**
       * Recursively search and remove a comment from the nested comment structure
       * Also removes the associated post from the posts array
       */
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
});

const createGlobalStore = persist(immer(initialState), {
  name: "__comment-global-store",
});

export const useGlobalStore = create<GlobalStore>()(createGlobalStore);
