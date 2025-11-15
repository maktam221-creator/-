import React, { useState, useEffect } from 'react';
import { Post, User, Comment, Notification, Video } from './types';
import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import VideosFeed from './components/VideosFeed';
import { EyeIcon } from './components/icons';

const MOCK_USERS: User[] = [
  { id: 1, name: 'علياء سالم', avatar: 'https://picsum.photos/seed/user1/200', bio: 'مصورة فوتوغرافية ومحبة للقهوة.', followers: 1200, following: 340, profession: 'مصورة', country: 'الإمارات', qualification: 'بكالوريوس فنون', gender: 'أنثى', profileViews: 2500 },
  { id: 2, name: 'خالد الأحمد', avatar: 'https://picsum.photos/seed/user2/200', bio: 'مطور برمجيات وكاتب تقني.', followers: 850, following: 150, profession: 'مهندس برمجيات', country: 'السعودية', qualification: 'ماجستير علوم الحاسب', gender: 'ذكر', profileViews: 1800 },
  { id: 3, name: 'نورة عبدالله', avatar: 'https://picsum.photos/seed/user3/200', bio: 'فنانة تشكيلية، أعشق الألوان والطبيعة.', followers: 2500, following: 500, profession: 'فنانة', country: 'الكويت', qualification: 'دبلوم فنون تشكيلية', gender: 'أنثى', profileViews: 5300 },
  { id: 4, name: 'سلطان فهد', avatar: 'https://picsum.photos/seed/user4/200', bio: 'رياضي ومدرب لياقة بدنية.', followers: 5000, following: 80, profession: 'مدرب لياقة', country: 'قطر', qualification: 'شهادة تدريب دولية', gender: 'ذكر', profileViews: 12000 },
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
  { id: 1, creatorId: 4, title: 'أفضل 5 تمارين صباحية', description: 'ابدأ يومك بنشاط مع هذه التمارين السريعة.', thumbnail: 'https://picsum.photos/seed/vid1/540/960', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', views: 15000, likes: [1, 2, 3], comments: [{ id: 1, text: 'رائع!', authorId: 1, timestamp: new Date().toISOString() }], timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, creatorId: 1, title: 'درس تصوير سريع', description: 'كيف تلتقط صور بورتريه احترافية بهاتفك.', thumbnail: 'https://picsum.photos/seed/vid2/540/960', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', views: 8000, likes: [2, 3], comments: [], timestamp: new Date(Date.now() - 172800000).toISOString() },
];


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [currentUser] = useState<User>(users[3]); // Sultan is current user
    const [followingIds, setFollowingIds] = useState([1, 3]); // Sultan follows Alia and Noura
    const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'videos'>('feed');
    const [profileUserId, setProfileUserId] = useState<number | null>(null);

    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
    
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ message: '', show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string) => {
        setToast({ message, show: true });
    };

    const handleNavigate = (view: 'feed' | 'profile' | 'videos', userId?: number) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
        if (view === 'profile' && userId) {
            setProfileUserId(userId);
        }
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
        setPosts(prev => [newPost, ...prev]);
        showToast('تم نشر منشورك بنجاح!');
    };

    const handleLikePost = (postId: number) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(currentUser.id);
                const likes = isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id];
                return { ...p, likes };
            }
            return p;
        }));
    };
    
    const handleAddComment = (postId: number, text: string) => {
        const newComment: Comment = {
            id: Date.now(), text, authorId: currentUser.id, timestamp: new Date().toISOString(),
        };
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    };

    const handleUpdateProfile = (userId: number, newProfileData: Partial<User>) => {
        setUsers(users.map(u => u.id === userId ? { ...u, ...newProfileData } : u));
        showToast('تم تحديث ملفك الشخصي بنجاح!');
    };

    const handleSharePost = (postId: number, postContent: string) => {
        navigator.clipboard.writeText(`تحقق من هذا المنشور: "${postContent}"`);
        showToast('تم نسخ رابط المنشور!');
    };

    const handleToggleFollow = (userId: number) => {
        setFollowingIds(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleLikeVideo = (videoId: number) => {
        setVideos(videos.map(v => {
            if (v.id === videoId) {
                const isLiked = v.likes.includes(currentUser.id);
                const likes = isLiked ? v.likes.filter(id => id !== currentUser.id) : [...v.likes, currentUser.id];
                return { ...v, likes };
            }
            return v;
        }));
    };
    
    const handleAddVideoComment = (videoId: number, text: string) => {
        const newComment: Comment = {
            id: Date.now(), text, authorId: currentUser.id, timestamp: new Date().toISOString(),
        };
        setVideos(videos.map(v => v.id === videoId ? { ...v, comments: [...v.comments, newComment] } : v));
    };
    
    const handleDeleteVideo = (videoId: number) => {
        setVideos(prev => prev.filter(v => v.id !== videoId));
        showToast('تم حذف الفيديو بنجاح.');
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'profile':
                const user = users.find(u => u.id === profileUserId);
                if (!user) return <Feed posts={posts} users={users} currentUser={currentUser} onCreatePost={handleCreatePost} onLikePost={handleLikePost} onAddComment={handleAddComment} onViewProfile={(id) => handleNavigate('profile', id)} onSharePost={handleSharePost}/>;
                return <Profile user={user} posts={posts} currentUser={currentUser} users={users} isFollowing={followingIds.includes(user.id)} onLikePost={handleLikePost} onAddComment={handleAddComment} onViewProfile={(id) => handleNavigate('profile', id)} onUpdateProfile={handleUpdateProfile} onSharePost={handleSharePost} onToggleFollow={handleToggleFollow} />;
            case 'videos':
                return <VideosFeed videos={videos} users={users} currentUser={currentUser} following={followingIds} onLikeVideo={handleLikeVideo} onAddVideoComment={handleAddVideoComment} onToggleFollow={handleToggleFollow} onViewProfile={(id) => handleNavigate('profile', id)} onShareVideo={(id, title) => showToast(`تم نسخ رابط فيديو: ${title}`)} onDeleteVideo={handleDeleteVideo} />
            case 'feed':
            default:
                return <Feed posts={posts} users={users} currentUser={currentUser} onCreatePost={handleCreatePost} onLikePost={handleLikePost} onAddComment={handleAddComment} onViewProfile={(id) => handleNavigate('profile', id)} onSharePost={handleSharePost}/>;
        }
    };
    
    // Sidebars
    const ProfileCardSidebar = () => (
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
            <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-700 mb-3 cursor-pointer"
                onClick={() => handleNavigate('profile', currentUser.id)}
            />
            <h3 
                className="font-bold text-xl text-white cursor-pointer"
                onClick={() => handleNavigate('profile', currentUser.id)}
            >{currentUser.name}</h3>
            <p className="text-sm text-slate-400 text-center">{currentUser.profession || 'مستخدم جديد'}</p>
        </div>
        <div className="border-t border-slate-700 my-4"></div>
        <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-2 space-x-reverse">
                <EyeIcon className="w-5 h-5 text-indigo-400"/>
                <span>مشاهدات ملفك</span>
            </div>
            <span className="font-bold text-indigo-400">{currentUser.profileViews?.toLocaleString('ar-EG')}</span>
        </div>
      </div>
    );
    
    const SuggestionsSidebar = () => {
        const suggestedUsers = users.filter(u => u.id !== currentUser.id && !followingIds.includes(u.id)).slice(0, 3);
        if (suggestedUsers.length === 0) return null;
        return (
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg text-white mb-4">اقتراحات للمتابعة</h3>
                <div className="space-y-4">
                    {suggestedUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                    onClick={() => handleNavigate('profile', user.id)}
                                />
                                <div>
                                    <p 
                                        className="font-semibold text-white cursor-pointer"
                                        onClick={() => handleNavigate('profile', user.id)}
                                    >{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.profession || ''}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggleFollow(user.id)}
                                className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition"
                            >
                                متابعة
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const FollowingSidebar = () => {
        const followedUsers = users.filter(u => followingIds.includes(u.id));
        if (followedUsers.length === 0) return null;
        return (
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg text-white mb-4">تتابعهم</h3>
                <div className="space-y-4">
                    {followedUsers.map(user => (
                        <div key={user.id} className="flex items-center space-x-3 space-x-reverse">
                           <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                onClick={() => handleNavigate('profile', user.id)}
                            />
                            <div>
                                <p 
                                    className="font-semibold text-white cursor-pointer"
                                    onClick={() => handleNavigate('profile', user.id)}
                                >{user.name}</p>
                                <p className="text-xs text-slate-400">{user.profession || ''}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header
        currentUser={currentUser}
        onNavigate={handleNavigate}
        notifications={notifications}
        users={users}
        onMarkAsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))}
        onShowToast={showToast}
      />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar - Profile & Suggestions */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <ProfileCardSidebar />
            <SuggestionsSidebar />
          </div>
        </aside>

        <main className="lg:col-span-6">
          {renderContent()}
        </main>
        
        {/* Right Sidebar - Following */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <FollowingSidebar />
          </div>
        </aside>

      </div>
        
      {/* Toast Notification */}
      {toast.show && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-30 animate-bounce">
              {toast.message}
          </div>
      )}
    </div>
    );
};

export default App;
