import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type Status = 'idle' | 'starting' | 'scanning' | 'error';

type UseQrScannerOptions = {
  onSuccess: (id: string) => void;
  containerId: string;
};

export const useQrScanner = ({ onSuccess, containerId }: UseQrScannerOptions) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const start = async () => {
    setStatus('starting');
    setErrorMsg('');
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          onSuccess(decodedText.trim());
        },
        () => {},
      );
      setStatus('scanning');
    } catch {
      setStatus('error');
      setErrorMsg('No se pudo acceder a la cámara.');
    }
  };

  const stop = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch { /* already stopped */ }
      scannerRef.current = null;
    }
    setStatus('idle');
  };

  useEffect(() => {
    start();
    return () => { stop(); };
  }, []);

  return { status, errorMsg, stop };
};
