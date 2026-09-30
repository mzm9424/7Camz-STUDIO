import React, { useState } from 'react';
import { CREDIT_PLANS } from '../utils/initialData';
import { CreditPlan } from '../types';
import { X, Check, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  onAddCredits: (amount: number) => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  currentCredits,
  onAddCredits,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = (plan: CreditPlan) => {
    setIsProcessing(true);
    setTimeout(() => {
      onAddCredits(plan.credits);
      setIsProcessing(false);
      setSuccessMessage(`Successfully added ${plan.credits.toLocaleString()} credits to your studio balance!`);

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'],
      });

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0c121e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>One-Time Credit Packs · No Forced Subscriptions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
            Fuel Your 7Camz Multimedia Workstation
          </h2>
          <p className="text-sm text-slate-400">
            Current balance: <strong className="font-mono-numbers text-amber-300">{currentCredits.toLocaleString()} Credits</strong>.
            Credits never expire and work universally across Image, Video, Voice & Music tools.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-center font-medium text-sm flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {CREDIT_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex flex-col justify-between p-6 rounded-xl border transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 to-[#0e1628] border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 h-8">{plan.tagline}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-mono-numbers">${plan.price}</span>
                      <span className="text-xs text-slate-400">USD one-time</span>
                    </div>
                    <div className="text-xs font-semibold text-cyan-300 font-mono-numbers mt-1">
                      {plan.credits.toLocaleString()} credits <span className="text-slate-400 font-normal">({plan.costPerCredit})</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(plan);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <span>Processing Pack...</span>
                  ) : (
                    <>
                      <span>Get {plan.credits.toLocaleString()} Credits</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer guarantee */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Instant balance credit · Commercial rights on all renders · 30-day money-back</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Accepted: Stripe, PayPal, Apple Pay, Google Pay</span>
          </div>
        </div>
      </div>
    </div>
  );
};
