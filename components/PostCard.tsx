import React, { useState } from 'react';
import { Post, User } from '../types';
import { HeartIcon, CommentIcon, ShareIcon } from './icons';

interface PostCardProps {
  post: Post;
  author: User;
  currentUser: User;
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, text: string) => void;
  onViewProfile: (userId: number) => void;
  onSharePost: (postId: number, postContent: string) => void;
  users: User[];
}

const PostCard: React.FC<PostCardProps> = ({ post, author, currentUser, onLikePost, onAddComment, onViewProfile, onSharePost, users }) => {
  const [commentText, setCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState(false);
  const isLiked = post.likes.includes(currentUser.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  const getCommentAuthor = (authorId: number) => users.find(u => u.id === authorId);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            onClick={() => onViewProfile(author.id)}
          />
          <div>
            <p 
              className="font-bold text-lg text-white cursor-pointer"
              onClick={() => onViewProfile(author.id)}
            >
              {author.name}
            </p>
            <p className="text-sm text-slate-400">{new Date(post.timestamp).toLocaleString('ar-EG')}</p>
          </div>
        </div>
        <p className="text-slate-200 mb-4 whitespace-pre-wrap">{post.content}</p>
      </div>
      {post.image && <img src={post.image} alt="Post content" className="w-full object-cover" />}
      <div className="p-4">
        <div className="flex items-center text-slate-400 space-x-6 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button onClick={() => onLikePost(post.id)} className={`transition duration-200 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
              <HeartIcon className="w-6 h-6" filled={isLiked} />
            </button>
            <span>{post.likes.length}</span>
          </div>
          <button onClick={() => setCommentsVisible(!commentsVisible)} className="flex items-center space-x-2 space-x-reverse transition duration-200 hover:text-indigo-400">
            <CommentIcon className="w-6 h-6" />
            <span>{post.comments.length}</span>
          </button>
          <button onClick={() => onSharePost(post.id, post.content)} className="flex items-center space-x-2 space-x-reverse transition duration-200 hover:text-green-500">
            <ShareIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="border-t border-slate-700 p-4">
        {commentsVisible && post.comments.length > 0 && (
            <div className="mb-4">
                {post.comments.map(comment => {
                  const commentAuthor = getCommentAuthor(comment.authorId);
                  return (
                    <div key={comment.id} className="flex items-start space-x-3 space-x-reverse mb-3">
                      <img src={commentAuthor?.avatar} alt={commentAuthor?.name} className="w-8 h-8 rounded-full object-cover mt-1 cursor-pointer" onClick={() => onViewProfile(commentAuthor?.id || 0)}/>
                      <div className="flex-1 bg-slate-700 rounded-lg p-2">
                        <p 
                          className="font-semibold text-white text-sm cursor-pointer"
                          onClick={() => onViewProfile(commentAuthor?.id || 0)}
                        >
                          {commentAuthor?.name}
                        </p>
                        <p className="text-slate-300 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
        )}
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3 space-x-reverse">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setCommentsVisible(true)}
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="اكتب تعليقاً..."
          />
        </form>
      </div>
    </div>
  );
};

export default PostCard;
