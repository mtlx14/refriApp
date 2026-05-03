import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ToggleGroup.module.css';

type Option = {
  id: string;
  emoji: string;
  label: string;
};

type Props = {
  options: Option[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  defaultEmoji?: string;
  secondaryEmoji?: string;
  side?: 'left' | 'right';
};

const FADE_MS = 120;
const RESIZE_MS = 130;

export const ToggleGroup = ({ options, activeId, onSelect, defaultEmoji, secondaryEmoji, side = 'left' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const seqTimersRef = useRef<NodeJS.Timeout[]>([]);

  const selectedEmoji = activeId ? options.find((o) => o.id === activeId)?.emoji : undefined;

  const clearSeq = () => {
    seqTimersRef.current.forEach(clearTimeout);
    seqTimersRef.current = [];
  };

  const transitionTo = (next: boolean) => {
    clearSeq();
    setContentVisible(false);
    seqTimersRef.current.push(
      setTimeout(() => {
        setIsOpen(next);
        seqTimersRef.current.push(
          setTimeout(() => setContentVisible(true), RESIZE_MS)
        );
      }, FADE_MS)
    );
  };

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    transitionTo(false);
  };

  const handleToggle = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    const next = !isOpen;
    transitionTo(next);
    if (next) {
      closeTimerRef.current = setTimeout(handleClose, 3000);
    }
  };

  const handleSelect = (id: string) => {
    onSelect(activeId === id ? null : id);
    handleClose();
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      clearSeq();
    };
  }, []);

  return (
    <motion.div
      layout
      style={{ borderRadius: 999 }}
      className={[styles.pillsContainer, side === 'right' ? styles.wrapperRight : ''].join(' ')}
      transition={{ layout: { type: 'tween', duration: RESIZE_MS / 1000, ease: 'linear' } }}
      onClick={!isOpen ? handleToggle : undefined}
    >
      <motion.div
        className={styles.inner}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: FADE_MS / 1000, ease: 'linear' }}
      >
        {!isOpen ? (
          <div className={styles.pill}>
            {selectedEmoji ? (
              <span className={styles.emoji}>{selectedEmoji}</span>
            ) : (
              <span className={styles.overlappedEmojis}>
                <span className={styles.emoji}>{defaultEmoji}</span>
                {secondaryEmoji && (
                  <span className={[styles.emoji, styles.secondary].join(' ')}>{secondaryEmoji}</span>
                )}
              </span>
            )}
          </div>
        ) : (
          <div className={styles.expandedRow}>
            <button
              className={[styles.pill, !activeId ? styles.pillActive : styles.pillInactive].join(' ')}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
                handleClose();
              }}
            >
              <span className={styles.pillText}>Todo</span>
            </button>
            {options.map((opt) => (
              <button
                key={opt.id}
                className={[
                  styles.pill,
                  activeId === opt.id ? styles.pillActive : styles.pillInactive,
                ].join(' ')}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.id);
                }}
              >
                <span className={styles.emoji}>{opt.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
