import React from 'react';
import { Video, User } from '../types';
import VideoCard from './VideoCard';

interface VideosFeedProps {
  videos: Video[];
  users: User[];
  currentUser: User;
  following: number[];
  onLikeVideo: (videoId: number) => void;
  onAddVideoComment: (videoId: number, text: string) => void;
  onToggleFollow: (creatorId: number) => void;
  onViewProfile: (userId: number) => void;
  onShareVideo: (videoId: number, title: string, description: string) => void;
  onDeleteVideo: (videoId: number) => void;
}

const VideosFeed: React.FC<VideosFeedProps> = ({ videos, users, currentUser, following, onLikeVideo, onAddVideoComment, onToggleFollow, onViewProfile, onShareVideo, onDeleteVideo }) => {
  
  const getCreator = (creatorId: number) => users.find(u => u.id === creatorId);

  // Sort videos by newest first
  const sortedVideos = [...videos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8">
      {sortedVideos.map(video => {
        const creator = getCreator(video.creatorId);
        if (!creator) return null;
        
        return (
          <VideoCard
            key={video.id}
            video={video}
            creator={creator}
            currentUser={currentUser}
            users={users}
            isFollowing={following.includes(video.creatorId)}
            onLikeVideo={onLikeVideo}
            onAddComment={onAddVideoComment}
            onToggleFollow={onToggleFollow}
            onViewProfile={onViewProfile}
            onShareVideo={onShareVideo}
            onDeleteVideo={onDeleteVideo}
          />
        );
      })}
    </div>
  );
};

export default VideosFeed;
