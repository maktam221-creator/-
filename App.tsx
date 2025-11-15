import React, { useState } from 'react';
import { Post, User, Comment, Notification, Video } from './types';
import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import VideosFeed from './components/VideosFeed';

const MOCK_USERS: User[] = [
  { id: 1, name: 'علياء سالم', avatar: 'https://picsum.photos/seed/user1/200', bio: 'مصورة فوتوغرافية ومحبة للقهوة.', followers: 1200, following: 340, profession: 'مصورة', country: 'الإمارات', qualification: 'بكالوريوس فنون', gender: 'أنثى' },
  { id: 2, name: 'خالد الأحمد', avatar: 'https://picsum.photos/seed/user2/200', bio: 'مطور برمجيات وكاتب تقني.', followers: 850, following: 150, profession: 'مهندس برمجيات', country: 'السعودية', qualification: 'ماجستير علوم الحاسب', gender: 'ذكر' },
  { id: 3, name: 'نورة عبدالله', avatar: 'https://picsum.photos/seed/user3/200', bio: 'فنانة تشكيلية، أعشق الألوان والطبيعة.', followers: 2500, following: 500, profession: 'فنانة', country: 'الكويت', qualification: 'دبلوم فنون تشكيلية', gender: 'أنثى' },
  { id: 4, name: 'سلطان فهد', avatar: 'https://picsum.photos/seed/user4/200', bio: 'رياضي ومدرب لياقة بدنية.', followers: 5000, following: 80, profession: 'مدرب لياقة', country: 'قطر', qualification: 'شهادة تدريب دولية', gender: 'ذكر' },
];

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    authorId: 1,
    content: 'غروب الشمس اليوم كان ساحراً. لا توجد كلمات تصف هذا الجمال.',
    image: 'https://picsum.photos/seed/post1/800/600',
    likes: [2, 3, 4],
    comments: [
      { id: 1, text: 'صورة رائعة!', authorId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 2, text: 'أتفق، منظر خلاب.', authorId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 2,
    authorId: 2,
    content: 'أعمل على مشروع جديد ومثير! سأشارك المزيد من التفاصيل قريباً.',
    likes: [1, 4],
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    authorId: 3,
    content: 'لوحتي الجديدة "ألوان الفجر". استلهمتها من شروق الشمس هذا الصباح.',
    image: 'https://picsum.photos/seed/post3/800/600',
    likes: [1, 2, 4],
    comments: [
        { id: 3, text: 'مبدعة كعادتك!', authorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
    {
    id: 4,
    authorId: 1,
    content: 'استكشاف شوارع المدينة القديمة. كل زاوية تحكي قصة.',
    image: 'https://picsum.photos/seed/post4/800/600',
    likes: [2, 3],
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'comment', actorId: 2, postId: 1, postAuthorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: true },
    { id: 2, type: 'like', actorId: 3, postId: 1, postAuthorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), read: true },
    { id: 3, type: 'like', actorId: 4, postId: 1, postAuthorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: false },
];

const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    creatorId: 4,
    title: 'تحدي اللياقة اليومي',
    description: 'انضموا إلي في تمرين سريع وفعال لحرق الدهون وزيادة القوة. لا تحتاجون أي معدات!',
    thumbnail: 'https://picsum.photos/seed/video1/400/700',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    views: 15000,
    likes: [1, 2, 3],
    comments: [
      { id: 101, text: 'تمرين رائع!', authorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
      { id: 102, text: 'شكراً لك يا كابتن!', authorId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: 103, text: 'مفيد جداً!', authorId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { id: 104, text: 'أحتاج هذا التمرين كل يوم.', authorId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 105, text: 'استمر يا بطل!', authorId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 2,
    creatorId: 3,
    title: 'خمس دقائق من السحر بالألوان المائية',
    description: 'شاهدوا كيف يمكن تحويل صفحة بيضاء إلى لوحة فنية جميلة في دقائق معدودة.',
    thumbnail: 'https://picsum.photos/seed/video2/400/700',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    views: 8200,
    likes: [1, 4],
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [view, setView] = useState<'feed' | 'profile' | 'videos'>('feed');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [following, setFollowing] = useState<number[]>([2, 4]); // Current user follows user 2 and 4

  const handleNavigate = (newView: 'feed' | 'profile' | 'videos', userId?: number) => {
    setView(newView);
    setSelectedUserId(userId || null);
    window.scrollTo(0, 0);
  };
  
  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now(),
      authorId: currentUser.id,
      content,
      image,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLikePost = (postId: number) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const isAlreadyLiked = targetPost.likes.includes(currentUser.id);

    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (isAlreadyLiked) {
          return { ...post, likes: post.likes.filter(id => id !== currentUser.id) };
        } else {
          return { ...post, likes: [...post.likes, currentUser.id] };
        }
      }
      return post;
    }));

    if (!isAlreadyLiked && targetPost.authorId !== currentUser.id) {
        const newNotification: Notification = {
            id: Date.now(),
            type: 'like',
            actorId: currentUser.id,
            postId: targetPost.id,
            postAuthorId: targetPost.authorId,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleAddComment = (postId: number, text: string) => {
    const newComment: Comment = {
      id: Date.now(),
      text,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
    };
    
    let targetPost: Post | undefined;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        targetPost = post;
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    if (targetPost && targetPost.authorId !== currentUser.id) {
        const newNotification: Notification = {
            id: Date.now(),
            type: 'comment',
            actorId: currentUser.id,
            postId: targetPost.id,
            postAuthorId: targetPost.authorId,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleSharePost = async (postId: number, postContent: string) => {
      const url = `${window.location.origin}/#post/${postId}`;
      const shareData = {
          title: 'منشور من تطبيقنا',
          text: postContent.substring(0, 100) + (postContent.length > 100 ? '...' : ''),
          url: url,
      };

      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              throw new Error('Web Share API not supported');
          }
      } catch (err) {
          navigator.clipboard.writeText(url).then(() => {
              showToast('تم نسخ الرابط!');
          }).catch(clipboardErr => {
              console.error('Failed to copy: ', clipboardErr);
              showToast('فشل نسخ الرابط.');
          });
      }
  };
  
  const handleShareVideo = async (videoId: number, videoTitle: string, videoDescription: string) => {
      const url = `${window.location.origin}/#video/${videoId}`;
      const shareData = {
          title: videoTitle,
          text: videoDescription.substring(0, 100) + (videoDescription.length > 100 ? '...' : ''),
          url: url,
      };

      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              throw new Error('Web Share API not supported');
          }
      } catch (err) {
          navigator.clipboard.writeText(url).then(() => {
              showToast('تم نسخ رابط الفيديو!');
          }).catch(clipboardErr => {
              console.error('Failed to copy: ', clipboardErr);
              showToast('فشل نسخ الرابط.');
          });
      }
  };

  const handleMarkNotificationsAsRead = () => {
    setTimeout(() => {
        setNotifications(
          notifications.map(n => (n.read ? n : { ...n, read: true }))
        );
    }, 500);
  };

  const handleUpdateProfile = (userId: number, newProfileData: Partial<User>) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, ...newProfileData };
      }
      return user;
    });
    setUsers(updatedUsers);

    if (currentUser.id === userId) {
      const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }
    }
  };

  const handleLikeVideo = (videoId: number) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        if (video.likes.includes(currentUser.id)) {
          return { ...video, likes: video.likes.filter(id => id !== currentUser.id) };
        } else {
          return { ...video, likes: [...video.likes, currentUser.id] };
        }
      }
      return video;
    }));
  };

  const handleAddVideoComment = (videoId: number, text: string) => {
    const newComment: Comment = {
      id: Date.now(),
      text,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
    };
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return { ...video, comments: [...video.comments, newComment] };
      }
      return video;
    }));
  };
  
  const handleToggleFollow = (creatorId: number) => {
    if (following.includes(creatorId)) {
      setFollowing(following.filter(id => id !== creatorId));
      showToast('تم إلغاء المتابعة.');
    } else {
      setFollowing([...following, creatorId]);
      showToast('تمت المتابعة بنجاح!');
    }
  };

  const handleDeleteVideo = (videoId: number) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
      showToast('تم حذف الفيديو بنجاح.');
    }
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        currentUser={currentUser} 
        onNavigate={handleNavigate}
        notifications={notifications.filter(n => n.postAuthorId === currentUser.id)}
        users={users}
        onMarkAsRead={handleMarkNotificationsAsRead}
      />
      <main className="max-w-2xl mx-auto px-4 pb-10">
        {toastMessage && (
          <div className="fixed top-20 right-1/2 translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg z-50 animate-bounce">
            {toastMessage}
          </div>
        )}
        {view === 'feed' && (
          <Feed 
            posts={posts} 
            users={users} 
            currentUser={currentUser} 
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onSharePost={handleSharePost}
          />
        )}
        {view === 'profile' && selectedUser && (
          <Profile 
            user={selectedUser} 
            posts={posts} 
            currentUser={currentUser}
            users={users}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onUpdateProfile={handleUpdateProfile}
            onSharePost={handleSharePost}
          />
        )}
        {view === 'videos' && (
          <VideosFeed 
            videos={videos}
            users={users}
            currentUser={currentUser}
            following={following}
            onLikeVideo={handleLikeVideo}
            onAddVideoComment={handleAddVideoComment}
            onToggleFollow={handleToggleFollow}
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onShareVideo={handleShareVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        )}
      </main>
    </div>
  );
};

export default App;
