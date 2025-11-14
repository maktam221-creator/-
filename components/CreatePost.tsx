
import React, { useState } from 'react';
import { User } from '../types';
import { ImageIcon, CloseIcon } from './icons';

interface CreatePostProps {
  currentUser: User;
  onCreatePost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || image) {
      onCreatePost(content, image || undefined);
      setContent('');
      setImage(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4 space-x-reverse">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="ماذا يخطر ببالك؟"
              rows={3}
            />
          </div>
        </div>
        {image && (
          <div className="mt-4 relative">
            <img src={image} alt="Preview" className="rounded-lg max-h-60 w-auto mx-auto" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-indigo-400 transition duration-200"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <button
            type="submit"
            disabled={!content.trim() && !image}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
          >
            نشر
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
