import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  TrendingUp, 
  Hash,
  Send,
  Code,
  HelpCircle,
  Calendar,
  Briefcase,
  Filter,
  Bookmark,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  BarChart3,
  Image as ImageIcon,
  Link2,
  Smile,
  Bell,
  Zap,
  Users,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Flag
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type PostTag = 'project' | 'question' | 'event' | 'career' | 'poll' | 'discussion' | 'announcement';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Comment {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
}

interface Post {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  tag: PostTag;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
  bookmarked?: boolean;
  pollOptions?: PollOption[];
  userVote?: string;
  views?: number;
  shares?: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  attachments?: string[];
  commentsList?: Comment[];
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'D. Marc',
    handle: '@marc_0x',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    tag: 'project',
    title: 'Built a lightweight threat classifier',
    content: 'Uses a tiny transformer + Suricata logs. Works on a Raspberry Pi 4 with 90% accuracy. Planning to open source next week!\n\nTech stack: Python, TensorFlow Lite, Suricata.',
    likes: 47,
    comments: 12,
    views: 234,
    shares: 5,
    timestamp: '2h ago',
    isVerified: true,
    isFollowing: false,
  },
  {
    id: 2,
    author: 'L. Kira',
    handle: '@kira_ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tag: 'question',
    title: 'Best resources for OSWE prep?',
    content: 'Looking for labs and note templates. Already have PortSwigger labs and Web Security Academy. What else should I focus on?\n\nAny advice from those who passed recently?',
    likes: 23,
    comments: 18,
    views: 156,
    shares: 2,
    timestamp: '4h ago',
    isFollowing: true,
  },
  {
    id: 3,
    author: 'M. Theo',
    handle: '@theo_root',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    tag: 'event',
    title: 'Workshop: Intro to Binary Exploitation',
    content: 'This Saturday at 15:00 UTC. We\'ll cover stack overflows, ret2libc, and basic ROP chains. Bring your VM!\n\nPrerequisites: Basic C knowledge, Linux familiarity.',
    likes: 89,
    comments: 34,
    views: 567,
    shares: 12,
    timestamp: '6h ago',
    isVerified: true,
  },
  {
    id: 4,
    author: 'S. Joon',
    handle: '@joon_pwn',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    tag: 'career',
    title: 'Security Engineer @ TechCorp - Referral?',
    content: 'My team is hiring for a junior security engineer position. Looking for someone with CTF experience and basic web app security knowledge.\n\nDM me if interested!',
    likes: 156,
    comments: 42,
    views: 892,
    shares: 23,
    timestamp: '8h ago',
    isFollowing: false,
  },
  {
    id: 5,
    author: 'CyberSec Weekly',
    handle: '@cs_weekly',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    tag: 'poll',
    title: 'What is your primary focus for 2024?',
    content: 'Cast your vote! Let\'s see what the community is prioritizing.',
    likes: 342,
    comments: 56,
    views: 1203,
    shares: 45,
    timestamp: '1d ago',
    isVerified: true,
    pollOptions: [
      { id: '1', text: 'Cloud Security', votes: 45 },
      { id: '2', text: 'AI/ML Security', votes: 82 },
      { id: '3', text: 'Binary Exploitation', votes: 23 },
      { id: '4', text: 'Web3/Blockchain', votes: 15 },
    ]
  },
  {
    id: 6,
    author: 'A. Rhea',
    handle: '@rhea_sec',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tag: 'discussion',
    title: 'The future of AI in cybersecurity',
    content: 'With the rapid advancement of LLMs, how do you think defensive security will evolve? Will AI replace SOC analysts or augment them?\n\nShare your thoughts below! 👇',
    likes: 78,
    comments: 45,
    views: 445,
    shares: 8,
    timestamp: '3h ago',
    isFollowing: true,
  },
  {
    id: 7,
    author: 'System',
    handle: '@cyberverse',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80',
    tag: 'announcement',
    title: 'New CTF Platform Launch',
    content: 'We\'re excited to announce our new CTF practice platform with over 500 challenges! Premium members get early access starting today.\n\nCheck it out and let us know what you think!',
    likes: 234,
    comments: 67,
    views: 1567,
    shares: 89,
    timestamp: '30m ago',
    isVerified: true,
  }
];

const trendingTags = ['#ctf', '#ai-security', '#writeups', '#career', '#beginners', '#mentorship', '#bugbounty', '#redteam'];

const topContributors = [
  { name: 'A. Rhea', points: 3200, status: 'online' },
  { name: 'M. Theo', points: 3500, status: 'online' },
  { name: 'D. Marc', points: 2800, status: 'offline' },
  { name: 'L. Kira', points: 2650, status: 'online' },
];

const tagConfig = {
  project: { icon: Code, color: 'text-blue-400 border-blue-400/50 bg-blue-400/10', label: 'Project' },
  question: { icon: HelpCircle, color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10', label: 'Question' },
  event: { icon: Calendar, color: 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10', label: 'Event' },
  career: { icon: Briefcase, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10', label: 'Career' },
  poll: { icon: BarChart3, color: 'text-pink-400 border-pink-400/50 bg-pink-400/10', label: 'Poll' },
  discussion: { icon: MessageSquare, color: 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10', label: 'Discussion' },
  announcement: { icon: Bell, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10', label: 'Announcement' },
};

export default function FeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  
  // State Management
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [newPostTag, setNewPostTag] = useState<PostTag>('discussion');
  const [activeFilter, setActiveFilter] = useState<PostTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'top' | 'trending'>('newest');
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'M. Theo liked your post', time: '5m ago', read: false },
    { id: 2, text: 'New follower: @sec_guru', time: '1h ago', read: false },
    { id: 3, text: 'Your poll received 10 votes', time: '2h ago', read: true },
  ]);

  // Derived State
  const filteredPosts = posts
    .filter(post => activeFilter === 'all' || post.tag === activeFilter)
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'top') return b.likes - a.likes;
      if (sortBy === 'trending') return (b.views || 0) - (a.views || 0);
      return b.id - a.id;
    });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Animations (Preserved exactly as original)
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const postsContainer = postsRef.current;

    if (!section || !title || !postsContainer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4,
          },
        }
      );

      const postCards = postsContainer.querySelectorAll('.post-card');
      postCards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 0.4,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [posts, activeFilter, sortBy]);

  // Handlers
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleFollow = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) return { ...post, isFollowing: !post.isFollowing };
      return post;
    }));
    setShowDropdown(null);
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) return { ...post, bookmarked: !post.bookmarked };
      return post;
    }));
    setShowDropdown(null);
  };

  const handleVote = (postId: number, optionId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.pollOptions) {
        const newOptions = post.pollOptions.map(opt => {
          if (post.userVote === opt.id) return { ...opt, votes: opt.votes - 1 };
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          return opt;
        });
        return { ...post, pollOptions: newOptions, userVote: optionId };
      }
      return post;
    }));
  };

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(`Check out this post: ${post.title}`);
    alert('Link copied to clipboard!');
    setShowDropdown(null);
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now(),
      author: 'You',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      tag: newPostTag,
      title: newPost.split('\n')[0].slice(0, 50),
      content: newPost,
      likes: 0,
      comments: 0,
      views: 0,
      shares: 0,
      timestamp: 'Just now',
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      author: 'You',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      content: commentText,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...(post.commentsList || []), newComment]
        };
      }
      return post;
    }));
    setCommentText('');
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Simulate new posts notification
  useEffect(() => {
    const timer = setTimeout(() => setHasNewPosts(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const loadNewPosts = () => {
    setHasNewPosts(false);
  };

  return (
    <section
      ref={sectionRef}
      id="feed"
      className="relative py-20 lg:py-32 bg-[#050507]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Title with Notifications */}
        <div ref={titleRef} className="mb-12 flex items-start justify-between">
          <div>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4 tracking-wider">
              COMMUNITY FEED
            </h2>
            <p className="font-mono text-[#A6A9B6] max-w-2xl">
              Share projects, ask questions, and connect with fellow security enthusiasts.
            </p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsRead();
              }}
              className="relative p-2 border border-[#39FF14]/30 rounded-lg hover:border-[#39FF14] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#39FF14]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg shadow-xl z-50 py-2">
                <div className="px-4 py-2 border-b border-[#39FF14]/20 font-orbitron font-bold text-white">
                  Notifications
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-[#39FF14]/10 font-mono text-sm ${n.read ? 'text-[#A6A9B6]' : 'text-white bg-[#39FF14]/5'}`}>
                    <p>{n.text}</p>
                    <span className="text-xs text-[#A6A9B6]">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="cyber-card corner-brackets rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 bg-[#0B0E14]/95 backdrop-blur-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39FF14]" />
                <input 
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050507] border border-[#39FF14]/30 rounded-lg pl-10 pr-4 py-2 font-mono text-sm text-white focus:border-[#39FF14] focus:outline-none"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded font-mono text-xs border transition-colors whitespace-nowrap ${
                    activeFilter === 'all' ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]'
                  }`}
                >
                  All
                </button>
                {Object.entries(tagConfig).map(([tag, config]) => (
                  <button 
                    key={tag}
                    onClick={() => setActiveFilter(tag as PostTag)}
                    className={`px-3 py-1.5 rounded font-mono text-xs border transition-colors whitespace-nowrap ${
                      activeFilter === tag ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setSortBy(sortBy === 'newest' ? 'top' : sortBy === 'top' ? 'trending' : 'newest')}
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#39FF14]/30 rounded font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14] transition-colors"
                >
                  <Filter className="w-3 h-3" />
                  {sortBy === 'newest' ? 'Newest' : sortBy === 'top' ? 'Top Rated' : 'Trending'}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* New Posts Notification */}
            {hasNewPosts && (
              <div 
                onClick={loadNewPosts}
                className="cursor-pointer bg-[#39FF14]/10 border border-[#39FF14] rounded-lg p-3 text-center font-mono text-sm text-[#39FF14] animate-pulse flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New posts available. Click to refresh.
              </div>
            )}

            {/* New post input with enhanced options */}
            <div className="cyber-card corner-brackets rounded-lg p-4">
              <div className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30"
                />
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value as PostTag)}
                      className="bg-[#0B0E14] border border-[#39FF14]/30 rounded px-2 py-1 font-mono text-xs text-[#39FF14] focus:outline-none"
                    >
                      {Object.entries(tagConfig).map(([tag, config]) => (
                        <option key={tag} value={tag}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg p-3 font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input resize-none focus:border-[#39FF14] focus:outline-none transition-colors"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                      <button className="p-2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                        <Link2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#A6A9B6]">{newPost.length}/500</span>
                      <button
                        onClick={handleSubmitPost}
                        disabled={!newPost.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div ref={postsRef} className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 font-mono text-[#A6A9B6]">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#39FF14]/50" />
                  No posts found matching your criteria.
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const TagIcon = tagConfig[post.tag].icon;
                  const tagStyle = tagConfig[post.tag].color;
                  const totalVotes = post.pollOptions?.reduce((acc, curr) => acc + curr.votes, 0) || 0;
                  const isExpanded = expandedPost === post.id;
                  
                  return (
                    <div
                      key={post.id}
                      className="post-card cyber-card corner-brackets rounded-lg p-5 hover:border-[#39FF14] transition-colors relative group"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={post.avatar}
                              alt={post.author}
                              className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30"
                              style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
                            />
                            {post.isVerified && (
                              <CheckCircle2 className="absolute -bottom-1 -right-1 w-4 h-4 text-[#39FF14] bg-[#050507] rounded-full" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-orbitron font-bold text-white">{post.author}</span>
                              {post.isFollowing && (
                                <span className="px-1.5 py-0.5 bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-mono rounded">Following</span>
                              )}
                            </div>
                            <span className="font-mono text-sm text-[#A6A9B6]">{post.handle}</span>
                            <span className="font-mono text-xs text-[#A6A9B6] ml-2">• {post.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono ${tagStyle}`}>
                            <TagIcon className="w-3 h-3" />
                            {tagConfig[post.tag].label}
                          </span>
                          
                          {/* Dropdown Menu */}
                          <div className="relative">
                            <button 
                              onClick={() => setShowDropdown(showDropdown === post.id ? null : post.id)}
                              className="text-[#A6A9B6] hover:text-[#39FF14] p-1"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            
                            {showDropdown === post.id && (
                              <div className="absolute right-0 top-8 w-48 bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg shadow-xl z-10 py-1 font-mono text-sm">
                                <button 
                                  onClick={() => handleFollow(post.id)}
                                  className="w-full text-left px-4 py-2 text-[#A6A9B6] hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2"
                                >
                                  <Users className="w-4 h-4" />
                                  {post.isFollowing ? 'Unfollow' : 'Follow'} {post.author}
                                </button>
                                <button 
                                  onClick={() => handleBookmark(post.id)}
                                  className="w-full text-left px-4 py-2 text-[#A6A9B6] hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2"
                                >
                                  <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-[#39FF14] text-[#39FF14]' : ''}`} />
                                  {post.bookmarked ? 'Bookmarked' : 'Bookmark'}
                                </button>
                                <button 
                                  onClick={() => handleShare(post)}
                                  className="w-full text-left px-4 py-2 text-[#A6A9B6] hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Copy Link
                                </button>
                                <div className="border-t border-[#39FF14]/20 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 flex items-center gap-2">
                                  <Flag className="w-4 h-4" />
                                  Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-orbitron font-bold text-lg text-white mb-2 hover:text-[#39FF14] cursor-pointer transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-mono text-sm text-[#A6A9B6] whitespace-pre-line mb-4">
                        {post.content}
                      </p>

                      {/* Poll Rendering */}
                      {post.tag === 'poll' && post.pollOptions && (
                        <div className="mb-4 space-y-2">
                          {post.pollOptions.map((option) => {
                            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                            const isVoted = post.userVote === option.id;
                            
                            return (
                              <div 
                                key={option.id}
                                onClick={() => !post.userVote && handleVote(post.id, option.id)}
                                className={`relative overflow-hidden border rounded p-3 cursor-pointer transition-all ${
                                  isVoted 
                                    ? 'border-[#39FF14] bg-[#39FF14]/10' 
                                    : 'border-[#39FF14]/30 hover:border-[#39FF14]/60 bg-[#050507]'
                                } ${post.userVote ? 'cursor-default' : ''}`}
                              >
                                <div 
                                  className="absolute left-0 top-0 h-full bg-[#39FF14]/20 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                                <div className="relative flex justify-between items-center z-10">
                                  <span className="font-mono text-sm text-white flex items-center gap-2">
                                    {isVoted && <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />}
                                    {option.text}
                                  </span>
                                  <span className="font-mono text-xs text-[#A6A9B6]">
                                    {percentage}% ({option.votes})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <p className="font-mono text-xs text-[#A6A9B6] mt-2">
                            {totalVotes.toLocaleString()} votes • {post.userVote ? 'You voted' : 'Click to vote'}
                          </p>
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4 mb-4 py-2 border-y border-[#39FF14]/10 text-xs font-mono text-[#A6A9B6]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views?.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {post.shares} shares
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.timestamp}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 font-mono text-sm transition-colors ${
                              post.liked ? 'text-red-400' : 'text-[#A6A9B6] hover:text-red-400'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </button>
                          <button 
                            onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                            className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                          <button 
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {post.bookmarked && (
                            <Bookmark className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />
                          )}
                          {post.likes > 50 && (
                            <Zap className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Comments Section */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#39FF14]/20 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-3 mb-4">
                            {post.commentsList?.map((comment) => (
                              <div key={comment.id} className="flex gap-3 p-3 bg-[#050507] rounded-lg">
                                <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-sm text-white font-bold">{comment.author}</span>
                                    <span className="font-mono text-xs text-[#A6A9B6]">{comment.timestamp}</span>
                                  </div>
                                  <p className="font-mono text-sm text-[#A6A9B6]">{comment.content}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <button className="flex items-center gap-1 text-xs text-[#A6A9B6] hover:text-[#39FF14]">
                                      <ThumbsUp className="w-3 h-3" />
                                      {comment.likes}
                                    </button>
                                    <button className="text-xs text-[#A6A9B6] hover:text-[#39FF14]">Reply</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add Comment */}
                          <div className="flex gap-3">
                            <img 
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
                              alt="You" 
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-[#050507] border border-[#39FF14]/30 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-[#39FF14] focus:outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!commentText.trim()}
                                className="px-3 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded text-[#39FF14] hover:bg-[#39FF14]/30 disabled:opacity-50"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              
              {/* Load More */}
              <div className="flex justify-center">
                <button className="px-6 py-3 border border-[#39FF14]/30 rounded-lg font-mono text-sm text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Load More Posts
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div className="cyber-card corner-brackets rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Trending Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#0B0E14] border border-[#39FF14]/30 rounded-full font-mono text-sm text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-colors"
                  >
                    <Hash className="w-3 h-3" />
                    {tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="cyber-card corner-brackets rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div
                    key={contributor.name}
                    className="flex items-center justify-between p-2 bg-[#0B0E14] rounded-lg hover:bg-[#39FF14]/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron font-bold text-[#39FF14]">#{index + 1}</span>
                      <div>
                        <span className="font-mono text-white block">{contributor.name}</span>
                        <span className={`text-[10px] font-mono ${contributor.status === 'online' ? 'text-[#39FF14]' : 'text-[#A6A9B6]'}`}>
                          ● {contributor.status}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-[#A6A9B6]">{contributor.points.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="cyber-card corner-brackets rounded-lg p-5">
              <h3 className="font-orbitron font-bold text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-[#A6A9B6]">Total Posts</span>
                  <span className="font-orbitron text-[#39FF14]">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-[#A6A9B6]">This Week</span>
                  <span className="font-orbitron text-[#39FF14]">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-[#A6A9B6]">Active Now</span>
                  <span className="font-orbitron text-[#39FF14] flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
                    156
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bookmarked Mini-List */}
            <div className="cyber-card corner-brackets rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Saved</h3>
              </div>
              {posts.filter(p => p.bookmarked).length === 0 ? (
                <p className="font-mono text-xs text-[#A6A9B6]">No saved posts yet.</p>
              ) : (
                <div className="space-y-2">
                  {posts.filter(p => p.bookmarked).slice(0, 3).map(p => (
                    <div key={p.id} className="text-sm font-mono text-[#A6A9B6] truncate border-l-2 border-[#39FF14] pl-2 hover:text-[#39FF14] cursor-pointer">
                      {p.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="cyber-card corner-brackets rounded-lg p-5">
              <h3 className="font-orbitron font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#39FF14]/10 text-[#A6A9B6] hover:text-[#39FF14] transition-colors font-mono text-sm">
                  <Code className="w-4 h-4" />
                  Start a Project
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#39FF14]/10 text-[#A6A9B6] hover:text-[#39FF14] transition-colors font-mono text-sm">
                  <HelpCircle className="w-4 h-4" />
                  Ask a Question
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#39FF14]/10 text-[#A6A9B6] hover:text-[#39FF14] transition-colors font-mono text-sm">
                  <Calendar className="w-4 h-4" />
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}