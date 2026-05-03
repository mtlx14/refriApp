import { useState } from 'react';
import { UI } from '../../config/constants';
import { SETTINGS } from '../../config/settings';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { generateQrLabelsPdf } from '../../utils/pdfQrLabels';
import styles from './OptionsMenu.module.css';

export const OptionsMenu = () => {
  const { products } = useProducts();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePrint = async () => {
    setPrinting(true);
    setProgress(0);
    try {
      const usedIds = new Set(products.map((p) => p.id));
      await generateQrLabelsPdf(usedIds, (placed, total) => {
        setProgress(Math.round((placed / total) * 100));
      });
    } finally {
      setPrinting(false);
      setProgress(0);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={UI.options.triggerAriaLabel}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)} title={UI.options.title}>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>{UI.options.printQrs}</span>
              <span className={styles.rowMeta}>
                {SETTINGS.print.quantity} etiquetas nuevas (saltea {products.length} ya en uso)
              </span>
            </div>
            <Button onClick={handlePrint} small disabled={printing}>
              {printing ? `${progress}%` : 'Generar PDF'}
            </Button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>Cerrar sesión</span>
            </div>
            <Button onClick={logout} small variant="secondary">
              Salir
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
