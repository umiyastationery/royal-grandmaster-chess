/**
 * Sound Effects System for Chess Master
 * Provides royal-themed audio feedback using Web Audio API
 */

export class SoundEffects {
  private static audioContext: AudioContext | null = null;
  
  private static getAudioContext(): AudioContext | null {
    if (!SoundEffects.audioContext && 'AudioContext' in window) {
      try {
        SoundEffects.audioContext = new AudioContext();
      } catch (error) {
        console.warn('AudioContext not supported', error);
        return null;
      }
    }
    return SoundEffects.audioContext;
  }

  /**
   * Creates a heavy thud sound effect suitable for chess piece moves
   * Combines low-frequency impact with royal resonance
   */
  static playChessMoveThud(volume: number = 0.8): void {
    const audioContext = SoundEffects.getAudioContext();
    if (!audioContext) return;

    // Resume audio context if suspended (required for user interaction)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const duration = 0.6; // 600ms for a satisfying thud

    // Create oscillators for a rich, heavy thud
    const lowFreq = audioContext.createOscillator();
    const midFreq = audioContext.createOscillator();
    const highFreq = audioContext.createOscillator();
    
    // Create gain nodes for volume control and envelope shaping
    const lowGain = audioContext.createGain();
    const midGain = audioContext.createGain();
    const highGain = audioContext.createGain();
    const masterGain = audioContext.createGain();

    // Create a filter for more realistic impact sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    // Set frequencies for a heavy, wooden chess piece sound
    lowFreq.frequency.setValueAtTime(60, now); // Deep bass thud
    midFreq.frequency.setValueAtTime(120, now); // Body resonance
    highFreq.frequency.setValueAtTime(240, now); // Surface impact

    // Use different waveforms for texture
    lowFreq.type = 'sine'; // Deep, clean bass
    midFreq.type = 'triangle'; // Warm mid-range
    highFreq.type = 'square'; // Sharp attack

    // Create dynamic envelope for realistic impact
    // Sharp attack, then exponential decay
    lowGain.gain.setValueAtTime(0, now);
    lowGain.gain.linearRampToValueAtTime(volume * 0.8, now + 0.01);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    midGain.gain.setValueAtTime(0, now);
    midGain.gain.linearRampToValueAtTime(volume * 0.6, now + 0.005);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

    highGain.gain.setValueAtTime(0, now);
    highGain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.002);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.3);

    // Master volume control
    masterGain.gain.setValueAtTime(volume, now);

    // Connect the audio graph
    lowFreq.connect(lowGain);
    midFreq.connect(midGain);
    highFreq.connect(highGain);
    
    lowGain.connect(filter);
    midGain.connect(filter);
    highGain.connect(masterGain);
    
    filter.connect(masterGain);
    masterGain.connect(audioContext.destination);

    // Start and stop the oscillators
    lowFreq.start(now);
    midFreq.start(now);
    highFreq.start(now);
    
    lowFreq.stop(now + duration);
    midFreq.stop(now + duration);
    highFreq.stop(now + duration);

    // Cleanup
    setTimeout(() => {
      try {
        lowFreq.disconnect();
        midFreq.disconnect();
        highFreq.disconnect();
        lowGain.disconnect();
        midGain.disconnect();
        highGain.disconnect();
        masterGain.disconnect();
        filter.disconnect();
      } catch (error) {
        // Ignore cleanup errors
      }
    }, (duration * 1000) + 100);
  }

  /**
   * Play a lighter click sound for piece selection
   */
  static playPieceSelect(volume: number = 0.4): void {
    const audioContext = SoundEffects.getAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const duration = 0.15;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + duration);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);

    setTimeout(() => {
      try {
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (error) {
        // Ignore cleanup errors
      }
    }, (duration * 1000) + 50);
  }

  /**
   * Play check/checkmate alert sound
   */
  static playCheckAlert(volume: number = 0.7): void {
    const audioContext = SoundEffects.getAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const noteDuration = 0.2;
    const frequencies = [523, 659, 784]; // C, E, G chord

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.setValueAtTime(freq, now + index * 0.1);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, now + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + index * 0.1 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + noteDuration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + noteDuration);
    });
  }
}