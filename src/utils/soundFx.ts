let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtx) return null;

  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  {
    startFreq,
    endFreq,
    durationSec,
    gainPeak,
    delaySec = 0,
    type = 'sine',
  }: {
    startFreq: number;
    endFreq?: number;
    durationSec: number;
    gainPeak: number;
    delaySec?: number;
    type?: OscillatorType;
  }
) {
  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  if (endFreq && endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, endFreq),
      now + durationSec
    );
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec + 0.01);
}

export function playSelectAxisSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playTone(ctx, {
      startFreq: 480,
      endFreq: 660,
      durationSec: 0.075,
      gainPeak: 0.05,
      type: 'sine',
    });
  } catch {
    // Ignore audio synthesis errors
  }
}

export function playNavigateSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playTone(ctx, {
      startFreq: 360,
      endFreq: 420,
      durationSec: 0.045,
      gainPeak: 0.03,
      type: 'triangle',
    });
  } catch {
    // Ignore audio synthesis errors
  }
}

export function playCompleteSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    // Gentle ascending major chord arpeggio (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      playTone(ctx, {
        startFreq: freq,
        durationSec: idx === notes.length - 1 ? 0.26 : 0.14,
        gainPeak: 0.048,
        delaySec: idx * 0.07,
        type: 'sine',
      });
    });
  } catch {
    // Ignore audio synthesis errors
  }
}

export function playCopySound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playTone(ctx, {
      startFreq: 620,
      durationSec: 0.07,
      gainPeak: 0.04,
      delaySec: 0,
      type: 'sine',
    });
    playTone(ctx, {
      startFreq: 860,
      durationSec: 0.1,
      gainPeak: 0.045,
      delaySec: 0.06,
      type: 'sine',
    });
  } catch {
    // Ignore audio synthesis errors
  }
}
