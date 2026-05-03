import { useMemo, useState } from 'react';
import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { UI } from '../../config/constants';
import { CATEGORIES } from '../../config/categories';
import { SECTIONS } from '../../config/sections';
import { ToggleGroup } from '../ToggleGroup/ToggleGroup';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

type SortKey = 'oldest' | 'newest';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'oldest', label: UI.sort.oldest },
  { key: 'newest', label: UI.sort.newest },
];

type Props = {
  onSelectProduct: (product: Product) => void;
};

export const ProductList = ({ onSelectProduct }: Props) => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('oldest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter((p) => !activeCategory || p.category === activeCategory)
      .filter((p) => !activeSection || p.section === activeSection)
      .filter((p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        sortKey === 'oldest'
          ? a.entryDate.localeCompare(b.entryDate)
          : b.entryDate.localeCompare(a.entryDate),
      );
  }, [products, activeCategory, activeSection, search, sortKey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <ToggleGroup
          options={CATEGORIES.map((c) => ({ id: c.id, emoji: c.emoji, label: c.label }))}
          activeId={activeCategory}
          onSelect={setActiveCategory}
          defaultEmoji="🍽️"
          side="left"
        />

        <div className={styles.actions}>
          <div className={styles.sortWrap}>
            <button
              className={[styles.iconBtn, sortMenuOpen ? styles.iconBtnActive : ''].join(' ')}
              onClick={() => setSortMenuOpen((v) => !v)}
              aria-label="Ordenar"
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h13M3 12h9M3 18h5" strokeLinecap="round" />
                <path d="m17 14 4 4 4-4M21 18V8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4 -2)" />
              </svg>
            </button>
            {sortMenuOpen && (
              <ul className={styles.menu} role="listbox">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.key}>
                    <button
                      className={[
                        styles.menuItem,
                        opt.key === sortKey ? styles.menuItemActive : '',
                      ].join(' ')}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortMenuOpen(false);
                      }}
                      role="option"
                      aria-selected={opt.key === sortKey}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className={[styles.iconBtn, searchOpen ? styles.iconBtnActive : ''].join(' ')}
            onClick={() => {
              setSearchOpen((v) => {
                if (v) setSearch('');
                return !v;
              });
            }}
            aria-label="Buscar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ToggleGroup
          options={SECTIONS.map((s) => ({ id: s.id, emoji: s.emoji, label: s.label }))}
          activeId={activeSection}
          onSelect={setActiveSection}
          defaultEmoji="🧊"
          side="right"
        />
      </div>

      {searchOpen && (
        <input
          className={styles.searchInput}
          type="text"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, ID o descripción..."
        />
      )}

      {filtered.length === 0 ? (
        <p className={styles.empty}>{UI.emptyState}</p>
      ) : (
        <div className={styles.list}>
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} onClick={onSelectProduct} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
