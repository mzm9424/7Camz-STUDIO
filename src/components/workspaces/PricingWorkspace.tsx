import React, { useState } from 'react';
import { CREDIT_PLANS } from '../../utils/initialData';
import { CreditPlan } from '../../types';
import { Check, Zap, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingWorkspaceProps {
  currentCredits: number;
  onAddCredits: (amount: number) => void;
}

const FAQS = [
  {
    q: 'Do 7Camz Studio credits ever expire?',
    a: 'No. Purchased credits remain permanently in your studio balance until you choose to render images, videos, voice clones, or music tracks.',
  },
  {
    q: 'Can I use generated media for client work and commercial publishing?',
    a: 'Yes. All assets created in 7Camz-STUDIO come with 100% royalty-free commercial rights for YouTube monetization, commercial films, games, advertising, and streaming platforms.',
  },
  {
    q: 'How are credits deducted across different studios?',
    a: 'Image Studio renders cost between 8-20 credits depending on resolution. Video timelines cost 30 credits. Voice clones and narration cost 10 credits. Full music tracks cost 25 credits. The 16-step sequencer is completely free to experiment with locally in real time!',
  },
  {
    q: 'Can I export stems and raw project files?',
    a: 'Yes. You can export PNG masters, 4K ProRes video cuts, 24-bit WAV music stems (isolated vocals, drums, bass, instruments), and lossless vocal narration clips.',
  },
];

export const PricingWorkspace: React.FC<PricingWorkspaceProps> = ({
  currentCredits,
  onAddCredits,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const handlePurchase = (plan: CreditPlan) => {
    setIsProcessing(true);
    setTimeout(() => {
      onAddCredits(plan.credits);
      setIsProcessing(false);
      setSuccessNote(`Successfully topped up ${plan.credits.toLocaleString()} credits!`);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'],
      });

      setTimeout(() => setSuccessNote(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Transparent One-Time Credit Packs · Zero Recurring Lock-In</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-3 tracking-tight">
          Flexible Studio Credits. No Recurring Lock-In.
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Top up whenever you need compute. Current Studio Balance:{' '}
          <strong className="text-cyan-300 font-mono-numbers">{currentCredits.toLocaleString()} Credits</strong>.
        </p>
      </div>

      {successNote && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/70 text-emerald-200 text-center text-sm font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Credit Pack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 to-[#0e1628] border-cyan-500/80 shadow-2xl shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wider uppercase shadow-md">
                  Most Popular Pack
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 h-8">{plan.tagline}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono-numbers">${plan.price}</span>
                    <span className="text-xs text-slate-400">USD one-time</span>
                  </div>
                  <div className="text-xs font-semibold text-cyan-300 font-mono-numbers mt-1.5">
                    {plan.credits.toLocaleString()} credits <span className="text-slate-400 font-normal">({plan.costPerCredit})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mb-6">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(plan);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  plan.popular
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <span>Refueling Studio...</span>
                ) : (
                  <>
                    <span>Get {plan.credits.toLocaleString()} Credits</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h2 className="text-lg font-bold font-display text-white mb-4">
          Detailed Workstation Capabilities by Tier
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-4">Capability</th>
                <th className="py-3 px-4">Creator Starter ($19)</th>
                <th className="py-3 px-4 text-cyan-400 font-bold">Studio Pro ($49)</th>
                <th className="py-3 px-4">Agency Master ($149)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Image Resolution</td>
                <td className="py-3 px-4">1080p Standard</td>
                <td className="py-3 px-4 font-bold text-cyan-300">4K Ultra HDR</td>
                <td className="py-3 px-4">8K Raw Commercial</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Video Framerate & Duration</td>
                <td className="py-3 px-4">30fps / 5s clips</td>
                <td className="py-3 px-4 font-bold text-cyan-300">60fps / 15s clips</td>
                <td className="py-3 px-4">60fps / Unlimited sequence</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Voice Lab Profiles</td>
                <td className="py-3 px-4">Standard TTS Voices</td>
                <td className="py-3 px-4 font-bold text-cyan-300">Full Voice Clone & Emotion Dials</td>
                <td className="py-3 px-4">Custom Voice Model Training</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Music Studio Output</td>
                <td className="py-3 px-4">MP3 Stereo</td>
                <td className="py-3 px-4 font-bold text-cyan-300">24-Bit WAV + 4 Isolated Stems</td>
                <td className="py-3 px-4">Multi-Track MIDI & Stems</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">LiveCam / OBS Overlays</td>
                <td className="py-3 px-4">Standard LUTs</td>
                <td className="py-3 px-4 font-bold text-cyan-300">Custom Lower-Thirds & Virtual Cam</td>
                <td className="py-3 px-4">Multi-Camera Feed Ingestion</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Commercial Rights</td>
                <td className="py-3 px-4">Included</td>
                <td className="py-3 px-4 font-bold text-cyan-300">Full Commercial License</td>
                <td className="py-3 px-4">Full Enterprise Indemnity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h2 className="text-xl font-bold font-display text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Enterprise Licensing Trust Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-bold text-white mb-1">
            Need Custom Corporate Billing or High-Volume Production Seats?
          </h4>
          <p className="text-xs text-slate-400">
            7Camz-STUDIO provides custom invoice billing, dedicated GPU clusters, and enterprise SLAs for production agencies.
          </p>
        </div>
        <button
          onClick={() => {
            alert('Enterprise team contacted. A studio representative will follow up with custom volume tiers.');
          }}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-700/60 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Contact Enterprise Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
