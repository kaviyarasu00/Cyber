import { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Share2, Hash, Send,
  Code, HelpCircle, Calendar, Briefcase, Search, Bookmark,
  CheckCircle2, TrendingUp, Filter, Zap
} from 'lucide-react';

type PostTag = 'project' | 'question' | 'event' | 'career' | 'poll' | 'discussion';

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
  isVerified?: boolean;
}

const tagConfig = {
  project: { icon: Code, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', label: 'Project' },
  question: { icon: HelpCircle, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', label: 'Question' },
  event: { icon: Calendar, color: 'text-green-400 bg-green-400/10 border-green-400/30', label: 'Event' },
  career: { icon: Briefcase, color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', label: 'Career' },
  poll: { icon: TrendingUp, color: 'text-pink-400 bg-pink-400/10 border-pink-400/30', label: 'Poll' },
  discussion: { icon: MessageCircle, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30', label: 'Discussion' },
};

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'D. Marc',
    handle: '@marc_0x',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    tag: 'project',
    title: 'Built a lightweight threat classifier',
    content: 'Uses a tiny transformer + Suricata logs. Works on a Raspberry Pi 4 with 90% accuracy. Open source next week!',
    likes: 47,
    comments: 2,
    timestamp: '2h ago',
    isVerified: true,
  },
  {
    id: 2,
    author: 'L. Kira',
    handle: '@kira_ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tag: 'question',
    title: 'Best resources for OSWE prep?',
    content: 'Looking for labs beyond PortSwigger. Any advice from those who passed recently?',
    likes: 23,
    comments: 0,
    timestamp: '4h ago',
  },
  {
    id: 3,
    author: 'M. Theo',
    handle: '@theo_root',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    tag: 'event',
    title: 'Binary Exploitation Workshop',
    content: 'This Saturday 15:00 UTC. Stack overflows, ret2libc, and ROP chains. Bring your VM!',
    likes: 89,
    comments: 0,
    timestamp: '6h ago',
    isVerified: true,
  },
];

const trendingTags = ['#ctf', '#ai-security', '#career', '#bugbounty', '#redteam'];

// CRITICAL: This component MUST be rendered in your main page with id="feed"
export default function FeedSection() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [activeFilter, setActiveFilter] = useState<PostTag | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts
    .filter(p => activeFilter === 'all' || p.tag === activeFilter)
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortBy === 'top' ? b.likes - a.likes : b.id - a.id);

  const handleLike = (id: number) => {
    setPosts(ps => ps.map(p => 
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleSubmit = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      author: 'You',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      tag: 'discussion',
      title: newPost.slice(0, 60),
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    // CRITICAL: This id="feed" must match the href="#feed" in Navigation
    <section 
      id="feed" 
      className="min-h-screen bg-[#05060B] py-20 px-4 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wider mb-2">COMMUNITY FEED</h2>
          <p className="text-gray-400">Share projects, ask questions, connect with security enthusiasts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Compose Box */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-lg p-4">
              <div className="flex gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
                  className="w-10 h-10 rounded-full" 
                  alt="Your avatar" 
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's happening in security?"
                    className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[80px]"
                    rows={2}
                  />
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                    <div className="flex gap-2 text-gray-400">
                      <Hash className="w-4 h-4 hover:text-green-400 cursor-pointer" />
                      <Zap className="w-4 h-4 hover:text-green-400 cursor-pointer" />
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={!newPost.trim()}
                      className="px-4 py-1.5 bg-green-500 text-black font-medium rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-green-500 text-black border-green-500' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-green-500/50'
                }`}
              >
                All Posts
              </button>
              {(['project', 'question', 'event', 'career', 'poll', 'discussion'] as PostTag[]).map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                    activeFilter === tag 
                      ? 'bg-green-500 text-black border-green-500' 
                      : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-green-500/50'
                  }`}
                >
                  {tagConfig[tag].label}
                </button>
              ))}
              <button 
                onClick={() => setSortBy(s => s === 'newest' ? 'top' : 'newest')}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-gray-700 text-gray-300 hover:border-green-500/50 flex items-center gap-1 ml-auto"
              >
                <Filter className="w-3 h-3" />
                {sortBy === 'newest' ? 'Newest' : 'Top'}
              </button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No posts found</p>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const TagIcon = tagConfig[post.tag].icon;
                  return (
                    <article 
                      key={post.id} 
                      className="bg-[#0B0E14] border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.avatar} 
                            alt={post.author} 
                            className="w-10 h-10 rounded-full object-cover" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">{post.author}</span>
                              {post.isVerified && (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              )}
                              <span className="text-xs text-gray-500">{post.handle}</span>
                            </div>
                            <span className="text-xs text-gray-500">{post.timestamp}</span>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${tagConfig[post.tag].color}`}>
                          <TagIcon className="w-3 h-3" />
                          {tagConfig[post.tag].label}
                        </span>
                      </div>

                      <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-6 pt-3 border-t border-gray-800">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            post.liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        <button className={`ml-auto ${post.bookmarked ? 'text-green-400' : 'text-gray-500 hover:text-green-400'}`}>
                          <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-[#0B0E14] border border-gray-800 rounded-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-gray-700 hover:text-green-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 text-sm">Community Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Posts</span>
                  <span className="text-green-400 font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Now</span>
                  <span className="text-green-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    156 online
                  </span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}