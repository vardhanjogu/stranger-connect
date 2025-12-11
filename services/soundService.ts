// Singleton AudioContext to prevent browser limits
let audioCtx: AudioContext | null = null;

const getContext = () => {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    // Browser autoplay policy requires resuming on user interaction
    if (audioCtx?.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
};

// Helper to unlock audio on first user interaction
export const initAudio = () => {
    getContext();
};

export type SoundType = 'incoming' | 'outgoing' | 'match' | 'disconnect' | 'error';

export const playSound = (type: SoundType) => {
    try {
        const ctx = getContext();
        if (!ctx) return;
        
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'incoming':
                // High pitch short "Ding" - Crisp and alerting
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
                
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'outgoing':
                // Softer, lower pitch "Pop" - Subtler confirmation
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
                
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                
                osc.start(now);
                osc.stop(now + 0.08);
                break;

            case 'match':
                // Ascending Major Triad (C5 - E5) - Positive "Success" feeling
                // Note 1
                osc.frequency.setValueAtTime(523.25, now); // C5
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);

                // Note 2 (Layered)
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                
                osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
                gain2.gain.setValueAtTime(0.05, now + 0.15);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                
                osc2.start(now + 0.15);
                osc2.stop(now + 0.45);
                break;

            case 'disconnect':
            case 'error':
                // Descending Triangle Wave - "Power down" feeling
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
                
                osc.start(now);
                osc.stop(now + 0.3);
                break;
        }
    } catch (e) {
        console.warn("Audio playback failed", e);
    }
};