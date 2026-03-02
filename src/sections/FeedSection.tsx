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
  Briefcase
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  tag: 'project' | 'question' | 'event' | 'career';
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
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
    timestamp: '2h ago',
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
    timestamp: '4h ago',
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
    timestamp: '6h ago',
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
    timestamp: '8h ago',
  },
];

const trendingTags = ['#ctf', '#ai-security', '#writeups', '#career', '#beginners', '#mentorship'];

const topContributors = [
  { name: 'A. Rhea', points: 3200 },
  { name: 'M. Theo', points: 3500 },
  { name: 'D. Marc', points: 2800 },
];

const tagConfig = {
  project: { icon: Code, color: 'text-blue-400 border-blue-400/50 bg-blue-400/10' },
  question: { icon: HelpCircle, color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' },
  event: { icon: Calendar, color: 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10' },
  career: { icon: Briefcase, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10' },
};

export default function FeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const postsContainer = postsRef.current;

    if (!section || !title || !postsContainer) return;

    const ctx = gsap.context(() => {
      // Title animation
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

      // Posts animation
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
  }, [posts]);

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

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now(),
      author: 'You',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      tag: 'project',
      title: newPost.split('\n')[0].slice(0, 50),
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <section
      ref={sectionRef}
      id="feed"
      className="relative py-20 lg:py-32"
    >
      <div className="px-6 lg:px-16">
        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4">
            COMMUNITY FEED
          </h2>
          <p className="font-mono text-[#A6A9B6] max-w-2xl">
            Share projects, ask questions, and connect with fellow security enthusiasts.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts column */}
          <div ref={postsRef} className="lg:col-span-2 space-y-6">
            {/* New post input */}
            <div className="cyber-card corner-brackets rounded-lg p-4">
              <div className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg p-3 font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSubmitPost}
                      className="flex items-center gap-2 px-4 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/30 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => {
              const TagIcon = tagConfig[post.tag].icon;
              const tagStyle = tagConfig[post.tag].color;
              
              return (
                <div
                  key={post.id}
                  className="post-card cyber-card corner-brackets rounded-lg p-5 hover:border-[#39FF14] transition-colors"
                  style={{ perspective: '1000px' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30"
                        style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron font-bold text-white">{post.author}</span>
                          <span className="font-mono text-sm text-[#A6A9B6]">{post.handle}</span>
                        </div>
                        <span className="font-mono text-xs text-[#A6A9B6]">{post.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono ${tagStyle}`}>
                        <TagIcon className="w-3 h-3" />
                        {post.tag}
                      </span>
                      <button className="text-[#A6A9B6] hover:text-[#39FF14]">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-orbitron font-bold text-lg text-white mb-2 hover:text-[#39FF14] cursor-pointer transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-mono text-sm text-[#A6A9B6] whitespace-pre-line mb-4">
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-[#39FF14]/20">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 font-mono text-sm transition-colors ${
                        post.liked ? 'text-red-400' : 'text-[#A6A9B6] hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              );
            })}
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
                <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div
                    key={contributor.name}
                    className="flex items-center justify-between p-2 bg-[#0B0E14] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron font-bold text-[#39FF14]">#{index + 1}</span>
                      <span className="font-mono text-white">{contributor.name}</span>
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
                  <span className="font-orbitron text-[#39FF14]">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
