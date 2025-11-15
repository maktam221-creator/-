export interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  gender?: string;
  country?: string;
  profession?: string;
  qualification?: string;
}

export interface Comment {
  id: number;
  text: string;
  authorId: number;
  timestamp: string;
}

export interface Post {
  id: number;
  authorId: number;
  content: string;
  image?: string;
  likes: number[]; // Array of user IDs who liked the post
  comments: Comment[];
  timestamp: string;
}

export interface Video {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  likes: number[]; // Array of user IDs
  comments: Comment[];
  timestamp: string;
}

export type NotificationType = 'like' | 'comment';

export interface Notification {
  id: number;
  type: NotificationType;
  actorId: number; // User who performed the action
  postId: number; // The post that was interacted with
  postAuthorId: number; // The author of the post
  timestamp: string;
  read: boolean;
}