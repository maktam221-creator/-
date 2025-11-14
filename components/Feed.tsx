import React from 'react';
import { Post, User } from '../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  users: User[];
  currentUser: User;
  onCreatePost: (content: string, image?: string) => void;
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, text: string) => void;
  onViewProfile: (userId: number) => void;
  onSharePost: (postId: number, postContent: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, users, currentUser, onCreatePost, onLikePost, onAddComment, onViewProfile, onSharePost }) => {
  const getAuthor = (authorId: number) => users.find(u => u.id === authorId);

  return (
    <div>
      <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
      <div>
        {posts
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(post => {
            const author = getAuthor(post.authorId);
            if (!author) return null;
            return <PostCard 
                      key={post.id} 
                      post={post} 
                      author={author} 
                      currentUser={currentUser}
                      onLikePost={onLikePost}
                      onAddComment={onAddComment}
                      onViewProfile={onViewProfile}
                      onSharePost={onSharePost}
                      users={users}
                   />;
          })}
      </div>
    </div>
  );
};

export default Feed;
