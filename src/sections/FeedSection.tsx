import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, Hash, Send,
  Code, HelpCircle, Calendar, Briefcase, Filter, Bookmark, Search,
  CheckCircle2, AlertCircle, ChevronDown, RefreshCw, BarChart3,
  Image as ImageIcon, Link2, Smile, Bell, Zap, Users, Clock, Eye,
  ThumbsUp, MessageSquare, Flag, Edit2, Trash2, X, ChevronRight,
  ChevronLeft, Sun, Moon, Sparkles, Bot, PanelLeftClose, PanelLeftOpen,
  Reply, Bold, Italic, Code2, List, AlignLeft, Loader2, BarChart2,
  CalendarClock, FileEdit, AtSign, Save
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
type PostTag = 'project' | 'question' | 'event' | 'career' | 'poll' | 'discussion' | 'announcement';
type SortMode = 'newest' | 'top' | 'trending';
type Theme = 'dark' | 'light';

interface Reaction { emoji: string; count: number; reacted: boolean; }
interface PollOption { id: string; text: string; votes: number; }
interface Comment {
  id: number; author: string; handle: string; avatar: string;
  content: string; timestamp: string; likes: number; liked?: boolean;
  replies?: Comment[];
}
interface Post {
  id: number; author: string; handle: string; avatar: string;
  tag: PostTag; title: string; content: string;
  likes: number; comments: number; timestamp: string;
  liked?: boolean; bookmarked?: boolean;
  pollOptions?: PollOption[]; userVote?: string;
  views?: number; shares?: number; isFollowing?: boolean;
  isVerified?: boolean; commentsList?: Comment[];
  reactions?: Reaction[];
  scheduledAt?: string;
  isDraft?: boolean;
  richContent?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const defaultReactions = (): Reaction[] => [
  { emoji: '🔥', count: 0, reacted: false },
  { emoji: '👀', count: 0, reacted: false },
  { emoji: '💡', count: 0, reacted: false },
  { emoji: '🎯', count: 0, reacted: false },
  { emoji: '🚀', count: 0, reacted: false },
];

const initialPosts: Post[] = [
  {
    id: 1, author: 'D. Marc', handle: '@marc_0x',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    tag: 'project', title: 'Built a lightweight threat classifier',
    content: 'Uses a tiny transformer + Suricata logs. Works on a Raspberry Pi 4 with **90% accuracy**. Planning to open source next week!\n\nTech stack: `Python`, `TensorFlow Lite`, `Suricata`.',
    likes: 47, comments: 2, views: 234, shares: 5, timestamp: '2h ago',
    isVerified: true, isFollowing: false, richContent: true,
    reactions: [
      { emoji: '🔥', count: 12, reacted: false }, { emoji: '👀', count: 5, reacted: false },
      { emoji: '💡', count: 8, reacted: true }, { emoji: '🎯', count: 3, reacted: false }, { emoji: '🚀', count: 7, reacted: false },
    ],
    commentsList: [
      { id: 101, author: 'L. Kira', handle: '@kira_ai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', content: 'This is incredible! Will you post a write-up?', timestamp: '1h ago', likes: 5, replies: [{ id: 1011, author: 'D. Marc', handle: '@marc_0x', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', content: 'Yes, planning a full blog post next week! Stay tuned.', timestamp: '45m ago', likes: 2 }] },
      { id: 102, author: 'M. Theo', handle: '@theo_root', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', content: 'Open source would be huge for the community 🙌', timestamp: '30m ago', likes: 3 },
    ],
  },
  {
    id: 2, author: 'L. Kira', handle: '@kira_ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tag: 'question', title: 'Best resources for OSWE prep?',
    content: 'Looking for labs and note templates. Already have PortSwigger labs and Web Security Academy. What else should I focus on?\n\nAny advice from those who passed recently?',
    likes: 23, comments: 0, views: 156, shares: 2, timestamp: '4h ago',
    isFollowing: true, reactions: defaultReactions(),
  },
  {
    id: 3, author: 'M. Theo', handle: '@theo_root',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    tag: 'event', title: 'Workshop: Intro to Binary Exploitation',
    content: 'This Saturday at 15:00 UTC. We\'ll cover stack overflows, ret2libc, and basic ROP chains. Bring your VM!\n\n_Prerequisites_: Basic C knowledge, Linux familiarity.',
    likes: 89, comments: 0, views: 567, shares: 12, timestamp: '6h ago',
    isVerified: true, richContent: true, reactions: defaultReactions(),
  },
  {
    id: 4, author: 'S. Joon', handle: '@joon_pwn',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    tag: 'career', title: 'Security Engineer @ TechCorp - Referral?',
    content: 'My team is hiring for a junior security engineer position. Looking for someone with CTF experience and basic web app security knowledge.\n\nDM me if interested!',
    likes: 156, comments: 0, views: 892, shares: 23, timestamp: '8h ago',
    isFollowing: false, reactions: defaultReactions(),
  },
  {
    id: 5, author: 'CyberSec Weekly', handle: '@cs_weekly',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    tag: 'poll', title: 'What is your primary focus for 2024?',
    content: 'Cast your vote! Let\'s see what the community is prioritizing.',
    likes: 342, comments: 0, views: 1203, shares: 45, timestamp: '1d ago',
    isVerified: true, reactions: defaultReactions(),
    pollOptions: [
      { id: '1', text: 'Cloud Security', votes: 45 },
      { id: '2', text: 'AI/ML Security', votes: 82 },
      { id: '3', text: 'Binary Exploitation', votes: 23 },
      { id: '4', text: 'Web3/Blockchain', votes: 15 },
    ],
  },
  {
    id: 6, author: 'A. Rhea', handle: '@rhea_sec',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tag: 'discussion', title: 'The future of AI in cybersecurity',
    content: 'With the rapid advancement of LLMs, how do you think defensive security will evolve? Will AI replace SOC analysts or augment them?\n\nShare your thoughts below! 👇',
    likes: 78, comments: 0, views: 445, shares: 8, timestamp: '3h ago',
    isFollowing: true, reactions: defaultReactions(),
  },
  {
    id: 7, author: 'System', handle: '@cyberverse',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80',
    tag: 'announcement', title: 'New CTF Platform Launch',
    content: 'We\'re excited to announce our new CTF practice platform with over **500 challenges**! Premium members get early access starting today.\n\nCheck it out and let us know what you think!',
    likes: 234, comments: 0, views: 1567, shares: 89, timestamp: '30m ago',
    isVerified: true, richContent: true, reactions: defaultReactions(),
  },
];

const trendingTags = ['#ctf', '#ai-security', '#writeups', '#career', '#beginners', '#mentorship', '#bugbounty', '#redteam'];
const topContributors = [
  { name: 'A. Rhea', points: 3200, status: 'online', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'M. Theo', points: 3500, status: 'online', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { name: 'D. Marc', points: 2800, status: 'offline', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'L. Kira', points: 2650, status: 'online', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
];
const mentionUsers = ['@marc_0x', '@kira_ai', '@theo_root', '@joon_pwn', '@cs_weekly', '@rhea_sec', '@cyberverse'];

const tagConfig = {
  project: { icon: Code, color: 'text-blue-400 border-blue-400/50 bg-blue-400/10', label: 'Project' },
  question: { icon: HelpCircle, color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10', label: 'Question' },
  event: { icon: Calendar, color: 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10', label: 'Event' },
  career: { icon: Briefcase, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10', label: 'Career' },
  poll: { icon: BarChart3, color: 'text-pink-400 border-pink-400/50 bg-pink-400/10', label: 'Poll' },
  discussion: { icon: MessageSquare, color: 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10', label: 'Discussion' },
  announcement: { icon: Bell, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10', label: 'Announcement' },
};

// ─── Rich Text Renderer ───────────────────────────────────────────────────────
function RichText({ content, theme }: { content: string; theme: Theme }) {
  const rendered = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, `<code class="${theme === 'dark' ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'bg-green-100 text-green-700'} px-1.5 py-0.5 rounded font-mono text-xs">$1</code>`)
    .replace(/\n/g, '<br/>');
  return <p className={`font-mono text-sm ${theme === 'dark' ? 'text-[#A6A9B6]' : 'text-gray-600'} mb-4`} dangerouslySetInnerHTML={{ __html: rendered }} />;
}

// ─── Poll Chart ───────────────────────────────────────────────────────────────
function PollChart({ options, userVote, onVote, theme }: { options: PollOption[]; userVote?: string; onVote: (id: string) => void; theme: Theme }) {
  const total = options.reduce((acc, o) => acc + o.votes, 0);
  const maxVotes = Math.max(...options.map(o => o.votes));
  return (
    <div className="mb-4 space-y-2">
      {options.map((opt) => {
        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
        const isVoted = userVote === opt.id;
        const isMax = opt.votes === maxVotes && total > 0;
        return (
          <div key={opt.id} onClick={() => !userVote && onVote(opt.id)}
            className={`relative overflow-hidden border rounded-lg p-3 transition-all ${userVote ? 'cursor-default' : 'cursor-pointer'} ${
              isVoted ? 'border-[#39FF14] bg-[#39FF14]/10' : theme === 'dark' ? 'border-[#39FF14]/30 hover:border-[#39FF14]/60 bg-[#050507]' : 'border-gray-300 hover:border-green-400 bg-gray-50'
            }`}>
            <div className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${isMax && userVote ? 'bg-[#39FF14]/25' : 'bg-[#39FF14]/15'}`}
              style={{ width: `${pct}%` }} />
            <div className="relative flex justify-between items-center z-10">
              <span className={`font-mono text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {isVoted && <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />}
                {isMax && userVote && !isVoted && <BarChart2 className="w-3 h-3 text-[#39FF14]/60" />}
                {opt.text}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 rounded-full bg-[#39FF14]/20 overflow-hidden">
                  <div className="h-full bg-[#39FF14] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-xs text-[#A6A9B6] w-16 text-right">{pct}% ({opt.votes})</span>
              </div>
            </div>
          </div>
        );
      })}
      <p className="font-mono text-xs text-[#A6A9B6] mt-2">{total.toLocaleString()} votes • {userVote ? 'Voted ✓' : 'Click to vote'}</p>
    </div>
  );
}

// ─── Comment Thread ────────────────────────────────────────────────────────────
function CommentThread({ comment, depth = 0, theme, onLike }: { comment: Comment; depth?: number; theme: Theme; onLike: (id: number) => void }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies || []);

  const handleReply = () => {
    if (!replyText.trim()) return;
    setLocalReplies([...localReplies, {
      id: Date.now(), author: 'You', handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      content: replyText, timestamp: 'Just now', likes: 0,
    }]);
    setReplyText(''); setShowReply(false);
  };

  return (
    <div className={`${depth > 0 ? `ml-8 border-l-2 ${theme === 'dark' ? 'border-[#39FF14]/20' : 'border-green-200'} pl-3` : ''}`}>
      <div className={`flex gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-[#050507]' : 'bg-gray-50'} mb-2`}>
        <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{comment.author}</span>
            <span className="font-mono text-xs text-[#A6A9B6]">{comment.handle}</span>
            <span className="font-mono text-xs text-[#A6A9B6]">• {comment.timestamp}</span>
          </div>
          <p className={`font-mono text-sm ${theme === 'dark' ? 'text-[#A6A9B6]' : 'text-gray-600'}`}>{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => onLike(comment.id)} className={`flex items-center gap-1 text-xs transition-colors ${comment.liked ? 'text-red-400' : 'text-[#A6A9B6] hover:text-red-400'}`}>
              <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} /> {comment.likes}
            </button>
            {depth < 2 && (
              <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
                <Reply className="w-3 h-3" /> Reply
              </button>
            )}
          </div>
          {showReply && (
            <div className="flex gap-2 mt-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..." onKeyDown={e => e.key === 'Enter' && handleReply()}
                className={`flex-1 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none border ${theme === 'dark' ? 'bg-[#0B0E14] border-[#39FF14]/30 text-white focus:border-[#39FF14]' : 'bg-white border-gray-300 text-gray-900 focus:border-green-400'}`} />
              <button onClick={handleReply} className="px-2 py-1 bg-[#39FF14]/20 border border-[#39FF14] rounded text-[#39FF14] hover:bg-[#39FF14]/30 text-xs">
                <Send className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      {localReplies.map(r => <CommentThread key={r.id} comment={r} depth={depth + 1} theme={theme} onLike={onLike} />)}
    </div>
  );
}

// ─── AI Summarizer Hook ───────────────────────────────────────────────────────
function useAISummarizer() {
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<number | null>(null);

  const summarize = async (post: Post) => {
    if (summaries[post.id]) { setSummaries(p => { const n = { ...p }; delete n[post.id]; return n; }); return; }
    setLoading(post.id);
    // Simulate AI summarization
    await new Promise(r => setTimeout(r, 1200));
    const summaryMap: Record<number, string> = {
      1: '🤖 TL;DR: Lightweight ML threat classifier running on Pi 4 with 90% accuracy. Open source drop incoming.',
      2: '🤖 TL;DR: User seeking OSWE certification resources beyond PortSwigger. Requesting community guidance.',
      3: '🤖 TL;DR: Binary exploitation workshop this Saturday covering stack overflows, ret2libc, and ROP chains.',
      4: '🤖 TL;DR: Junior security engineer role with CTF experience requirement. Direct referral available via DM.',
      5: '🤖 TL;DR: Community poll — AI/ML Security leads with 82 votes (50%), followed by Cloud Security.',
      6: '🤖 TL;DR: Open discussion on whether AI will replace or augment SOC analyst roles in cybersecurity.',
      7: '🤖 TL;DR: New CTF platform launch with 500+ challenges. Premium early access available today.',
    };
    setSummaries(p => ({ ...p, [post.id]: summaryMap[post.id] || '🤖 TL;DR: Interesting post about cybersecurity topics worth exploring further.' }));
    setLoading(null);
  };

  return { summaries, loading, summarize };
}

// ─── Draft Manager ────────────────────────────────────────────────────────────
interface Draft { id: number; content: string; tag: PostTag; savedAt: string; }

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Core state
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [newPostTag, setNewPostTag] = useState<PostTag>('discussion');
  const [activeFilter, setActiveFilter] = useState<PostTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('newest');
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // UI state
  const [theme, setTheme] = useState<Theme>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [filterAnimKey, setFilterAnimKey] = useState(0);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'M. Theo liked your post', time: '5m ago', read: false },
    { id: 2, text: 'New follower: @sec_guru', time: '1h ago', read: false },
    { id: 3, text: 'Your poll received 10 votes', time: '2h ago', read: true },
    { id: 4, text: '@kira_ai mentioned you in a comment', time: '3h ago', read: false },
  ]);

  const { summaries, loading: aiLoading, summarize } = useAISummarizer();

  // ── Derived State ──────────────────────────────────────────────────────────
  const POSTS_PER_PAGE = 4;
  const filteredPosts = posts
    .filter(p => !p.isDraft)
    .filter(p => activeFilter === 'all' || p.tag === activeFilter)
    .filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'top') return b.likes - a.likes;
      if (sortBy === 'trending') return (b.views || 0) - (a.views || 0);
      return b.id - a.id;
    });

  const visiblePosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);
  const hasMore = visiblePosts.length < filteredPosts.length;
  const unreadCount = notifications.filter(n => !n.read).length;

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-[#050507]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#0B0E14] border-[#39FF14]/20' : 'bg-white border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const subtext = isDark ? 'text-[#A6A9B6]' : 'text-gray-500';
  const inputBg = isDark ? 'bg-[#050507] border-[#39FF14]/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

  // ── Animations ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const container = postsRef.current;
    if (!section || !title || !container) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(title, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: title, start: 'top 80%', end: 'top 55%', scrub: 0.4 } });
      container.querySelectorAll('.post-card').forEach(card => {
        gsap.fromTo(card, { y: 40, opacity: 0, rotateX: 10 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.5, scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 60%', scrub: 0.4 } });
      });
    }, section);
    return () => ctx.revert();
  }, [visiblePosts, activeFilter, sortBy]);

  // Filter change animation
  const handleFilterChange = (f: PostTag | 'all') => {
    setActiveFilter(f);
    setPage(1);
    setFilterAnimKey(k => k + 1);
  };

  // ── Infinite Scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => { setPage(p => p + 1); setIsLoadingMore(false); }, 800);
      }
    }, { threshold: 0.5 });
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoadingMore]);

  // ── New post simulation ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHasNewPosts(true), 12000);
    return () => clearTimeout(t);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => { setShowDropdown(null); setShowNotifications(false); setShowReactionPicker(null); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ── Mention autocomplete ───────────────────────────────────────────────────
  const handlePostInput = (val: string) => {
    setNewPost(val);
    const atIdx = val.lastIndexOf('@');
    if (atIdx !== -1 && atIdx === val.length - 1 || (atIdx !== -1 && !val.slice(atIdx + 1).includes(' '))) {
      const query = val.slice(atIdx + 1);
      setMentionQuery(query);
      setShowMentions(true);
      setMentionIndex(0);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: string) => {
    const atIdx = newPost.lastIndexOf('@');
    setNewPost(newPost.slice(0, atIdx) + user + ' ');
    setShowMentions(false);
  };

  const filteredMentions = mentionUsers.filter(u => u.toLowerCase().includes(mentionQuery.toLowerCase()));

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLike = (id: number) => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  const handleFollow = (id: number) => { setPosts(ps => ps.map(p => p.id === id ? { ...p, isFollowing: !p.isFollowing } : p)); setShowDropdown(null); };
  const handleBookmark = (id: number) => { setPosts(ps => ps.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)); setShowDropdown(null); };
  const handleVote = (postId: number, optId: string) => setPosts(ps => ps.map(p => {
    if (p.id !== postId || !p.pollOptions) return p;
    return { ...p, pollOptions: p.pollOptions.map(o => ({ ...o, votes: p.userVote === o.id ? o.votes - 1 : o.id === optId ? o.votes + 1 : o.votes })), userVote: optId };
  }));

  const handleReaction = (postId: number, emoji: string) => {
    setPosts(ps => ps.map(p => {
      if (p.id !== postId) return p;
      return { ...p, reactions: p.reactions?.map(r => r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 } : r) };
    }));
    setShowReactionPicker(null);
  };

  const handleShare = (post: Post) => { navigator.clipboard?.writeText(`Check out: ${post.title}`); setShowDropdown(null); };

  const handleDelete = (id: number) => { if (confirm('Delete this post?')) setPosts(ps => ps.filter(p => p.id !== id)); setShowDropdown(null); };

  const handleStartEdit = (post: Post) => { setEditingPost(post.id); setEditContent(post.content); setShowDropdown(null); };
  const handleSaveEdit = (id: number) => { setPosts(ps => ps.map(p => p.id === id ? { ...p, content: editContent } : p)); setEditingPost(null); };

  const handleSubmitPost = (asDraft = false, scheduled = false) => {
    if (!newPost.trim()) return;
    if (asDraft) {
      setDrafts(d => [...d, { id: Date.now(), content: newPost, tag: newPostTag, savedAt: new Date().toLocaleTimeString() }]);
      setNewPost(''); setShowDrafts(true); return;
    }
    const post: Post = {
      id: Date.now(), author: 'You', handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      tag: newPostTag, title: newPost.split('\n')[0].slice(0, 60),
      content: newPost, likes: 0, comments: 0, views: 0, shares: 0,
      timestamp: scheduled && scheduleDate ? `Scheduled: ${new Date(scheduleDate).toLocaleString()}` : 'Just now',
      reactions: defaultReactions(), isDraft: false,
    };
    setPosts(ps => [post, ...ps]); setNewPost(''); setShowScheduler(false);
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;
    const nc: Comment = { id: Date.now(), author: 'You', handle: '@you', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80', content: commentText, timestamp: 'Just now', likes: 0 };
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, comments: p.comments + 1, commentsList: [...(p.commentsList || []), nc] } : p));
    setCommentText('');
  };

  const markNotificationsRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));

  const insertFormatting = (type: string) => {
    const formats: Record<string, string> = { bold: '**text**', italic: '_text_', code: '`code`', list: '\n- item' };
    setNewPost(p => p + formats[type]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} id="feed" className={`relative py-20 lg:py-32 ${bg} transition-colors duration-300`}>
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">

        {/* Header */}
        <div ref={titleRef} className="mb-12 flex items-start justify-between">
          <div>
            <h2 className={`font-orbitron font-bold text-4xl md:text-5xl ${text} mb-4 tracking-wider`}>COMMUNITY FEED</h2>
            <p className={`font-mono ${subtext} max-w-2xl`}>Share projects, ask questions, and connect with fellow security enthusiasts.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className={`p-2 border rounded-lg transition-colors ${isDark ? 'border-[#39FF14]/30 hover:border-[#39FF14] text-[#39FF14]' : 'border-gray-300 hover:border-green-500 text-gray-600'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Drafts Button */}
            <button onClick={() => setShowDrafts(s => !s)} className={`relative p-2 border rounded-lg transition-colors ${isDark ? 'border-[#39FF14]/30 hover:border-[#39FF14] text-[#39FF14]' : 'border-gray-300 hover:border-green-500 text-gray-600'}`}>
              <FileEdit className="w-5 h-5" />
              {drafts.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">{drafts.length}</span>}
            </button>

            {/* Notifications */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => { setShowNotifications(s => !s); if (!showNotifications) markNotificationsRead(); }}
                className={`relative p-2 border rounded-lg transition-colors ${isDark ? 'border-[#39FF14]/30 hover:border-[#39FF14] text-[#39FF14]' : 'border-gray-300 hover:border-green-500 text-gray-600'}`}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className={`absolute right-0 top-12 w-80 border rounded-lg shadow-2xl z-50 py-2 ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30' : 'bg-white border-gray-200'}`}>
                  <div className={`px-4 py-2 border-b ${isDark ? 'border-[#39FF14]/20' : 'border-gray-100'} font-orbitron font-bold ${text}`}>Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b ${isDark ? 'border-[#39FF14]/10' : 'border-gray-50'} font-mono text-sm ${n.read ? subtext : isDark ? 'text-white bg-[#39FF14]/5' : 'text-gray-900 bg-green-50'}`}>
                      <p>{n.text}</p><span className={`text-xs ${subtext}`}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drafts Panel */}
        {showDrafts && (
          <div className={`mb-6 border rounded-lg p-4 ${isDark ? 'bg-[#0B0E14] border-yellow-500/30' : 'bg-yellow-50 border-yellow-300'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-orbitron font-bold ${text} flex items-center gap-2`}><FileEdit className="w-4 h-4 text-yellow-400" /> Drafts ({drafts.length})</span>
              <button onClick={() => setShowDrafts(false)}><X className={`w-4 h-4 ${subtext}`} /></button>
            </div>
            {drafts.length === 0 ? <p className={`font-mono text-sm ${subtext}`}>No drafts saved.</p> : (
              <div className="space-y-2">
                {drafts.map(d => (
                  <div key={d.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-[#050507]' : 'bg-white'}`}>
                    <div>
                      <p className={`font-mono text-sm ${text} truncate max-w-xs`}>{d.content.slice(0, 60)}...</p>
                      <span className={`font-mono text-xs ${subtext}`}>{tagConfig[d.tag].label} • Saved {d.savedAt}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setNewPost(d.content); setNewPostTag(d.tag); setDrafts(ds => ds.filter(x => x.id !== d.id)); setShowDrafts(false); }}
                        className="px-3 py-1 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-xs text-[#39FF14]">Edit</button>
                      <button onClick={() => setDrafts(ds => ds.filter(x => x.id !== d.id))} className="px-3 py-1 border border-red-500/30 rounded font-mono text-xs text-red-400">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className={`grid gap-8 transition-all duration-300 ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>

          {/* Posts Column */}
          <div className={`space-y-6 ${sidebarCollapsed ? 'max-w-3xl mx-auto w-full' : 'lg:col-span-2'}`}>

            {/* Search & Filter Bar */}
            <div className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 backdrop-blur-sm ${isDark ? 'bg-[#0B0E14]/95 border-[#39FF14]/20' : 'bg-white/95 border-gray-200'}`}>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39FF14]" />
                <input type="text" placeholder="Search posts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-lg pl-10 pr-4 py-2 font-mono text-sm focus:border-[#39FF14] focus:outline-none ${inputBg}`} />
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {(['all', ...Object.keys(tagConfig)] as Array<'all' | PostTag>).map(tag => (
                  <button key={tag} onClick={() => handleFilterChange(tag)}
                    className={`px-3 py-1.5 rounded font-mono text-xs border transition-all whitespace-nowrap ${activeFilter === tag ? 'bg-[#39FF14] text-black border-[#39FF14]' : isDark ? 'border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]' : 'border-gray-300 text-gray-600 hover:border-green-400'}`}>
                    {tag === 'all' ? 'All' : tagConfig[tag as PostTag].label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSortBy(s => s === 'newest' ? 'top' : s === 'top' ? 'trending' : 'newest')}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded font-mono text-xs transition-colors ${isDark ? 'border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]' : 'border-gray-300 text-gray-600 hover:border-green-400'}`}>
                <Filter className="w-3 h-3" />
                {sortBy === 'newest' ? 'Newest' : sortBy === 'top' ? 'Top Rated' : 'Trending'}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* New Posts Banner */}
            {hasNewPosts && (
              <div onClick={() => setHasNewPosts(false)} className="cursor-pointer bg-[#39FF14]/10 border border-[#39FF14] rounded-lg p-3 text-center font-mono text-sm text-[#39FF14] animate-pulse flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> New posts available — click to refresh
              </div>
            )}

            {/* Compose Box */}
            <div className={`border rounded-lg p-4 ${cardBg}`}>
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" alt="You" className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30" />
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <select value={newPostTag} onChange={e => setNewPostTag(e.target.value as PostTag)}
                      className={`border rounded px-2 py-1 font-mono text-xs text-[#39FF14] focus:outline-none ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30' : 'bg-gray-100 border-gray-300'}`}>
                      {Object.entries(tagConfig).map(([tag, cfg]) => <option key={tag} value={tag}>{cfg.label}</option>)}
                    </select>
                    {/* Rich text toolbar */}
                    <div className={`flex items-center gap-1 border rounded px-2 ${isDark ? 'border-[#39FF14]/20' : 'border-gray-200'}`}>
                      {([['bold', Bold], ['italic', Italic], ['code', Code2], ['list', List]] as [string, React.ElementType][]).map(([t, IconComp]) => (
                        <button key={t} onClick={() => insertFormatting(t)} title={t}
                          className={`p-1 transition-colors ${subtext} hover:text-[#39FF14]`}>
                          <IconComp className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <textarea value={newPost} onChange={e => handlePostInput(e.target.value)}
                      placeholder="Share something with the community... (supports **bold**, _italic_, `code`)"
                      className={`w-full border rounded-lg p-3 font-mono text-sm placeholder-gray-500/50 resize-none focus:border-[#39FF14] focus:outline-none transition-colors ${inputBg}`}
                      rows={3} />
                    {/* Mention dropdown */}
                    {showMentions && filteredMentions.length > 0 && (
                      <div className={`absolute bottom-full left-0 mb-1 w-48 border rounded-lg shadow-xl z-30 py-1 ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30' : 'bg-white border-gray-200'}`}>
                        {filteredMentions.map((u, i) => (
                          <button key={u} onClick={() => insertMention(u)}
                            className={`w-full text-left px-3 py-2 font-mono text-sm flex items-center gap-2 transition-colors ${i === mentionIndex ? 'bg-[#39FF14]/10 text-[#39FF14]' : `${subtext} hover:bg-[#39FF14]/5 hover:text-[#39FF14]`}`}>
                            <AtSign className="w-3 h-3" />{u.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                    <div className="flex gap-1">
                      <button className={`p-2 transition-colors ${subtext} hover:text-[#39FF14]`}><ImageIcon className="w-4 h-4" /></button>
                      <button className={`p-2 transition-colors ${subtext} hover:text-[#39FF14]`}><Link2 className="w-4 h-4" /></button>
                      <button className={`p-2 transition-colors ${subtext} hover:text-[#39FF14]`}><Smile className="w-4 h-4" /></button>
                      <button onClick={() => setShowMentions(s => !s)} className={`p-2 transition-colors ${subtext} hover:text-[#39FF14]`} title="Mention someone"><AtSign className="w-4 h-4" /></button>
                      <button onClick={() => setShowScheduler(s => !s)} className={`p-2 transition-colors ${subtext} hover:text-[#39FF14]`} title="Schedule post"><CalendarClock className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono text-xs ${subtext}`}>{newPost.length}/500</span>
                      <button onClick={() => handleSubmitPost(true)} disabled={!newPost.trim()}
                        className={`flex items-center gap-1 px-3 py-1.5 border rounded font-mono text-xs transition-colors disabled:opacity-50 ${isDark ? 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-400/10' : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}>
                        <Save className="w-3 h-3" /> Draft
                      </button>
                      <button onClick={() => handleSubmitPost(false)} disabled={!newPost.trim()}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send className="w-4 h-4" /> Post
                      </button>
                    </div>
                  </div>
                  {/* Scheduler */}
                  {showScheduler && (
                    <div className={`mt-3 p-3 border rounded-lg ${isDark ? 'border-[#39FF14]/20 bg-[#050507]' : 'border-gray-200 bg-gray-50'}`}>
                      <p className={`font-mono text-xs ${subtext} mb-2 flex items-center gap-1`}><CalendarClock className="w-3 h-3" /> Schedule for later</p>
                      <div className="flex gap-2">
                        <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                          className={`flex-1 border rounded px-2 py-1 font-mono text-xs focus:outline-none focus:border-[#39FF14] ${inputBg}`} />
                        <button onClick={() => handleSubmitPost(false, true)} disabled={!scheduleDate}
                          className="px-3 py-1 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-xs text-[#39FF14] disabled:opacity-50">
                          Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div ref={postsRef} key={filterAnimKey} className="space-y-6">
              {visiblePosts.length === 0 ? (
                <div className="text-center py-12 font-mono text-[#A6A9B6]">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#39FF14]/50" />
                  No posts found matching your criteria.
                </div>
              ) : visiblePosts.map(post => {
                const TagIcon = tagConfig[post.tag].icon;
                const tagStyle = tagConfig[post.tag].color;
                const isExpanded = expandedPost === post.id;
                const isEditing = editingPost === post.id;
                const summary = summaries[post.id];
                const totalReactions = post.reactions?.reduce((a, r) => a + r.count, 0) || 0;

                return (
                  <div key={post.id} className={`post-card border rounded-lg p-5 transition-all relative group ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/20 hover:border-[#39FF14]' : 'bg-white border-gray-200 hover:border-green-400'}`} style={{ perspective: '1000px' }}>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-[#39FF14]/30" style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }} />
                          {post.isVerified && <CheckCircle2 className={`absolute -bottom-1 -right-1 w-4 h-4 text-[#39FF14] rounded-full ${isDark ? 'bg-[#050507]' : 'bg-white'}`} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-orbitron font-bold ${text}`}>{post.author}</span>
                            {post.isFollowing && <span className="px-1.5 py-0.5 bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-mono rounded">Following</span>}
                          </div>
                          <span className={`font-mono text-sm ${subtext}`}>{post.handle}</span>
                          <span className={`font-mono text-xs ${subtext} ml-2`}>• {post.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono ${tagStyle}`}>
                          <TagIcon className="w-3 h-3" />{tagConfig[post.tag].label}
                        </span>

                        {/* AI Summary Button */}
                        <button onClick={() => summarize(post)} title="AI Summary"
                          className={`p-1.5 rounded-lg border transition-colors ${summary ? 'border-purple-400/50 bg-purple-400/10 text-purple-400' : isDark ? 'border-[#39FF14]/20 text-[#A6A9B6] hover:text-purple-400 hover:border-purple-400/50' : 'border-gray-200 text-gray-400 hover:text-purple-500'}`}>
                          {aiLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                        </button>

                        {/* Dropdown */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setShowDropdown(showDropdown === post.id ? null : post.id)} className={`${subtext} hover:text-[#39FF14] p-1`}>
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showDropdown === post.id && (
                            <div className={`absolute right-0 top-8 w-48 border rounded-lg shadow-xl z-10 py-1 font-mono text-sm ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30' : 'bg-white border-gray-200'}`}>
                              <button onClick={() => handleFollow(post.id)} className={`w-full text-left px-4 py-2 ${subtext} hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2`}>
                                <Users className="w-4 h-4" />{post.isFollowing ? 'Unfollow' : 'Follow'} {post.author}
                              </button>
                              <button onClick={() => handleBookmark(post.id)} className={`w-full text-left px-4 py-2 ${subtext} hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2`}>
                                <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-[#39FF14] text-[#39FF14]' : ''}`} />{post.bookmarked ? 'Bookmarked' : 'Bookmark'}
                              </button>
                              <button onClick={() => handleShare(post)} className={`w-full text-left px-4 py-2 ${subtext} hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2`}>
                                <Share2 className="w-4 h-4" />Copy Link
                              </button>
                              {post.author === 'You' && <>
                                <div className={`border-t ${isDark ? 'border-[#39FF14]/20' : 'border-gray-100'} my-1`} />
                                <button onClick={() => handleStartEdit(post)} className={`w-full text-left px-4 py-2 ${subtext} hover:bg-[#39FF14]/10 hover:text-[#39FF14] flex items-center gap-2`}>
                                  <Edit2 className="w-4 h-4" />Edit Post
                                </button>
                                <button onClick={() => handleDelete(post.id)} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 flex items-center gap-2">
                                  <Trash2 className="w-4 h-4" />Delete Post
                                </button>
                              </>}
                              <div className={`border-t ${isDark ? 'border-[#39FF14]/20' : 'border-gray-100'} my-1`} />
                              <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 flex items-center gap-2">
                                <Flag className="w-4 h-4" />Report
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Summary Banner */}
                    {summary && (
                      <div className={`mb-3 p-3 rounded-lg border flex items-start gap-2 ${isDark ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                        <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p className="font-mono text-xs text-purple-300">{summary}</p>
                        <button onClick={() => summarize(post)} className="ml-auto flex-shrink-0"><X className="w-3 h-3 text-purple-400" /></button>
                      </div>
                    )}

                    {/* Content */}
                    <h3 className={`font-orbitron font-bold text-lg ${text} mb-2 hover:text-[#39FF14] cursor-pointer transition-colors`}>{post.title}</h3>
                    {isEditing ? (
                      <div className="mb-4">
                        <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                          className={`w-full border rounded-lg p-3 font-mono text-sm resize-none focus:border-[#39FF14] focus:outline-none ${inputBg}`} rows={4} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleSaveEdit(post.id)} className="px-3 py-1.5 bg-[#39FF14]/20 border border-[#39FF14] rounded font-mono text-xs text-[#39FF14]">Save</button>
                          <button onClick={() => setEditingPost(null)} className={`px-3 py-1.5 border rounded font-mono text-xs ${isDark ? 'border-[#39FF14]/30 text-[#A6A9B6]' : 'border-gray-300 text-gray-500'}`}>Cancel</button>
                        </div>
                      </div>
                    ) : post.richContent ? <RichText content={post.content} theme={theme} /> : (
                      <p className={`font-mono text-sm ${subtext} whitespace-pre-line mb-4`}>{post.content}</p>
                    )}

                    {/* Poll */}
                    {post.tag === 'poll' && post.pollOptions && (
                      <PollChart options={post.pollOptions} userVote={post.userVote} onVote={id => handleVote(post.id, id)} theme={theme} />
                    )}

                    {/* Emoji Reactions */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap" onClick={e => e.stopPropagation()}>
                      {post.reactions?.filter(r => r.count > 0).map(r => (
                        <button key={r.emoji} onClick={() => handleReaction(post.id, r.emoji)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono transition-all ${r.reacted ? 'border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14]' : isDark ? 'border-[#39FF14]/20 text-[#A6A9B6] hover:border-[#39FF14]/50' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}>
                          {r.emoji} {r.count}
                        </button>
                      ))}
                      <div className="relative">
                        <button onClick={() => setShowReactionPicker(showReactionPicker === post.id ? null : post.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono transition-all ${isDark ? 'border-[#39FF14]/20 text-[#A6A9B6] hover:border-[#39FF14]/50 hover:text-[#39FF14]' : 'border-gray-200 text-gray-400 hover:border-green-300'}`}>
                          <Smile className="w-3 h-3" /> React
                        </button>
                        {showReactionPicker === post.id && (
                          <div className={`absolute bottom-full left-0 mb-2 flex gap-1 p-2 border rounded-xl shadow-xl z-20 ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30' : 'bg-white border-gray-200'}`}>
                            {post.reactions?.map(r => (
                              <button key={r.emoji} onClick={() => handleReaction(post.id, r.emoji)}
                                className="text-xl hover:scale-125 transition-transform p-1">{r.emoji}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className={`flex items-center gap-4 mb-4 py-2 border-y text-xs font-mono ${subtext} ${isDark ? 'border-[#39FF14]/10' : 'border-gray-100'}`}>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{post.shares}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.timestamp}</span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 font-mono text-sm transition-colors ${post.liked ? 'text-red-400' : `${subtext} hover:text-red-400`}`}>
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />{post.likes}
                        </button>
                        <button onClick={() => setExpandedPost(isExpanded ? null : post.id)} className={`flex items-center gap-2 font-mono text-sm ${subtext} hover:text-[#39FF14] transition-colors`}>
                          <MessageCircle className="w-4 h-4" />{post.comments}
                        </button>
                        <button onClick={() => handleShare(post)} className={`flex items-center gap-2 font-mono text-sm ${subtext} hover:text-[#39FF14] transition-colors`}>
                          <Share2 className="w-4 h-4" />Share
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.bookmarked && <Bookmark className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />}
                        {post.likes > 50 && <Zap className="w-4 h-4 text-yellow-400" title="Hot post!" />}
                        {totalReactions > 10 && <Sparkles className="w-4 h-4 text-purple-400" title="Trending!" />}
                      </div>
                    </div>

                    {/* Comments Section */}
                    {isExpanded && (
                      <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#39FF14]/20' : 'border-gray-100'}`}>
                        <div className="space-y-2 mb-4">
                          {(post.commentsList || []).length === 0 && (
                            <p className={`font-mono text-sm ${subtext} text-center py-4`}>No comments yet. Be the first!</p>
                          )}
                          {(post.commentsList || []).map(c => (
                            <CommentThread key={c.id} comment={c} theme={theme} onLike={cId => {
                              setPosts(ps => ps.map(p => p.id === post.id ? { ...p, commentsList: p.commentsList?.map(cm => cm.id === cId ? { ...cm, liked: !cm.liked, likes: cm.liked ? cm.likes - 1 : cm.likes + 1 } : cm) } : p));
                            }} />
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 flex gap-2">
                            <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                              placeholder="Write a comment... (Enter to send)"
                              className={`flex-1 border rounded-lg px-3 py-2 font-mono text-sm focus:border-[#39FF14] focus:outline-none ${inputBg}`}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)} />
                            <button onClick={() => handleAddComment(post.id)} disabled={!commentText.trim()}
                              className="px-3 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded text-[#39FF14] hover:bg-[#39FF14]/30 disabled:opacity-50">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Infinite scroll sentinel */}
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore && (
                  <div className="flex items-center gap-2 font-mono text-sm text-[#39FF14]">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading more posts...
                  </div>
                )}
                {!hasMore && filteredPosts.length > 0 && (
                  <p className={`font-mono text-sm ${subtext}`}>You've reached the end 🎯</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!sidebarCollapsed && (
            <div className="space-y-6">
              {/* Trending Tags */}
              <div className={`border rounded-lg p-5 ${cardBg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                  <h3 className={`font-orbitron font-bold ${text}`}>Trending Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map(tag => (
                    <button key={tag} onClick={() => setSearchQuery(tag)}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-full font-mono text-sm transition-colors ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14]' : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600'}`}>
                      <Hash className="w-3 h-3" />{tag.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className={`border rounded-lg p-5 ${cardBg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-[#39FF14]" />
                  <h3 className={`font-orbitron font-bold ${text}`}>Top Contributors</h3>
                </div>
                <div className="space-y-3">
                  {topContributors.map((c, i) => (
                    <div key={c.name} className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-[#0B0E14] hover:bg-[#39FF14]/5' : 'bg-gray-50 hover:bg-green-50'}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-orbitron font-bold text-[#39FF14] w-6">#{i + 1}</span>
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <span className={`font-mono ${text} block text-sm`}>{c.name}</span>
                          <span className={`text-[10px] font-mono ${c.status === 'online' ? 'text-[#39FF14]' : subtext}`}>● {c.status}</span>
                        </div>
                      </div>
                      <span className={`font-mono text-sm ${subtext}`}>{c.points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className={`border rounded-lg p-5 ${cardBg}`}>
                <h3 className={`font-orbitron font-bold ${text} mb-4`}>Community Stats</h3>
                <div className="space-y-3">
                  {[['Total Posts', '1,247'], ['This Week', '89'], ['Active Now', '156']].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className={`font-mono text-sm ${subtext}`}>{label}</span>
                      <span className="font-orbitron text-[#39FF14] flex items-center gap-1">
                        {label === 'Active Now' && <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />}
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookmarks */}
              <div className={`border rounded-lg p-5 ${cardBg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-5 h-5 text-[#39FF14]" />
                  <h3 className={`font-orbitron font-bold ${text}`}>Saved</h3>
                </div>
                {posts.filter(p => p.bookmarked).length === 0
                  ? <p className={`font-mono text-xs ${subtext}`}>No saved posts yet.</p>
                  : <div className="space-y-2">{posts.filter(p => p.bookmarked).slice(0, 3).map(p => (
                    <div key={p.id} onClick={() => setExpandedPost(p.id)}
                      className={`text-sm font-mono truncate border-l-2 border-[#39FF14] pl-2 cursor-pointer transition-colors ${subtext} hover:text-[#39FF14]`}>{p.title}</div>
                  ))}</div>}
              </div>

              {/* Quick Actions */}
              <div className={`border rounded-lg p-5 ${cardBg}`}>
                <h3 className={`font-orbitron font-bold ${text} mb-4`}>Quick Actions</h3>
                <div className="space-y-1">
                  {([['Start a Project', Code, 'project'], ['Ask a Question', HelpCircle, 'question'], ['Create Event', Calendar, 'event'], ['Post a Poll', BarChart3, 'poll']] as [string, React.ElementType, PostTag][]).map(([label, IconComp, tag]) => (
                    <button key={label} onClick={() => { setNewPostTag(tag); document.querySelector('textarea')?.focus(); }}
                      className={`w-full flex items-center gap-2 p-2 rounded transition-colors font-mono text-sm ${subtext} hover:bg-[#39FF14]/10 hover:text-[#39FF14]`}>
                      <IconComp className="w-4 h-4" />{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button onClick={() => setSidebarCollapsed(s => !s)}
          className={`fixed bottom-8 right-8 p-3 border rounded-xl shadow-lg transition-all z-40 ${isDark ? 'bg-[#0B0E14] border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10' : 'bg-white border-green-400 text-green-600 hover:bg-green-50'}`}
          title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}>
          {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>
    </section>
  );
}