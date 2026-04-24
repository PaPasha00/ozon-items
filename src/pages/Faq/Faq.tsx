import { useFaq } from '../../contexts/FaqContext';
import styles from './Faq.module.scss';

export function Faq() {
  const { items, loading, error } = useFaq();

  if (loading) {
    return (
      <div className={styles.faq}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Вопросы и ответы</h1>
          <p className={styles.status}>Загрузка…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.faq}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Вопросы и ответы</h1>
          <p className={styles.status}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.faq}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Вопросы и ответы</h1>
        {items.length > 0 ? (
          <div className={styles.panel} role="region" aria-label="Список вопросов">
            {items.map((item, index) => (
              <div key={`${item.question}-${index}`} className={styles.row}>
                <details className={styles.details} name="faq">
                  <summary className={styles.summary}>
                    <span className={styles.summaryText}>{item.question}</span>
                    <span className={styles.summaryChevron} aria-hidden />
                  </summary>
                  <div className={styles.answer}>{item.answer}</div>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.status}>Пока нет вопросов.</p>
        )}
      </div>
    </div>
  );
}
