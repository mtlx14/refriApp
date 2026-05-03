import { useState } from 'react';
import { useQrScanner } from '../../hooks/useQrScanner';
import { UI } from '../../config/constants';
import { SETTINGS } from '../../config/settings';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './QrScanner.module.css';

const SCANNER_ID = 'qr-scanner-container';

type Props = {
  onIdResolved: (id: string) => void;
  onCancel: () => void;
};

const normalizeId = (raw: string): string => {
  const trimmed = raw.trim();
  return /^\d+$/.test(trimmed)
    ? trimmed.padStart(SETTINGS.print.idPadLength, '0')
    : trimmed;
};

export const QrScanner = ({ onIdResolved, onCancel }: Props) => {
  const [manualMode, setManualMode] = useState(false);
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState('');

  const handleScanned = (rawId: string) => {
    stop();
    onIdResolved(normalizeId(rawId));
  };

  const { status, errorMsg, stop } = useQrScanner({
    onSuccess: handleScanned,
    containerId: SCANNER_ID,
  });

  const handleManualConfirm = () => {
    const id = normalizeId(manualId);
    if (!id) {
      setError('Ingresá un ID.');
      return;
    }
    stop();
    onIdResolved(id);
  };

  const handleSwitchToManual = () => {
    stop();
    setManualMode(true);
    setError('');
  };

  return (
    <div className={styles.wrapper}>
      {!manualMode ? (
        <>
          <div className={styles.scanArea}>
            <div id={SCANNER_ID} className={styles.video} />
            {status === 'scanning' && (
              <>
                <div className={styles.viewfinder}>
                  <span />
                  <div className={styles.scanLine} />
                </div>
                <p className={styles.hintText}>Apuntá la cámara al código QR</p>
              </>
            )}
            {status === 'starting' && (
              <div className={styles.overlay}>
                <span className={styles.spinner} />
              </div>
            )}
            {(status === 'error' || errorMsg) && (
              <div className={styles.overlay}>
                <p className={styles.errorText}>{errorMsg}</p>
              </div>
            )}
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button className={styles.manualBtn} onClick={handleSwitchToManual}>
            {UI.scanner.fallbackBtn}
          </button>
        </>
      ) : (
        <>
          <Input
            label={UI.form.labelId}
            value={manualId}
            onChange={(v) => { setManualId(v); setError(''); }}
            placeholder={UI.scanner.placeholderId}
            error={error}
          />

          <Button onClick={handleManualConfirm} fullWidth>
            {UI.scanner.btnConfirmId}
          </Button>

          <Button onClick={() => setManualMode(false)} variant="secondary" fullWidth>
            Volver al escáner
          </Button>
        </>
      )}

      <Button onClick={onCancel} variant="ghost" fullWidth>
        {UI.form.btnCancel}
      </Button>
    </div>
  );
};
