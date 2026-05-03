import { useMemo, useState, useRef, useEffect } from 'react';
import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { UI } from '../../config/constants';
import { CATEGORIES } from '../../config/categories';
import { SECTIONS } from '../../config/sections';
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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('oldest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const categoryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const closeCategory = () => setCategoryOpen(false);
  const closeSection = () => setSectionOpen(false);

  const handleCategorySelect = (id: string | null) => {
    setActiveCategory(id);
    closeCategory();
  };

  const handleSectionSelect = (id: string | null) => {
    setActiveSection(id);
    closeSection();
  };

  const handleCategoryToggle = () => {
    if (categoryTimerRef.current) clearTimeout(categoryTimerRef.current);
    setCategoryOpen((v) => !v);
    if (categoryOpen) {
      categoryTimerRef.current = null;
    } else {
      categoryTimerRef.current = setTimeout(() => closeCategory(), 3000);
    }
  };

  const handleSectionToggle = () => {
    if (sectionTimerRef.current) clearTimeout(sectionTimerRef.current);
    setSectionOpen((v) => !v);
    if (sectionOpen) {
      sectionTimerRef.current = null;
    } else {
      sectionTimerRef.current = setTimeout(() => closeSection(), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (categoryTimerRef.current) clearTimeout(categoryTimerRef.current);
      if (sectionTimerRef.current) clearTimeout(sectionTimerRef.current);
    };
  }, []);

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

  const toggleSearch = () => {
    setSearchOpen((v) => {
      if (v) setSearch('');
      return !v;
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.collapsibleGroup}>
          <button
            className={styles.collapsibleBtn}
            onClick={handleCategoryToggle}
            title="Categorías"
          >
            <span className={styles.selectedIcon}>
              {CATEGORIES.find((c) => c.id === activeCategory)?.emoji || '🍽️'}
            </span>
          </button>
          {categoryOpen && (
            <div className={[styles.expandedMenu, styles.categoryMenu].join(' ')}>
              <button
                className={styles.menuOption}
                onClick={() => handleCategorySelect(null)}
              >
                <span className={styles.optionEmoji}>🍽️</span>
                <span>Todo</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={styles.menuOption}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <span className={styles.optionEmoji}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.collapsibleGroup}>
          <button
            className={styles.collapsibleBtn}
            onClick={handleSectionToggle}
            title="Secciones"
          >
            <span className={styles.selectedIcon}>
              {SECTIONS.find((s) => s.id === activeSection)?.emoji || '🧊'}
            </span>
          </button>
          {sectionOpen && (
            <div className={[styles.expandedMenu, styles.sectionMenu].join(' ')}>
              <button
                className={styles.menuOption}
                onClick={() => handleSectionSelect(null)}
              >
                <span className={styles.optionEmoji}>🧊</span>
                <span>Todo</span>
              </button>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  className={styles.menuOption}
                  onClick={() => handleSectionSelect(sec.id)}
                >
                  <span className={styles.optionEmoji}>{sec.emoji}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
            onClick={toggleSearch}
            aria-label="Buscar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
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
