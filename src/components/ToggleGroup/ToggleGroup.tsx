import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  defaultEmoji: string;
  side?: 'left' | 'right';
};

export const ToggleGroup = ({ options, activeId, onSelect, defaultEmoji, side = 'left' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedEmoji = options.find((o) => o.id === activeId)?.emoji || defaultEmoji;

  const handleClose = () => {
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleToggle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen((v) => !v);
    if (!isOpen) {
      timerRef.current = setTimeout(handleClose, 3000);
    }
  };

  const handleSelect = (id: string) => {
    onSelect(activeId === id ? null : id);
    handleClose();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      className={[styles.wrapper, side === 'right' ? styles.wrapperRight : ''].join(' ')}
      layout
    >
      <motion.button
        className={styles.toggle}
        onClick={handleToggle}
        layout
      >
        <motion.div
          className={styles.pillsContainer}
          layout
          initial={false}
          animate={{ width: isOpen ? 'auto' : '48px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            className={styles.pill}
            animate={{ x: isOpen ? 0 : 0 }}
          >
            <span className={styles.emoji}>{selectedEmoji}</span>
          </motion.div>

          <AnimatePresence>
            {isOpen &&
              options.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  className={styles.pill}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.id);
                  }}
                >
                  <span className={styles.emoji}>{opt.emoji}</span>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={styles.optionsList}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <button className={styles.option} onClick={() => onSelect(null)}>
                <span className={styles.optionEmoji}>🍽️</span>
                <span>Todo</span>
              </button>
            </motion.li>
            {options.map((opt, i) => (
              <motion.li
                key={opt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: (i + 1) * 0.03 }}
              >
                <button className={styles.option} onClick={() => handleSelect(opt.id)}>
                  <span className={styles.optionEmoji}>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
