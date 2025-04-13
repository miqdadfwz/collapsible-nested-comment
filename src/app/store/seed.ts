import dayjs from "dayjs";

import type { Comment } from "~/entities/Comment";
import type { User } from "~/entities/User";
import type { Post } from "~/entities/Post";

type PostedComment = Comment & {
  post: Post;
  user: User;
  comments?: PostedComment[];
};

export const USERS: User[] = [
  { id: "user1", name: "John Doe" },
  { id: "user2", name: "Jane Smith" },
  { id: "user3", name: "Bob Johnson" },
  { id: "user4", name: "Alice Williams" },
];

export const POSTS: Post[] = [
  {
    id: "post1",
    content: "This is the first post content",
    createdAt: dayjs(new Date("2023-01-01T10:00:00Z")).toISOString(),
    updatedAt: dayjs(new Date("2023-01-01T11:30:00Z")).toISOString(),
  },
  {
    id: "post2",
    content: "Second post with interesting content",
    createdAt: dayjs(new Date("2023-01-03T14:25:00Z")).toISOString(),
  },
  {
    id: "post3",
    content: "Third post for testing",
    createdAt: dayjs(new Date("2023-01-05T09:15:00Z")).toISOString(),
  },
];

export const POSTED_COMMENTS: PostedComment[] = [
  {
    id: "comment1",
    postId: "post1",
    userId: "user1",
    createdAt: dayjs(new Date("2023-01-01T12:00:00Z")).toISOString(),
    updatedAt: dayjs(new Date("2023-01-02T09:30:00Z")).toISOString(),
    post: POSTS[0],
    user: USERS[0],
  },
  {
    id: "comment2",
    postId: "post1",
    userId: "user2",
    createdAt: dayjs(new Date("2023-01-03T15:20:00Z")).toISOString(),
    post: POSTS[0],
    user: USERS[1],
  },
  {
    id: "comment3",
    postId: "post2",
    userId: "user1",
    createdAt: dayjs(new Date("2023-01-04T08:45:00Z")).toISOString(),
    post: POSTS[1],
    user: USERS[0],
  },
  {
    id: "comment4",
    postId: "post2",
    userId: "user3",
    createdAt: dayjs(new Date("2023-01-04T10:30:00Z")).toISOString(),
    post: POSTS[1],
    user: USERS[2],
    comments: [
      {
        id: "comment5",
        postId: "post2",
        userId: "user1",
        createdAt: dayjs(new Date("2023-01-04T11:15:00Z")).toISOString(),
        post: POSTS[1],
        user: USERS[0],
        comments: [
          {
            id: "comment7",
            postId: "post2",
            userId: "user4",
            createdAt: dayjs(new Date("2023-01-04T12:05:00Z")).toISOString(),
            post: POSTS[1],
            user: USERS[3],
          }
        ]
      },
    ],
  },
  {
    id: "comment6",
    postId: "post3",
    userId: "user2",
    createdAt: dayjs(new Date("2023-01-06T16:05:00Z")).toISOString(),
    post: POSTS[2],
    user: USERS[1],
  },
];

export const COMMENTS = [
  {
    id: "1",
    postId: "1",
    userId: "1",
    createdAt: dayjs(new Date("2023-01-01T00:00:00Z")).toISOString(),
    updatedAt: dayjs(new Date("2023-01-02T00:00:00Z")).toISOString(),
  },
  {
    id: "2",
    postId: "1",
    userId: "2",
    createdAt: dayjs(new Date("2023-01-03T00:00:00Z")).toISOString(),
  },
  {
    id: "3",
    postId: "2",
    userId: "1",
    createdAt: dayjs(new Date("2023-01-04T00:00:00Z")).toISOString(),
  },
];
