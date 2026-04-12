import React, { useState, useEffect } from 'react';
import { X, Share, Plus, List } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

/* ─── iOS step guide ────────────────────────────────────────────────────────── */

const IOS_STEPS = [
  {
    icon: <Share className="w-7 h-7 text-[#1973AE]" />,
    title: 'Tap the Share button',
    desc: 'At the bottom of your browser',
  },
  {
    icon: <List className="w-7 h-7 text-[#1973AE]" />,
    title: 'Tap "Add to Home Screen"',
    desc: 'Scroll down in the share menu',
  },
  {
    icon: <Plus className="w-7 h-7 text-[#1973AE]" />,
    title: 'Tap "Add"',
    desc: 'WingaPro will appear on your home screen',
  },
];

const IOSGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setStep(s => (s + 1) % IOS_STEPS.length);
        setFading(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const current = IOS_STEPS[step];

  return (
    <>
      {/* Step dots */}
      <div className="flex justify-center gap-1.5 mb-5">
        {IOS_STEPS.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-5 bg-[#1973AE]' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Animated step card */}
      <div
        className={`flex flex-col items-center gap-3 transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          {current.icon}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900 text-sm">{current.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{current.desc}</p>
        </div>
      </div>

      {/* Step counter label */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Step {step + 1} of {IOS_STEPS.length}
      </p>

      <button
        onClick={onDismiss}
        className="mt-5 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
      >
        Don't show again
      </button>
    </>
  );
};

/* ─── Android install card ───────────────────────────────────────────────────── */

const AndroidCard: React.FC<{
  onInstall: () => void;
  onDismiss: () => void;
}> = ({ onInstall, onDismiss }) => (
  <>
    <div className="flex items-center gap-3 mb-4">
      <img
        src="/icons/icon-192.png"
        alt="WingaPro"
        className="w-12 h-12 rounded-2xl shadow-sm"
      />
      <div>
        <p className="font-bold text-gray-900 text-sm leading-tight">WingaPro</p>
        <p className="text-xs text-gray-500">simplify · sell · grow</p>
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
      Install WingaPro for a faster, native-app experience — no browser needed.
    </p>
    <button
      onClick={onInstall}
      className="w-full bg-[#1973AE] hover:bg-[#155e91] active:bg-[#0d4a72] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
    >
      Install App
    </button>
    <button
      onClick={onDismiss}
      className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
    >
      Maybe later
    </button>
  </>
);

/* ─── Root prompt component ──────────────────────────────────────────────────── */

const InstallPrompt: React.FC = () => {
  const { showPrompt, isIOS, canInstall, isInstalled, triggerInstall, dismiss } =
    usePWAInstall();

  // Don't render if installed, not ready to show, or can't offer anything
  if (isInstalled) return null;
  if (!showPrompt) return null;
  if (!isIOS && !canInstall) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9998]"
        onClick={dismiss}
      />

      {/* Bottom sheet — slides up */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-[env(safe-area-inset-bottom,16px)]"
        style={{ animation: 'slideUpSheet 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-5 max-w-sm mx-auto relative">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <p className="text-xs font-medium uppercase tracking-widest text-[#1973AE] mb-4">
            {isIOS ? '📱 Add to Home Screen' : '⚡ Install App'}
          </p>

          {isIOS ? (
            <IOSGuide onDismiss={dismiss} />
          ) : (
            <AndroidCard onInstall={triggerInstall} onDismiss={dismiss} />
          )}
        </div>
      </div>
    </>
  );
};

export default InstallPrompt;
