import React, { useState } from 'react';
import { Post, User, Comment, Notification } from './types';
import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';

const MOCK_USERS: User[] = [
  { id: 1, name: 'علياء سالم', avatar: 'https://picsum.photos/seed/user1/200', bio: 'مصورة فوتوغرافية ومحبة للقهوة.', followers: 1200, following: 340 },
  { id: 2, name: 'خالد الأحمد', avatar: 'https://picsum.photos/seed/user2/200', bio: 'مطور برمجيات وكاتب تقني.', followers: 850, following: 150 },
  { id: 3, name: 'نورة عبدالله', avatar: 'https://picsum.photos/seed/user3/200', bio: 'فنانة تشكيلية، أعشق الألوان والطبيعة.', followers: 2500, following: 500 },
  { id: 4, name: 'سلطان فهد', avatar: 'https://picsum.photos/seed/user4/200', bio: 'رياضي ومدرب لياقة بدنية.', followers: 5000, following: 80 },
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


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [view, setView] = useState<'feed' | 'profile'>('feed');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigate = (newView: 'feed' | 'profile', userId?: number) => {
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
    let targetPost: Post | undefined;
    const isAlreadyLiked = posts.find(p => p.id === postId)?.likes.includes(currentUser.id);

    setPosts(posts.map(post => {
      if (post.id === postId) {
        targetPost = post;
        if (isAlreadyLiked) {
          return { ...post, likes: post.likes.filter(id => id !== currentUser.id) };
        } else {
          return { ...post, likes: [...post.likes, currentUser.id] };
        }
      }
      return post;
    }));

    if (targetPost && !isAlreadyLiked && targetPost.authorId !== currentUser.id) {
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

  const handleMarkNotificationsAsRead = () => {
    setTimeout(() => {
        setNotifications(
          notifications.map(n => (n.read ? n : { ...n, read: true }))
        );
    }, 500);
  };

  const handleUpdateProfile = (userId: number, newBio: string, newAvatar: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, bio: newBio, avatar: newAvatar };
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
      </main>
    </div>
  );
};

export default App;
