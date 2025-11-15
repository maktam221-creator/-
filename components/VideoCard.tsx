import React, { useState, useRef, useEffect } from 'react';
import { Video, User } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, TrashIcon, PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon, UserIcon } from './icons';

interface VideoCardProps {
  video: Video;
  creator: User;
  currentUser: User;
  users: User[];
  isFollowing: boolean;
  onLikeVideo: (videoId: number) => void;
  onAddComment: (videoId: number, text: string) => void;
  onToggleFollow: (creatorId: number) => void;
  onViewProfile: (userId: number) => void;
  onShareVideo: (videoId: number, title: string, description: string) => void;
  onDeleteVideo: (videoId: number) => void;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'أ';
  return num.toString();
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};


const VideoCard: React.FC<VideoCardProps> = ({ video, creator, currentUser, users, isFollowing, onLikeVideo, onAddComment, onToggleFollow, onViewProfile, onShareVideo, onDeleteVideo }) => {
  const [commentText, setCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const isLiked = video.likes.includes(currentUser.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fix for TypeScript errors: Property 'play' and 'pause' do not exist on type 'Element'.
        // The IntersectionObserver's entry.target is of type 'Element' by default. We need to
        // cast it to 'HTMLVideoElement' to access video-specific methods like play() and pause().
        const targetVideo = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          targetVideo.play().catch(error => {
            console.warn("Video autoplay was prevented by browser.", error);
          });
        } else {
          targetVideo.pause();
        }
      },
      {
        threshold: 0.5, // Play when 50% of the video is visible
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  useEffect(() => {
    if (!commentsVisible) {
        setShowAllComments(false);
    }
  }, [commentsVisible]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(video.id, commentText);
      setCommentText('');
    }
  };
  
  const getCommentAuthor = (authorId: number) => users.find(u => u.id === authorId);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoRef.current) {
      const seekbar = e.currentTarget;
      const rect = seekbar.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      const currentlyMuted = videoRef.current.muted;
      videoRef.current.muted = !currentlyMuted;
      setIsMuted(!currentlyMuted);
      if (currentlyMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 1;
        setVolume(1);
      }
    }
  };

  const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
        const setPlaying = () => setIsPlaying(true);
        const setPaused = () => setIsPlaying(false);

        videoElement.addEventListener('play', setPlaying);
        videoElement.addEventListener('pause', setPaused);
        videoElement.addEventListener('ended', setPaused);
        return () => {
            videoElement.removeEventListener('play', setPlaying);
            videoElement.removeEventListener('pause', setPaused);
            videoElement.removeEventListener('ended', setPaused);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }
  }, []);


  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden snap-start">
      <div 
        className="relative aspect-[9/16] bg-black group"
        onMouseEnter={resetControlsTimeout}
        onMouseLeave={() => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            setShowControls(false);
        }}
        onMouseMove={resetControlsTimeout}
        onClick={togglePlayPause}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          loop
          muted
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        
        {/* Play/Pause Button in Center */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 p-4 rounded-full">
            <PlayIcon className="w-16 h-16 text-white"/>
          </div>
        </div>


        {/* Delete Button */}
        {currentUser.id === creator.id && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteVideo(video.id); }}
            className="absolute top-3 left-3 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-red-600/80 transition duration-200"
            aria-label="حذف الفيديو"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        )}

        <div className={`absolute bottom-0 right-0 w-full p-4 text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={e => e.stopPropagation()}>
           {/* Seek Bar */}
           <div className="w-full cursor-pointer py-2" onClick={handleSeek}>
             <div className="bg-white/30 h-1 rounded-full">
               <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${(progress / duration) * 100}%` }}></div>
             </div>
           </div>

           {/* Controls Row */}
           <div className="flex justify-between items-center text-sm">
             <div className="flex items-center space-x-3 space-x-reverse">
                <button onClick={togglePlayPause} className="text-white">
                  {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                </button>
                <div className="flex items-center space-x-2 space-x-reverse group/volume">
                    <button onClick={toggleMute} className="text-white">
                        {isMuted || volume === 0 ? <VolumeOffIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-indigo-500"
                    />
                </div>
             </div>
             <span>{formatTime(progress)} / {formatTime(duration)}</span>
           </div>
         </div>


        {/* Video Info Overlay */}
        <div className="absolute bottom-16 right-0 p-4 text-white w-full pointer-events-none">
          <div className="flex items-center space-x-3 space-x-reverse mb-2">
            <div className="relative group flex-shrink-0">
                <div 
                    className="flex items-center space-x-3 space-x-reverse cursor-pointer pointer-events-auto"
                    onClick={(e) => { e.stopPropagation(); onViewProfile(creator.id); }}
                >
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <p className="font-bold text-lg">{creator.name}</p>
                    </div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10">
                    {`لدى ${creator.name} ${formatNumber(creator.followers)} متابع`}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900/80"></div>
                </div>
            </div>
            
            {currentUser.id !== creator.id && (
                <div className="mr-auto flex items-center space-x-2 space-x-reverse pointer-events-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFollow(creator.id); }}
                        onMouseEnter={() => setIsHoveringFollow(true)}
                        onMouseLeave={() => setIsHoveringFollow(false)}
                        className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
                          isFollowing
                            ? (isHoveringFollow
                              ? 'bg-red-600/90 text-white border border-red-500'
                              : 'bg-slate-600 text-white')
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isFollowing ? (isHoveringFollow ? 'إلغاء المتابعة' : 'تتابعه') : 'متابعة'}
                    </button>
                </div>
            )}
          </div>
          <h3 className="font-semibold text-xl mb-1">{video.title}</h3>
          <p className="text-slate-300 text-sm">{video.description}</p>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 p-4 flex flex-col items-center space-y-4">
          <button onClick={(e) => { e.stopPropagation(); onLikeVideo(video.id); }} className="flex flex-col items-center text-white transition duration-200">
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-sm ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}>
              <HeartIcon className="w-8 h-8" filled={isLiked} />
            </div>
            <span className="text-sm font-bold mt-1">{formatNumber(video.likes.length)}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCommentsVisible(!commentsVisible); }} className="flex flex-col items-center text-white transition duration-200 hover:text-indigo-300">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm">
                <CommentIcon className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold mt-1">{formatNumber(video.comments.length)}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onShareVideo(video.id, video.title, video.description); }} className="flex flex-col items-center text-white transition duration-200 hover:text-green-500">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm">
                <ShareIcon className="w-8 h-8" />
            </div>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {commentsVisible && (
        <div className="p-4 bg-slate-800 border-t border-slate-700">
            {video.comments.length > 0 ? (
                <div className="mb-4 max-h-48 overflow-y-auto pr-2">
                    {video.comments
                      .slice(0, showAllComments ? video.comments.length : 3)
                      .map(comment => {
                      const commentAuthor = getCommentAuthor(comment.authorId);
                      return (
                        <div key={comment.id} className="flex items-start space-x-3 space-x-reverse mb-3">
                          <img src={commentAuthor?.avatar} alt={commentAuthor?.name} className="w-8 h-8 rounded-full object-cover mt-1 cursor-pointer" onClick={() => onViewProfile(commentAuthor?.id || 0)}/>
                          <div className="flex-1 bg-slate-700 rounded-lg p-2">
                            <p className="font-semibold text-white text-sm cursor-pointer" onClick={() => onViewProfile(commentAuthor?.id || 0)}>{commentAuthor?.name}</p>
                            <p className="text-slate-300 text-sm">{comment.text}</p>
                          </div>
                        </div>
                      )
                    })}
                    {video.comments.length > 3 && !showAllComments && (
                        <button 
                            onClick={() => setShowAllComments(true)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold mt-2"
                        >
                            عرض المزيد من التعليقات ({video.comments.length - 3} المزيد)
                        </button>
                    )}
                </div>
            ) : <p className="text-center text-slate-400 mb-4">كن أول من يعلق!</p>}

            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3 space-x-reverse">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="أضف تعليقاً..."
              />
            </form>
        </div>
      )}
    </div>
  );
};

export default VideoCard;