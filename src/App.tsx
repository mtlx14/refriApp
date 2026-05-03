import { useState } from 'react';
import type { Product } from './types/product';
import { ProductList } from './components/ProductList/ProductList';
import { ProductForm } from './components/ProductForm/ProductForm';
import { ProductDetail } from './components/ProductDetail/ProductDetail';
import { QrScanner } from './components/QrScanner/QrScanner';
import { OptionsMenu } from './components/OptionsMenu/OptionsMenu';
import { Modal } from './components/Modal/Modal';
import { Login } from './components/Login/Login';
import { ProductsProvider } from './context/ProductsContext';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './context/AuthContext';
import { UI } from './config/constants';
import styles from './App.module.css';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'scanner' }
  | { mode: 'create'; prefillId: string }
  | { mode: 'detail'; product: Product }
  | { mode: 'edit'; product: Product };

const AuthedApp = () => {
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const { findById } = useProducts();

  const closeModal = () => setModal({ mode: 'closed' });

  const handleIdResolved = (id: string) => {
    const existing = findById(id);
    setModal(
      existing
        ? { mode: 'detail', product: existing }
        : { mode: 'create', prefillId: id },
    );
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{UI.header.greeting}</h1>
        <OptionsMenu />
      </header>

      <main className={styles.main}>
        <ProductList
          onSelectProduct={(p) => setModal({ mode: 'detail', product: p })}
        />
      </main>

      <button
        className={styles.fab}
        onClick={() => setModal({ mode: 'scanner' })}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinejoin="round" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinejoin="round" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinejoin="round" />
          <path d="M14 14h3v3M21 14v.01M14 21h3M17 17v4M21 17v4" strokeLinecap="round" />
        </svg>
        <span>Escanear QR</span>
      </button>

      {modal.mode === 'scanner' && (
        <Modal onClose={closeModal} title={UI.scanner.title}>
          <QrScanner
            onIdResolved={handleIdResolved}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal.mode === 'create' && (
        <Modal onClose={closeModal} title="Nuevo producto">
          <ProductForm prefillId={modal.prefillId} onDone={closeModal} />
        </Modal>
      )}

      {modal.mode === 'detail' && (
        <Modal onClose={closeModal} title="Detalle">
          <ProductDetail
            product={modal.product}
            onEdit={() => setModal({ mode: 'edit', product: modal.product })}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal.mode === 'edit' && (
        <Modal onClose={closeModal} title="Editar producto">
          <ProductForm editProduct={modal.product} onDone={closeModal} />
        </Modal>
      )}
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Login />;
  return (
    <ProductsProvider>
      <AuthedApp />
    </ProductsProvider>
  );
}

export default App;
