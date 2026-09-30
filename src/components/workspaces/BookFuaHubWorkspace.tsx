import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Globe2,
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  Video,
  Palette,
  Mic,
  Share2,
  Award,
} from 'lucide-react';

interface BookFuaHubWorkspaceProps {
  onOpenCreditModal: () => void;
}

const MASTERCLASSES = [
  {
    id: 'ai-photo',
    title: 'AI Picture Editing & Retouching Masterclass',
    instructor: 'Fuaprint Studios Lead Artists',
    level: 'All Levels',
    duration: '6 Modules · 18 Video Lessons',
    description: 'Master prompt engineering, face restoration, background removal, and commercial advertising poster composition.',
    tags: ['AI Editing', 'Photoshop', 'Canva Pro', 'High-Res'],
    color: '#06b6d4',
  },
  {
    id: 'capcut-motion',
    title: 'CapCut Pro & Motion Graphics Workflow',
    instructor: 'Fuaprint Video Architects',
    level: 'Intermediate',
    duration: '8 Modules · 24 Video Lessons',
    description: 'Create viral TikTok, Reels and YouTube Shorts with speed ramps, cinematic transitions, keyframe animation, and beat-synced captions.',
    tags: ['CapCut', 'Motion Design', '60 FPS', 'Reels'],
    color: '#3b82f6',
  },
  {
    id: 'voice-cloning',
    title: 'Voice Cloning & AI Audio Production',
    instructor: '7Camz & Fuaprint Audio Labs',
    level: 'Beginner to Advanced',
    duration: '4 Modules · 12 Lessons',
    description: 'Train custom vocal models, synchronize lip movements, clean studio noise, and produce radio-ready audio advertisements.',
    tags: ['Voice Cloning', 'Lipsync', 'Audio Stems', 'Podcast'],
    color: '#10b981',
  },
  {
    id: 'social-ads',
    title: 'Sponsored Ads & Social Growth Mastery',
    instructor: 'Fuaprint Digital Growth Team',
    level: 'Growth & Business',
    duration: '5 Modules · 15 Lessons',
    description: 'Target high-converting audiences on Meta, Instagram, WhatsApp Business, and TikTok with high-CTR creative assets.',
    tags: ['Meta Ads', 'WhatsApp Funnels', 'Targeting', 'ROI'],
    color: '#f59e0b',
  },
];

const AGENCY_SERVICES = [
  {
    id: 'graphic-branding',
    title: 'Brand Identity & Logo Architecture',
    turnaround: '24–48 Hours',
    icon: Palette,
    color: '#06b6d4',
    description: 'Custom vector logos, corporate stationery, color guidelines, and social media brand kits crafted by senior designers.',
    features: ['3 Unique Concepts', 'Vector SVG/EPS Masters', 'Social Media Kit', 'Full Copyright Transfer'],
  },
  {
    id: 'video-editing',
    title: 'Commercial Video Post-Production',
    turnaround: '12–24 Hours',
    icon: Video,
    color: '#3b82f6',
    description: 'Human-grade polishing of your 7Camz generated video renders with sound design, color grading, subtitles, and VFX.',
    features: ['Color Grading LUTs', 'Sound FX & Mix', 'Custom Lower Thirds', '4K Master Delivery'],
  },
  {
    id: 'voice-multilingual',
    title: 'Voice Cloning & Multilingual Dubbing',
    turnaround: 'Same Day',
    icon: Mic,
    color: '#10b981',
    description: 'Turn scripts into broadcast-quality audio files in 40+ accents and languages with natural human cadence.',
    features: ['Custom Brand Voiceprint', 'Lossless 48kHz WAV', 'Stem Separation', 'Commercial Rights'],
  },
  {
    id: 'growth-campaigns',
    title: 'Sponsored Ads Setup & Account Boosting',
    turnaround: '24 Hours',
    icon: Share2,
    color: '#f59e0b',
    description: 'End-to-end setup of Facebook, Instagram, TikTok, and WhatsApp advertising pipelines designed for direct conversion.',
    features: ['Pixel / CAPI Setup', 'Ad Copy & Creatives', 'Audience Retargeting', 'Budget Optimization'],
  },
];

export const BookFuaHubWorkspace: React.FC<BookFuaHubWorkspaceProps> = ({
  onOpenCreditModal,
}) => {
  const [requestService, setRequestService] = useState<string>('video-editing');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectBrief) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setClientName('');
        setClientEmail('');
        setProjectBrief('');
      }, 4000);
    }, 900);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Hero Banner with Official BookFUA Integration Bridge */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#070b14] via-[#0c1424] to-[#080d19] p-6 md:p-10 shadow-2xl bookfua-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            {/* Slogan Pill matching BookFUA */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>We decorate the world with premium digital solutions</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white mb-4 leading-tight">
              BookFUA & Fuaprint Studios <br className="hidden sm:inline" />
              <span className="bookfua-gradient-text">Agency Integration Hub</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              7Camz-STUDIO works in direct synergy with <strong className="text-white">bookfua.com</strong>. Bridge your automated generative AI workflows with professional agency design, human video mastering, online masterclasses, and global digital marketing.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://bookfua.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Visit BookFUA.com Portal</span>
                <ExternalLink className="w-4 h-4 text-slate-950" />
              </a>

              <a
                href="https://app.bookfua.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Open App.BookFUA.com</span>
                <Globe2 className="w-4 h-4 text-cyan-400" />
              </a>

              <button
                onClick={onOpenCreditModal}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Unified Credit Balance</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="lg:w-80 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md space-y-3.5 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Award className="w-4 h-4" />
              <span>Agency Credibility & Reach</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Official Portal:</span>
                <a
                  href="https://bookfua.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 font-mono-numbers hover:underline flex items-center gap-1"
                >
                  <span>bookfua.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Parent Creative Agency:</span>
                <span className="text-white font-semibold">Fuaprint Studios</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Delivery Speed:</span>
                <span className="text-emerald-400 font-bold">24/7 Global Turnaround</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Locations Served:</span>
                <span className="text-slate-300 font-mono-numbers">Lagos · London · Global</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200 text-center font-medium">
                Verified Safe Agency Platform · ScamAdviser High Trust Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BookFUA Agency Services & Fast Post-Production */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <span>Fuaprint Studios Premium Services</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono-numbers">
                bookfua.com
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Need custom human agency craftsmanship? Let Fuaprint Studios polish your 7Camz renders into commercial deliverables.
            </p>
          </div>

          <a
            href="https://bookfua.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Explore All Services on Bookfua.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {AGENCY_SERVICES.map((serv) => {
            const Icon = serv.icon;
            return (
              <div
                key={serv.id}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: `${serv.color}15`,
                        borderColor: `${serv.color}40`,
                        color: serv.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono-numbers text-slate-400">
                      {serv.turnaround}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {serv.description}
                  </p>

                  <ul className="space-y-1.5 mb-5 text-xs text-slate-300">
                    {serv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://bookfua.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 text-center rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <span>Order via Bookfua</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* BookFUA Online Masterclasses & Academy */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
              <span>BookFUA Online Classes & Masterclasses</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upgrade your skills in AI image editing, CapCut motion graphics, Canva Pro, and social advertising.
            </p>
          </div>

          <a
            href="https://bookfua.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>View Full Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MASTERCLASSES.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-cyan-400">{course.instructor}</span>
                  <span className="font-mono-numbers">{course.duration}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400">{course.level}</span>
                <a
                  href="https://bookfua.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Enroll on Bookfua.com</span>
                  <ExternalLink className="w-3 h-3 text-slate-950" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Hand-Off Request Form to BookFUA & Fuaprint Studios */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-cyan-900/40 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Send className="w-4 h-4" />
            <span>Direct Project Hand-Off to Fuaprint Studios</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-2">
            Send Your 7Camz Studio Asset for Professional Agency Finishing
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Want human video color grading, 8K print preparation, or sponsored ad campaign management? Submit your brief directly to the Fuaprint Studios team via the BookFUA network.
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-200 text-sm font-semibold flex items-center gap-2 max-w-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Project brief sent successfully to BookFUA / Fuaprint Studios team! We will follow up via email within 2 hours.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Requested Agency Service
              </label>
              <select
                value={requestService}
                onChange={(e) => setRequestService(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="video-editing">Commercial Video Post-Production & Color Grading</option>
                <option value="graphic-branding">Brand Identity, Logo & Flyer Suite</option>
                <option value="voice-multilingual">Voice Cloning & Multilingual Dubbing</option>
                <option value="growth-campaigns">Sponsored Ads Setup & Account Growth</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Project Notes & 7Camz Asset Links
              </label>
              <textarea
                rows={3}
                required
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                placeholder="Describe your target deadline, aesthetic requirements, and specifications..."
                className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>NDA & Commercial Copyright Protected · Worldwide Support</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending to Fuaprint...</span>
                ) : (
                  <>
                    <span>Submit to BookFUA Agency</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
