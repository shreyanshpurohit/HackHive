import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// WEB AUDIO SYNTHESIZER FOR RETRO SOUND EFFECTS
// ============================================================================
class SynthSoundManager {
  private ctx: AudioContext | null = null;
  private chargingOsc: OscillatorNode | null = null;
  private chargingGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Quiet fail if AudioContext is blocked
    }
  }

  startCharging() {
    this.init();
    if (!this.ctx) return;
    try {
      this.stopCharging();
      this.chargingOsc = this.ctx.createOscillator();
      this.chargingGain = this.ctx.createGain();

      this.chargingOsc.type = 'sawtooth';
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.chargingOsc.frequency.setValueAtTime(90, this.ctx.currentTime);
      this.chargingGain.gain.setValueAtTime(0.008, this.ctx.currentTime);

      this.chargingOsc.connect(filter);
      filter.connect(this.chargingGain);
      this.chargingGain.connect(this.ctx.destination);

      this.chargingOsc.start();
    } catch (e) {
      // Quiet fail
    }
  }

  updateCharging(ratio: number) {
    if (!this.ctx || !this.chargingOsc || !this.chargingGain) return;
    try {
      const freq = 90 + ratio * 240; // 90Hz -> 330Hz pitch rise
      this.chargingOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);

      const volume = 0.008 + ratio * 0.042;
      this.chargingGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
    } catch (e) {}
  }

  stopCharging() {
    if (this.chargingOsc) {
      try {
        this.chargingOsc.stop();
      } catch (e) {}
      this.chargingOsc = null;
    }
    this.chargingGain = null;
  }

  playLaunch() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playImpact(intensity: number) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, this.ctx.currentTime);

      const vol = Math.min(0.2, intensity * 0.15);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }
}

const synth = new SynthSoundManager();

// ============================================================================
// PARTICLE DEFINITIONS
// ============================================================================
type GameParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'spark' | 'dust' | 'confetti';
  angle?: number;
  angularVel?: number;
};

const LUCKY_DICE_STATS_KEY = 'hackhive_luckydice_stats';

const LuckyDice: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // References for DOM nodes for 60fps manipulation
  const cameraRef = useRef<HTMLDivElement>(null);
  const diceContainerRef = useRef<HTMLDivElement>(null);
  const diceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Local storage statistics
  const [rolls, setRolls] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastValue, setLastValue] = useState<number | null>(null);

  // Roll states
  const [charge, setCharge] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'charging' | 'rolling' | 'settled'>('idle');

  // Animation physical variables (managed in refs to prevent React overhead in animation loop)
  const isHoldingRef = useRef(false);
  const pressTimeRef = useRef(0);
  const chargeRef = useRef(0);
  const gameStateRef = useRef<'idle' | 'charging' | 'rolling' | 'settled'>('idle');

  const yRef = useRef(0);
  const vyRef = useRef(0);
  const rotXRef = useRef(0);
  const rotYRef = useRef(0);
  const rotZRef = useRef(0);
  const rvXRef = useRef(0);
  const rvYRef = useRef(0);
  const rvZRef = useRef(0);

  const targetRotXRef = useRef(0);
  const targetRotYRef = useRef(0);
  const targetRotZRef = useRef(0);

  // Squash and stretch spring state
  const scaleYRef = useRef(1.0);
  const scaleYVelRef = useRef(0.0);

  // Camera shake state
  const shakeIntensityRef = useRef(0);

  // Particle management
  const particlesRef = useRef<GameParticle[]>([]);

  // Sound and timing refs
  const lastTickTimeRef = useRef(0);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LUCKY_DICE_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRolls(parsed.rolls || 0);
        setStreak(parsed.streak || 0);
        setCurrentStreak(parsed.currentStreak || 0);
      }
    } catch (e) {
      console.warn('Failed to load stats from localStorage', e);
    }
  }, []);

  // Save stats to localStorage
  const saveStats = (newRolls: number, newStreak: number, newCurrentStreak: number) => {
    try {
      localStorage.setItem(
        LUCKY_DICE_STATS_KEY,
        JSON.stringify({ rolls: newRolls, streak: newStreak, currentStreak: newCurrentStreak })
      );
    } catch (e) {}
  };

  // Keyboard integration: Space to roll
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (gameStateRef.current === 'idle' || gameStateRef.current === 'settled') {
          if (!isHoldingRef.current) {
            isHoldingRef.current = true;
            pressTimeRef.current = Date.now();
            gameStateRef.current = 'charging';
            setGameState('charging');
            synth.startCharging();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (isHoldingRef.current && gameStateRef.current === 'charging') {
          triggerLaunch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  // Press down button/screen
  const handlePressStart = () => {
    if (gameStateRef.current === 'idle' || gameStateRef.current === 'settled') {
      isHoldingRef.current = true;
      pressTimeRef.current = Date.now();
      gameStateRef.current = 'charging';
      setGameState('charging');
      synth.startCharging();
    }
  };

  // Release button/screen
  const handlePressEnd = () => {
    if (isHoldingRef.current && gameStateRef.current === 'charging') {
      triggerLaunch();
    }
  };

  // Launch the dice
  const triggerLaunch = () => {
    isHoldingRef.current = false;
    synth.stopCharging();

    const holdDuration = Date.now() - pressTimeRef.current;
    let finalCharge = chargeRef.current;

    // If it was a quick tap, give a generous default charge
    if (holdDuration < 150) {
      finalCharge = 0.5;
    }

    synth.playLaunch();

    // Physics init
    yRef.current = -5;
    // Launch speed is proportional to charge
    vyRef.current = -12 - finalCharge * 12;

    // Huge initial spin velocities
    rvXRef.current = 15 + Math.random() * 25 + finalCharge * 15;
    rvYRef.current = 15 + Math.random() * 25 + finalCharge * 15;
    rvZRef.current = 10 + Math.random() * 15 + finalCharge * 10;

    // Pick target roll (1 to 6)
    const rolledNum = Math.floor(Math.random() * 6) + 1;

    // Compute base rotation targets for the face to align perfectly facing front
    let baseRotX = 0;
    let baseRotY = 0;
    let baseRotZ = 0;

    if (rolledNum === 1) { baseRotX = 0; baseRotY = 0; }
    else if (rolledNum === 6) { baseRotX = 0; baseRotY = 180; }
    else if (rolledNum === 2) { baseRotX = -90; baseRotY = 0; }
    else if (rolledNum === 5) { baseRotX = 90; baseRotY = 0; }
    else if (rolledNum === 3) { baseRotX = 0; baseRotY = -90; }
    else if (rolledNum === 4) { baseRotX = 0; baseRotY = 90; }

    // Store absolute target values (add random integer spins so it spins beautifully around all axes)
    const spinsX = Math.floor(Math.random() * 3 + 3) * 360;
    const spinsY = Math.floor(Math.random() * 3 + 3) * 360;
    const spinsZ = Math.floor(Math.random() * 2 + 2) * 360;

    targetRotXRef.current = baseRotX + spinsX;
    targetRotYRef.current = baseRotY + spinsY;
    targetRotZRef.current = baseRotZ + spinsZ;

    // Reset current rotation positions relative to start so there isn't a rotation snap
    rotXRef.current = rotXRef.current % 360;
    rotYRef.current = rotYRef.current % 360;
    rotZRef.current = rotZRef.current % 360;

    // Update state
    gameStateRef.current = 'rolling';
    setGameState('rolling');

    // Stats updates
    const nextRolls = rolls + 1;
    setRolls(nextRolls);

    let nextCurrentStreak = currentStreak;
    let nextBestStreak = streak;

    if (rolledNum === 6) {
      nextCurrentStreak += 1;
      if (nextCurrentStreak > nextBestStreak) {
        nextBestStreak = nextCurrentStreak;
      }
    } else {
      nextCurrentStreak = 0;
    }

    setLastValue(rolledNum);
    setStreak(nextBestStreak);
    setCurrentStreak(nextCurrentStreak);
    saveStats(nextRolls, nextBestStreak, nextCurrentStreak);
  };

  // Spark burst helper
  const spawnChargingSparks = (canvasWidth: number, canvasHeight: number) => {
    // sparks converge from outer area to center base of dice
    const diceCenterX = canvasWidth / 2;
    const diceCenterY = canvasHeight / 2 + 30; // base landing pad
    
    const count = 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 70;
      const sparkX = diceCenterX + Math.cos(angle) * radius;
      const sparkY = diceCenterY + Math.sin(angle) * radius;

      const speed = 1.5 + Math.random() * 2.5;
      
      particlesRef.current.push({
        x: sparkX,
        y: sparkY,
        vx: -Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
        color: '#39ff14', // neon green
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        type: 'spark'
      });
    }
  };

  // Impact dust / circle wave helper
  const spawnImpactEffects = (canvasWidth: number, canvasHeight: number, intensity: number) => {
    const diceCenterX = canvasWidth / 2;
    const diceCenterY = canvasHeight / 2 + 30;

    // 1. Ring waves (shockwaves)
    const waveCount = 1 + Math.floor(intensity * 2);
    for (let w = 0; w < waveCount; w++) {
      particlesRef.current.push({
        x: diceCenterX,
        y: diceCenterY,
        vx: 0,
        vy: 0,
        size: 5 + w * 10, // initial radius
        color: '#ffffff',
        alpha: 0.6 / (w + 1),
        decay: 0.04 - w * 0.01,
        type: 'spark' // reusing spark rendering logic for growing ring
      });
    }

    // 2. Outward dust sparks
    const particleCount = 15 + Math.floor(intensity * 20);
    for (let p = 0; p < particleCount; p++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 8) * intensity;
      particlesRef.current.push({
        x: diceCenterX,
        y: diceCenterY - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // shoot slightly up
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.4 ? '#ffffff' : '#39ff14',
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        type: 'dust'
      });
    }
  };

  // Falling confetti helper (only on rolling a 6)
  const spawnConfettiBurst = (canvasWidth: number, canvasHeight: number) => {
    const colors = ['#39ff14', '#00e5ff', '#ff007f', '#ffffff'];
    const count = 80;
    
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * canvasWidth,
        y: -20 - Math.random() * 50,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        size: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.005 + Math.random() * 0.01,
        type: 'confetti',
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.2
      });
    }
  };

  // Main 60 FPS physics & rendering loop
  useEffect(() => {
    if (!isPlaying) return;

    let frameId: number;

    const loop = () => {
      // 1. CHARGING STATE UPDATES
      if (gameStateRef.current === 'charging' && isHoldingRef.current) {
        const elapsed = Date.now() - pressTimeRef.current;
        // fully charges in 1200ms
        const progress = Math.min(1.0, elapsed / 1200);
        chargeRef.current = progress;
        setCharge(progress);

        synth.updateCharging(progress);

        // Shake the dice intensely during charging (anticipation)
        shakeIntensityRef.current = progress * 4;
      } else {
        if (gameStateRef.current !== 'rolling') {
          shakeIntensityRef.current *= 0.9; // decay shake
        }
      }

      // 2. PHYSICS RESOLUTION (ROLLING)
      if (gameStateRef.current === 'rolling') {
        const gravity = 0.55;
        vyRef.current += gravity;
        yRef.current += vyRef.current;

        // Dice rotation
        rotXRef.current += rvXRef.current;
        rotYRef.current += rvYRef.current;
        rotZRef.current += rvZRef.current;

        // Sound clicks when rotating significantly
        const currentRotSum = rotXRef.current + rotYRef.current;
        if (Math.abs(currentRotSum - lastTickTimeRef.current) > 130) {
          synth.playClick();
          lastTickTimeRef.current = currentRotSum;
        }

        // As the dice falls back down, damp rotation and snap to the target final face alignment
        if (vyRef.current > 0) {
          // rotational velocity dampening
          rvXRef.current *= 0.94;
          rvYRef.current *= 0.94;
          rvZRef.current *= 0.94;

          // height-based angular snapping factor
          // yRef is negative upwards, 0 is impact
          const heightFactor = Math.max(0, Math.min(1, (120 + yRef.current) / 120));
          if (heightFactor > 0) {
            rotXRef.current = rotXRef.current * (1 - heightFactor * 0.1) + targetRotXRef.current * (heightFactor * 0.1);
            rotYRef.current = rotYRef.current * (1 - heightFactor * 0.1) + targetRotYRef.current * (heightFactor * 0.1);
            rotZRef.current = rotZRef.current * (1 - heightFactor * 0.1) + targetRotZRef.current * (heightFactor * 0.1);
          }
        }

        // 3. COLLISION WITH GROUND (LANDING IMPACT)
        if (yRef.current >= 0) {
          yRef.current = 0;

          const bounceElasticity = 0.42;
          const impactSpeed = vyRef.current;

          vyRef.current = -vyRef.current * bounceElasticity;

          if (Math.abs(vyRef.current) < 1.6) {
            // Settled completely!
            vyRef.current = 0;
            rvXRef.current = 0;
            rvYRef.current = 0;
            rvZRef.current = 0;
            
            // Lock perfectly to target alignment angles
            rotXRef.current = targetRotXRef.current;
            rotYRef.current = targetRotYRef.current;
            rotZRef.current = targetRotZRef.current;

            gameStateRef.current = 'settled';
            setGameState('settled');

            // Trigger confetti burst on a 6!
            if (canvasRef.current && lastValue === 6) {
              spawnConfettiBurst(canvasRef.current.width, canvasRef.current.height);
            }
          }

          // Trigger landing effects if impact speed is meaningful
          if (impactSpeed > 2 && canvasRef.current) {
            const normalizedImpact = Math.min(1.0, impactSpeed / 20);
            
            // Squash and Stretch equation: Y squashes down, X stretches wide
            scaleYRef.current = 1.0 - normalizedImpact * 0.35;
            scaleYVelRef.current = 0;

            // Audio thud
            synth.playImpact(normalizedImpact);

            // Shake camera based on landing speed
            shakeIntensityRef.current = normalizedImpact * 12;

            // Particles burst on pad
            spawnImpactEffects(canvasRef.current.width, canvasRef.current.height, normalizedImpact);
          }
        }
      }

      // 4. FLOATING IDLE ANIMATION (WHEN WAITING)
      if (gameStateRef.current === 'idle' || gameStateRef.current === 'settled') {
        const time = Date.now();
        // subtle bobbing upwards
        yRef.current = Math.sin(time * 0.0035) * 6;
        // gentle drift rotational sway
        rotXRef.current = rotXRef.current * 0.95 + (targetRotXRef.current + Math.sin(time * 0.0018) * 4) * 0.05;
        rotYRef.current = rotYRef.current * 0.95 + (targetRotYRef.current + Math.cos(time * 0.0014) * 5) * 0.05;
        rotZRef.current = rotZRef.current * 0.95 + (targetRotZRef.current + Math.sin(time * 0.0011) * 3) * 0.05;
      }

      // 5. SPRING SOLVER FOR SQUASH AND STRETCH
      if (gameStateRef.current !== 'rolling' || yRef.current === 0) {
        const springTension = 0.16;
        const springDamping = 0.78;
        const displacement = 1.0 - scaleYRef.current;
        
        scaleYVelRef.current += displacement * springTension;
        scaleYVelRef.current *= springDamping;
        scaleYRef.current += scaleYVelRef.current;
      } else {
        // Stretching while flying high in the air
        const flightStretch = Math.min(0.2, Math.abs(vyRef.current) * 0.015);
        scaleYRef.current = 1.0 + flightStretch;
      }

      // 6. APPLY PHYSICAL RENDERING TO DOM STYLES (Buttery smooth 3d transforms)
      if (diceContainerRef.current) {
        const activeShake = shakeIntensityRef.current;
        const shakeX = (Math.random() - 0.5) * activeShake;
        const shakeY = (Math.random() - 0.5) * activeShake;

        // TranslateY includes: bounce height, floating idle offset, and impact shake Y
        const translateY = yRef.current + shakeY;
        const scaleY = scaleYRef.current;
        const scaleX = 2.0 - scaleY; // keep volume roughly conserved

        diceContainerRef.current.style.transform = `translate3d(${shakeX}px, ${translateY}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`;
      }

      if (diceRef.current) {
        diceRef.current.style.transform = `rotateX(${rotXRef.current}deg) rotateY(${rotYRef.current}deg) rotateZ(${rotZRef.current}deg)`;
      }

      // 7. CANVAS PARTICLE RENDERING
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Spawn ambient charging sparks
          if (gameStateRef.current === 'charging' && Math.random() > 0.1) {
            spawnChargingSparks(canvas.width, canvas.height);
          }

          // Update & draw particles
          const particles = particlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              particles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;

            if (p.type === 'spark') {
              // expanding ring wave or converging spark
              ctx.beginPath();
              if (p.vx === 0 && p.vy === 0) {
                // expanding ring
                p.size += 2.5; // grow ring size
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
              } else {
                // small spark dot
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 4;
                ctx.fill();
              }
            } else if (p.type === 'dust') {
              // physical dust sparks with subtle deceleration
              p.vx *= 0.93;
              p.vy *= 0.93;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 3;
              ctx.fill();
            } else if (p.type === 'confetti' && p.angle !== undefined && p.angularVel !== undefined) {
              // falling tumbling rectangle confetti
              p.vy += 0.05; // tiny gravity
              p.vx *= 0.98; // terminal wind drag
              p.angle += p.angularVel;

              ctx.translate(p.x, p.y);
              ctx.rotate(p.angle);
              
              // tumble scale
              const tumbleX = Math.sin(p.angle);
              ctx.scale(tumbleX, 1);

              ctx.fillStyle = p.color;
              ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }

            ctx.restore();
          }
        }
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, lastValue]);

  // Adjust canvas size to parent bounds
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isPlaying]);

  return (
    <div className="w-full h-full relative cursor-crosshair flex justify-center items-center overflow-hidden">
      {!isPlaying ? (
        <button
          type="button"
          className="absolute inset-0 flex flex-col items-center justify-center bg-black hover:bg-white/5 transition duration-300"
          onClick={() => {
            setIsPlaying(true);
            synth.init();
          }}
          data-hover="true"
        >
          <h2 className="text-xl md:text-3xl font-mono uppercase tracking-[0.3em] font-bold text-white group-hover:text-green-400 transition-colors">
            INITIALIZE_CORE_ROLLER
          </h2>
          <span className="text-[10px] md:text-xs font-mono tracking-[0.15em] text-gray-500 mt-4 uppercase">
            // tactile mechanical roll system
          </span>
        </button>
      ) : (
        <div ref={cameraRef} className="w-full h-full relative flex flex-col justify-between p-6 bg-black">
          {/* TOP BAR STATUS PANEL */}
          <div className="w-full border-b border-white/10 pb-4 flex justify-between items-center font-mono text-[10px] md:text-xs text-gray-400">
            <div className="flex gap-4">
              <span>ROLLS: <strong className="text-white font-bold">{rolls}</strong></span>
              <span>STREAK (6s): <strong className="text-white font-bold">{currentStreak}</strong></span>
              <span>BEST_STREAK: <strong className="text-green-400 font-bold">{streak}</strong></span>
            </div>
            <div className="hidden sm:block text-gray-500 tracking-wider">
              KEY_BIND: [SPACE]
            </div>
          </div>

          {/* MAIN 3D PHYSICAL PLAYGROUND STAGE */}
          <div className="relative flex-grow w-full flex items-center justify-center overflow-hidden">
            {/* CANVAS FOR DUST, SPARKS, RING SHOCKWAVES, CONFETTI */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 block" />

            {/* NEON TARGET LANDING PAD BASE */}
            <div className="absolute w-[180px] h-[50px] bg-transparent border border-white/10 rounded-[50%] flex items-center justify-center transform translate-y-[30px] pointer-events-none">
              <div className="w-[140px] h-[36px] border border-white/5 border-dashed rounded-[50%] animate-[pulse-opacity_3s_infinite]" />
              <div className="absolute w-[20px] h-[20px] border border-green-500/10 rounded-full blur-[4px]" />
            </div>

            {/* INTERACTIVE 3D DICE CONTAINER WITH HEIGHT AND SPRING TRANSLATION */}
            <div
              ref={diceContainerRef}
              className="relative w-[100px] h-[100px] flex items-center justify-center pointer-events-none select-none z-20"
              style={{ perspective: '800px' }}
            >
              {/* 3D ROTATION TRANSFORM BOX */}
              <div
                ref={diceRef}
                className="w-[80px] h-[80px] relative transition-transform duration-[40ms] ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
                }}
              >
                {/* DICE FACES */}
                {/* FACE 1 (FRONT) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateY(0deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>

                {/* FACE 6 (BACK) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-2 items-center justify-items-center shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateY(180deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                </div>

                {/* FACE 2 (TOP) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl p-3 flex flex-col justify-between items-center shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateX(90deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full self-start shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full self-end shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                </div>

                {/* FACE 5 (BOTTOM) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl p-2.5 flex flex-col justify-between shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateX(-90deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full align-center self-center shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>

                {/* FACE 3 (RIGHT) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl p-2.5 flex flex-col justify-between shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateY(90deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full self-start shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full self-center shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full self-end shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                </div>

                {/* FACE 4 (LEFT) */}
                <div
                  className="absolute inset-0 bg-[#070707] border border-white/20 rounded-xl p-2.5 flex flex-col justify-between shadow-[inset_0_0_15px_rgba(255,255,255,0.06),0_0_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'rotateY(-90deg) translateZ(40px)', backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC RETRO TEXT ALERTS */}
            <div className="absolute top-4 inset-x-0 flex flex-col items-center pointer-events-none select-none">
              {gameState === 'charging' && (
                <div className="font-mono text-xs text-green-400 uppercase tracking-[0.2em] bg-black/60 px-3 py-1 border border-green-500/30">
                  CHARGING_FORCE: {Math.round(charge * 100)}%
                </div>
              )}
              {gameState === 'settled' && lastValue !== null && (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-white bg-black/80 px-3 py-1 border border-white/10 animate-pulse">
                    ROLLED_NUMBER: <strong className="text-white text-sm">{lastValue}</strong>
                  </div>
                  {lastValue === 6 && (
                    <div className="font-mono text-[10px] text-green-400 uppercase tracking-[0.3em] bg-green-500/10 border border-green-400/40 px-2 py-0.5 mt-1 animate-bounce">
                      ★ CRITICAL_HIT ★
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LOWER CONTROLS & CHARGING PROGRESS BAR */}
          <div className="w-full flex flex-col items-center gap-4 z-20">
            {/* FORCE CHARGE GAUGE */}
            <div className="w-full max-w-[280px] h-[6px] border border-white/10 bg-black p-[1px] relative overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-[30ms] ease-out shadow-[0_0_10px_#39ff14]"
                style={{ width: `${charge * 100}%` }}
              />
            </div>

            {/* MECHANICAL PRESS_AND_HOLD CONTROLLER */}
            <button
              type="button"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={(e) => { e.preventDefault(); handlePressStart(); }}
              onTouchEnd={(e) => { e.preventDefault(); handlePressEnd(); }}
              disabled={gameState === 'rolling'}
              className={`w-full max-w-[280px] py-4 border text-xs font-mono tracking-[0.25em] uppercase transition-all duration-150 select-none cursor-pointer ${
                gameState === 'rolling'
                  ? 'border-white/5 bg-transparent text-gray-600 cursor-not-allowed'
                  : 'border-white/20 bg-transparent text-white hover:bg-white hover:text-black active:scale-[0.98]'
              }`}
            >
              {gameState === 'rolling' ? 'ROLLING_ACTIVE' : 'PRESS_HOLD_TO_ROLL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDice;
