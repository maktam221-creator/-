import React, { useState, useRef } from 'react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import { PencilIcon, CameraIcon } from './icons';

interface ProfileProps {
  user: User;
  posts: Post[];
  currentUser: User;
  users: User[];
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, text: string) => void;
  onViewProfile: (userId: number) => void;
  onUpdateProfile: (userId: number, newBio: string, newAvatar: string) => void;
  onSharePost: (postId: number, postContent: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, posts, currentUser, users, onLikePost, onAddComment, onViewProfile, onUpdateProfile, onSharePost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedAvatar, setEditedAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const userPosts = posts
    .filter(p => p.authorId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onUpdateProfile(user.id, editedBio, editedAvatar || user.avatar);
    setIsEditing(false);
    setEditedAvatar(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBio(user.bio);
    setEditedAvatar(null);
  };

  return (
    <div>
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 relative">
        {currentUser.id === user.id && !isEditing && (
            <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-4 left-4 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white p-2 rounded-full transition duration-200"
                aria-label="تعديل الملف الشخصي"
            >
                <PencilIcon className="w-5 h-5" />
            </button>
        )}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right">
          <div className="relative mb-4 sm:mb-0 sm:ml-6">
            <img src={editedAvatar || user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"/>
            {isEditing && (
              <>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={avatarInputRef} 
                  onChange={handleAvatarChange}
                />
                <button
                  onClick={() => avatarInputRef.current?.click()} 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-opacity-60 transition"
                  aria-label="تغيير الصورة الرمزية"
                >
                  <CameraIcon className="w-8 h-8"/>
                </button>
              </>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-slate-400 p-2 mt-2 rounded-lg border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                aria-label="السيرة الذاتية"
              />
            ) : (
              <p className="text-slate-400 mt-2 min-h-[3em]">{user.bio}</p>
            )}
            
            <div className="flex justify-center sm:justify-start space-x-6 space-x-reverse mt-4">
              <div className="text-center">
                <p className="font-bold text-xl text-white">{userPosts.length}</p>
                <p className="text-sm text-slate-400">منشورات</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-white">{user.followers}</p>
                <p className="text-sm text-slate-400">متابِعون</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-white">{user.following}</p>
                <p className="text-sm text-slate-400">متابَعون</p>
              </div>
            </div>

            {isEditing && (
                <div className="flex justify-end space-x-3 space-x-reverse mt-4">
                    <button onClick={handleCancel} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-full hover:bg-slate-700 transition">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition">
                        حفظ التغييرات
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">منشورات {user.name}</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              author={user} 
              currentUser={currentUser}
              onLikePost={onLikePost}
              onAddComment={onAddComment}
              onViewProfile={onViewProfile}
              onSharePost={onSharePost}
              users={users}
            />
          ))
        ) : (
          <div className="text-center text-slate-400 bg-slate-800 p-8 rounded-lg">
            <p>لا توجد منشورات لعرضها بعد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
