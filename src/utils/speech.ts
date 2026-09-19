export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private isPausedState = false;
  private listeners = new Set<(isSpeaking: boolean, isPaused: boolean) => void>();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public subscribe(callback: (isSpeaking: boolean, isPaused: boolean) => void) {
    this.listeners.add(callback);
    callback(this.isSpeakingState, this.isPausedState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isSpeakingState, this.isPausedState));
  }

  public speak(text: string, rate: number = 0.95) {
    if (!this.synth) return;
    this.stop();

    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return;

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = rate;
    this.utterance.pitch = 1.0;

    this.utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      this.notify();
    };

    this.utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notify();
    };

    this.utterance.onerror = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notify();
    };

    this.synth.speak(this.utterance);
  }

  public pause() {
    if (this.synth && this.isSpeakingState && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notify();
    }
  }
}

export const speechService = new SpeechService();
