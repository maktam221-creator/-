import React, { useState, useMemo } from 'react';
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

type SortByType = 'newest' | 'oldest' | 'most_liked';

const Feed: React.FC<FeedProps> = ({ posts, users, currentUser, onCreatePost, onLikePost, onAddComment, onViewProfile, onSharePost }) => {
  const [sortBy, setSortBy] = useState<SortByType>('newest');

  const getAuthor = (authorId: number) => users.find(u => u.id === authorId);

  const sortedPosts = useMemo(() => {
    const sortablePosts = [...posts];
    switch (sortBy) {
      case 'oldest':
        return sortablePosts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case 'most_liked':
        return sortablePosts.sort((a, b) => b.likes.length - a.likes.length);
      case 'newest':
      default:
        return sortablePosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }, [posts, sortBy]);

  const getButtonClass = (sortType: SortByType) => {
    const baseClasses = "px-4 py-1 rounded-full text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500";
    if (sortBy === sortType) {
      return `${baseClasses} bg-indigo-600 text-white`;
    }
    return `${baseClasses} bg-slate-700 text-slate-300 hover:bg-slate-600`;
  };


  return (
    <div>
      <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
      
      <div className="bg-slate-800 p-3 rounded-lg mb-6 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-slate-300">ترتيب حسب:</span>
        <div className="flex space-x-2 space-x-reverse">
          <button onClick={() => setSortBy('newest')} className={getButtonClass('newest')}>
            الأحدث
          </button>
          <button onClick={() => setSortBy('oldest')} className={getButtonClass('oldest')}>
            الأقدم
          </button>
          <button onClick={() => setSortBy('most_liked')} className={getButtonClass('most_liked')}>
            الأكثر إعجاباً
          </button>
        </div>
      </div>

      <div>
        {sortedPosts.map(post => {
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