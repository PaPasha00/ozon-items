import styles from './CatalogEmptyState.module.scss';

export type CatalogEmptyVariant = 'search' | 'searchInCategory' | 'category';

const MAX_Q_LEN = 48;

function truncateQuery(q: string): string {
  const t = q.trim();
  if (t.length <= MAX_Q_LEN) return t;
  return `${t.slice(0, MAX_Q_LEN - 1)}…`;
}

type CatalogEmptyStateProps = {
  variant: CatalogEmptyVariant;
  searchQuery: string;
  onClearSearch: () => void;
  onResetCategory: () => void;
};

/** Иконка пустого поиска (макет: квадрат 40×40, лупа) */
function EmptySearchStateIcon() {
  return (
    <svg
      className={styles.emptySearchIcon}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect className={styles.emptySearchIconBg} width="40" height="40" rx="8" />
      <path
        className={styles.emptySearchIconGlyph}
        d="M26.1419 27L21.0273 21.8854C20.6201 22.2216 20.1519 22.4847 19.6226 22.6747C19.0933 22.8647 18.5457 22.9597 17.9799 22.9597C16.5893 22.9597 15.4116 22.4774 14.447 21.5127C13.4823 20.5481 13 19.3705 13 17.9799C13 16.5893 13.4823 15.4116 14.447 14.447C15.4116 13.4823 16.5893 13 17.9799 13C19.3705 13 20.5481 13.4823 21.5127 14.447C22.4774 15.4116 22.9597 16.5893 22.9597 17.9799C22.9597 18.5614 22.8621 19.1168 22.6669 19.6461C22.4716 20.1754 22.2112 20.6358 21.8854 21.0273L27 26.1419L26.1419 27ZM17.9799 21.7383C19.0291 21.7383 19.9178 21.3742 20.646 20.646C21.3742 19.9178 21.7383 19.0291 21.7383 17.9799C21.7383 16.9306 21.3742 16.0419 20.646 15.3137C19.9178 14.5855 19.0291 14.2215 17.9799 14.2215C16.9306 14.2215 16.0419 14.5855 15.3137 15.3137C14.5855 16.0419 14.2215 16.9306 14.2215 17.9799C14.2215 19.0291 14.5855 19.9178 15.3137 20.646C16.0419 21.3742 16.9306 21.7383 17.9799 21.7383Z"
      />
    </svg>
  );
}

type CopyBlock = {
  title: string;
  description: string;
  primaryAction: string;
  onPrimary: () => void;
  secondaryAction: string | null;
  onSecondary: (() => void) | null;
};

export function CatalogEmptyState({
  variant,
  searchQuery,
  onClearSearch,
  onResetCategory,
}: CatalogEmptyStateProps) {
  const q = truncateQuery(searchQuery);

  const { title, description, primaryAction, onPrimary, secondaryAction, onSecondary } = ((): CopyBlock => {
    switch (variant) {
      case 'search':
        return {
          title: 'Ничего не нашлось',
          description: q
            ? `Попробуйте ввести артикул с упаковки: «${q}» не найден`
            : 'Попробуйте ввести артикул с упаковки',
          primaryAction: 'Очистить поиск',
          onPrimary: onClearSearch,
          secondaryAction: null,
          onSecondary: null,
        };
      case 'searchInCategory':
        return {
          title: 'В этой категории нет совпадений',
          description: q
            ? `Попробуйте ввести артикул с упаковки: «${q}» в выбранной категории не найден. Сбросьте категорию при необходимости.`
            : 'Попробуйте ввести артикул с упаковки или сбросьте категорию.',
          primaryAction: 'Все категории',
          onPrimary: onResetCategory,
          secondaryAction: 'Очистить поиск',
          onSecondary: onClearSearch,
        };
      case 'category':
      default:
        return {
          title: 'В этой категории нет товаров',
          description: 'Сбросьте фильтр категории, чтобы увидеть весь список.',
          primaryAction: 'Показать все',
          onPrimary: onResetCategory,
          secondaryAction: null,
          onSecondary: null,
        };
    }
  })();

  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
    >
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden>
          <EmptySearchStateIcon />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{description}</p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onPrimary}
          >
            {primaryAction}
          </button>
          {secondaryAction && onSecondary ? (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onSecondary}
            >
              {secondaryAction}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
