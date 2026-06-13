import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const loadingLines = [
  'Inicializando missão especial...',
  'Calculando chance de um date perfeito...',
  'Carregando coragem...',
  'Preparando sushi...',
  'Ativando modo romântico...',
  'Missão pronta.',
];

const inviteLines = [
  'Nicolle, tenho uma missão para você.',
  'Uma missão extremamente importante.',
  'O mundo depende da sua resposta.',
  'Você aceita sair comigo?',
];

const copy = {
  destinationTitle: 'Missão aceita.',
  destinationSubtitle: 'Seu próximo objetivo é:',
  restaurant: 'Natori Sushi',
  salesText:
    'Chegamos ao local escolhido para a missão.\n\nO Natori Sushi é aquele tipo de lugar que já chega com clima de ocasião especial: comida boa, ambiente acolhedor e uma energia perfeita para uma noite leve com você.\n\nPensei nesse lugar porque combina com a gente:\n\n🍣 Sushi delicioso\n✨ Ambiente agradável\n❤️ Boa companhia\n🎯 Chance alta de virar uma lembrança daquelas\n\nSe você topar, eu prometo caprichar no resto da missão.',
  confirmText: 'Toque na foto para concluir.',
  missionComplete: 'MISSION COMPLETE',
  missionSubtext: 'Date aceito com sucesso.',
  finaleText: 'Obrigado por aceitar essa missão comigo, Nicolle ❤️',
};

const scenes = {
  boot: 'boot',
  invite: 'invite',
  sushi: 'sushi',
  destination: 'destination',
  complete: 'complete',
};

const getRandom = (min, max) => Math.random() * (max - min) + min;
const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        id: index,
        left: `${getRandom(0, 100)}%`,
        size: getRandom(10, 20),
        duration: getRandom(10, 18),
        delay: getRandom(0, 8),
        opacity: getRandom(0.12, 0.35),
      })),
    [],
  );

  return (
    <div className="ambient-layer" aria-hidden="true">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
          }}
          animate={{
            y: [30, -120, -240],
            x: [0, getRandom(-20, 20), getRandom(-10, 10)],
            scale: [0.8, 1.1, 0.9],
            rotate: [0, 12, -8],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />
      ))}
      <div className="noise" />
      <div className="glow glow-left" />
      <div className="glow glow-right" />
    </div>
  );
}

function BootScene({ progress, line, done }) {
  return (
    <section className="scene scene-boot">
      <FloatingHearts />
      <motion.div
        className="boot-stack"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="boot-video-shell">
          <div className="orb-ring" />
          <video
            className="boot-video"
            src={asset('heart-intro.mp4')}
            autoPlay
            muted
            loop={!done}
            playsInline
            preload="auto"
          />
        </div>

        <motion.div
          className="glass-card boot-card"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          <p className="eyebrow">Boot sequence</p>
          <h1>Missão especial em preparação</h1>
          <p className="boot-line">{line}</p>

          <div className="progress-shell" aria-label="Carregamento da missão">
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              />
              <div className="progress-sheen" />
            </div>
            <div className="progress-meta">
              <span>Inicialização</span>
              <strong>{Math.round(progress)}%</strong>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.p
                key="ready"
                className="status-ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Acesso liberado <span>❤️</span>
              </motion.p>
            ) : (
              <motion.p
                key="waiting"
                className="status-muted"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Protegendo a surpresa.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}

function InviteScene({ onYes, noState, onNoPointer, onNoTouch, attempts, trashVisible, noGone, inviteStep }) {
  return (
    <section className="scene scene-invite">
      <FloatingHearts />
      <motion.div
        className="glass-card invite-card"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">Convite confidencial</p>
        <div className="invite-copy">
          {inviteLines.map((line, index) => (
            <motion.h2
              key={line}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: index <= inviteStep ? 1 : 0, y: index <= inviteStep ? 0 : 10 }}
              transition={{ duration: 0.5 }}
            >
              {line}
            </motion.h2>
          ))}
        </div>

        <p className="subcopy">
          A resposta certa é simples. Mas o sistema insiste em testar sua determinação.
        </p>

        <div className="decision-stage">
          <button className="yes-button" onClick={onYes} type="button">
            SIM <span>❤️</span>
          </button>

          {!noGone && (
            <motion.button
              type="button"
              className="no-button"
              onPointerEnter={onNoPointer}
              onFocus={onNoPointer}
              onTouchStart={onNoTouch}
              style={noState.style}
              animate={noState.animate}
              transition={noState.transition}
            >
              NÃO <span>💀</span>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {trashVisible && (
            <motion.div
              className="trash-zone"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="trash-icon">🗑</div>
              <p>Respostas incorretas vão para cá.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {noGone && (
            <motion.p
              className="resolved-note"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Problema resolvido.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="attempts">
          <span>Tentativas evasivas: {attempts}</span>
        </div>
      </motion.div>
    </section>
  );
}

function SushiTransitionScene() {
  return (
    <section className="scene scene-sushi">
      <FloatingHearts />
      <div className="transition-dark" />
      <motion.div
        className="sushi-cinematic"
        initial={{ scale: 0.88, opacity: 0, y: 22 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cinema-frame">
          <video className="cinema-video" src={asset('sushi-jump.mp4')} autoPlay muted playsInline />
          <div className="cinema-overlay" />
          <div className="cinema-sparks">
            {Array.from({ length: 14 }).map((_, index) => (
              <span key={index} style={{ ['--delay']: `${index * 0.08}s` }} />
            ))}
          </div>
        </div>
        <p className="cinema-caption">Sushi executando salto de precisão.</p>
      </motion.div>
    </section>
  );
}

function SushiPlatter() {
  return (
    <div className="sushi-platter" aria-hidden="true">
      <img className="sushi-image" src={asset('natori.png')} alt="" />
      <div className="sushi-glow" />
    </div>
  );
}

function DestinationScene({ onConfirm }) {
  return (
    <section className="scene scene-destination">
      <FloatingHearts />
      <motion.div
        className="destination-shell"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">Objetivo final</p>
        <h2 className="destination-title">{copy.destinationTitle}</h2>
        <p className="destination-subtitle">{copy.destinationSubtitle}</p>
        <h3 className="restaurant-name">{copy.restaurant}</h3>

        <div className="destination-showcase">
          <SushiPlatter />
          <div className="neon-arrows" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="sales-card">
          {copy.salesText.split('\n').map((line, index) => (
            <p key={`${line}-${index}`}>{line || '\u00a0'}</p>
          ))}
        </div>

        <div className="confirm-zone">
          <p className="confirm-text">{copy.confirmText}</p>
          <button className="sushi-confirm" type="button" onClick={onConfirm} aria-label="Concluir missão">
            <SushiPlatter />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function CompleteScene({ onReplay }) {
  return (
    <section className="scene scene-complete">
      <FloatingHearts />
      <div className="complete-overlay" />
      <motion.div
        className="complete-shell"
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="complete-aura" />
        <p className="eyebrow">Status final</p>
        <motion.h2
          className="mission-complete"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.missionComplete}
        </motion.h2>
        <p className="complete-subtext">{copy.missionSubtext}</p>

        <div className="memory-frame">
          <div className="memory-photo">
            <img className="couple-photo" src={asset('casal.jpeg')} alt="Foto do casal" />
            <div className="memory-photo-inner">
              <span>nosso-date.jpg</span>
              <strong>Um instante que merece virar memória</strong>
            </div>
          </div>
          <p className="memory-caption">A foto de vocês agora aparece no encerramento da missão.</p>
        </div>

        <p className="final-message">{copy.finaleText}</p>

        <button className="replay-button" type="button" onClick={onReplay}>
          Ver novamente
        </button>
      </motion.div>
    </section>
  );
}

export default function App() {
  const [scene, setScene] = useState(scenes.boot);
  const [progress, setProgress] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [inviteStep, setInviteStep] = useState(0);
  const [noState, setNoState] = useState({
    style: { transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)' },
    animate: { x: 0, y: 0, rotate: 0, scale: 1 },
    transition: { duration: 0.22, ease: 'easeOut' },
  });
  const [attempts, setAttempts] = useState(0);
  const [trashVisible, setTrashVisible] = useState(false);
  const [noGone, setNoGone] = useState(false);
  const progressTimerRef = useRef(null);
  const invitationTimerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (scene !== scenes.boot) {
      return undefined;
    }

    const startedAt = performance.now();
    const lineInterval = window.setInterval(() => {
      setLoadingIndex((current) => Math.min(current + 1, loadingLines.length - 1));
    }, 1000);

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const next = Math.min(100, (elapsed / 6200) * 100);
      setProgress(next);

      if (next >= 100) {
        window.clearInterval(progressTimerRef.current);
        window.clearInterval(lineInterval);
        setBootDone(true);
        window.setTimeout(() => setScene(scenes.invite), 650);
      }
    }, 80);

    return () => {
      window.clearInterval(lineInterval);
      window.clearInterval(progressTimerRef.current);
    };
  }, [scene]);

  useEffect(() => {
    if (scene !== scenes.invite) {
      return undefined;
    }

    setInviteStep(0);
    setAttempts(0);
    setTrashVisible(false);
    setNoGone(false);

    const timers = [
      window.setTimeout(() => setInviteStep(1), 1000),
      window.setTimeout(() => setInviteStep(2), 2000),
      window.setTimeout(() => setInviteStep(3), 3000),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [scene]);

  useEffect(() => {
    if (scene !== scenes.complete) {
      return undefined;
    }

    const audio = new Audio(asset('gta-mission-complete.mp3'));
    audio.volume = 0.9;
    audio.play().catch(() => {
      /* autoplay can be blocked, and that's fine */
    });
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [scene]);

  useEffect(() => {
    if (scene !== scenes.destination) {
      return undefined;
    }

    const sushiSound = new Audio(asset('gta-mission-complete.mp3'));
    sushiSound.volume = 0.15;
    audioRef.current = sushiSound;
    return () => {
      sushiSound.pause();
      sushiSound.currentTime = 0;
    };
  }, [scene]);

  const currentLoadingLine = loadingLines[loadingIndex];
  const fleeNo = (event) => {
    event.preventDefault();
    if (noGone) {
      return;
    }

    setAttempts((current) => {
      const nextAttempts = current + 1;

      const x = getRandom(-160, 160);
      const y = getRandom(-90, 90);
      const rotate = getRandom(-18, 18);
      const scale = nextAttempts > 6 ? 0.75 : getRandom(0.88, 1);
      const duration = nextAttempts > 4 ? 0.12 : 0.22;

      const variant =
        nextAttempts % 6 === 0
          ? { x, y, rotate, scale, filter: 'saturate(1.2)' }
          : nextAttempts % 5 === 0
            ? { x: x * 0.6, y: y * 0.6, rotate: rotate * 1.8, scale: 0.76 }
            : nextAttempts % 4 === 0
              ? { x: x * 1.15, y: y * 0.3, rotate: rotate * 2, scale: 0.84 }
              : nextAttempts % 3 === 0
                ? { x: x * 0.8, y: y * 1.15, rotate: rotate * -1.5, scale: 0.9 }
                : { x, y, rotate, scale };

      setNoState({
        style: { filter: variant.filter || 'none' },
        animate: {
          x: variant.x,
          y: variant.y,
          rotate: variant.rotate,
          scale: variant.scale,
          filter: variant.filter || 'none',
        },
        transition: { duration, ease: [0.16, 1, 0.3, 1] },
      });

      if (nextAttempts >= 5) {
        setTrashVisible(true);
      }

      if (nextAttempts >= 8) {
        window.setTimeout(() => {
          setNoGone(true);
          setNoState({
            style: {},
            animate: { x: 0, y: 0, rotate: 0, scale: 0 },
            transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          });
        }, 280);
      }

      return nextAttempts;
    });
  };

  const handleYes = () => {
    setScene(scenes.sushi);
    window.setTimeout(() => setScene(scenes.destination), 4200);
  };

  const handleConfirm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setScene(scenes.complete);
  };

  const handleReplay = () => {
    setScene(scenes.boot);
    setProgress(0);
    setLoadingIndex(0);
    setBootDone(false);
    setInviteStep(0);
    setAttempts(0);
    setTrashVisible(false);
    setNoGone(false);
    setNoState({
      style: {},
      animate: { x: 0, y: 0, rotate: 0, scale: 1 },
      transition: { duration: 0.22, ease: 'easeOut' },
    });
  };

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {scene === scenes.boot && (
          <motion.div key="boot" className="scene-wrapper" exit={{ opacity: 0 }}>
            <BootScene progress={progress} line={currentLoadingLine} done={bootDone} />
          </motion.div>
        )}

        {scene === scenes.invite && (
          <motion.div key="invite" className="scene-wrapper" exit={{ opacity: 0 }}>
            <InviteScene
              onYes={handleYes}
              noState={noState}
              onNoPointer={fleeNo}
              onNoTouch={fleeNo}
              attempts={attempts}
              trashVisible={trashVisible}
              noGone={noGone}
              inviteStep={inviteStep}
            />
          </motion.div>
        )}

        {scene === scenes.sushi && (
          <motion.div key="sushi" className="scene-wrapper" exit={{ opacity: 0 }}>
            <SushiTransitionScene />
          </motion.div>
        )}

        {scene === scenes.destination && (
          <motion.div key="destination" className="scene-wrapper" exit={{ opacity: 0 }}>
            <DestinationScene onConfirm={handleConfirm} />
          </motion.div>
        )}

        {scene === scenes.complete && (
          <motion.div key="complete" className="scene-wrapper" exit={{ opacity: 0 }}>
            <CompleteScene onReplay={handleReplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
