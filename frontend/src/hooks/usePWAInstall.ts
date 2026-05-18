import { useState, useEffect, useCallback, useRef } from 'react';

const SESSION_DISMISSED_KEY = 'pwa_install_dismissed_session';
const PROMPT_DELAY_MS = 3_000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAInstallReturn {
  showPrompt: boolean;
  isIOS: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  triggerInstall: () => Promise<void>;
  dismiss: () => void;
}

function detectIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream
  );
}

function detectInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

export function usePWAInstall(): UsePWAInstallReturn {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const isIOS = detectIOS();
  const isInstalled = detectInstalled();
  // Only suppress within this session if user already tapped X
  const sessionDismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY) === '1';

  useEffect(() => {
    // Stop showing only when already installed or dismissed this session
    if (isInstalled || sessionDismissed) return;

    // Android — capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show prompt after delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, PROMPT_DELAY_MS);

    // If iOS, we'll still show the guide just without the native prompt
    if (isIOS) {
      setCanInstall(false); // iOS has no programmatic prompt
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [isInstalled, sessionDismissed, isIOS]);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setCanInstall(false);
    setShowPrompt(false);
    // No localStorage — if user uninstalls they'll see the prompt again on next session
    if (outcome === 'dismissed') {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
    }
  }, []);

  const dismiss = useCallback(() => {
    // Only dismiss for this session — reappears on every new visit
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
    setShowPrompt(false);
  }, []);

  return { showPrompt, isIOS, canInstall, isInstalled, triggerInstall, dismiss };
}
