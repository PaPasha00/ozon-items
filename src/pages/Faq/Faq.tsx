import { useFaq } from '../../contexts/FaqContext';
import styles from './Faq.module.scss';

export function Faq() {
  const { items, loading, error } = useFaq();

  if (loading) {
    return (
      <main className={styles.faq}>
        <div className={styles.container}>
          <h1 className={styles.title}>Частые вопросы</h1>
          <p className={styles.description}>Загрузка…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.faq}>
        <div className={styles.container}>
          <h1 className={styles.title}>Частые вопросы</h1>
          <p className={styles.description}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.faq}>
      <div className={styles.container}>
        <h1 className={styles.title}>Частые вопросы</h1>
        <section className={styles.section} aria-label="Список вопросов и ответов">
          <dl className={styles.list}>
            {items.map((item, index) => (
              <div key={index} className={styles.item}>
                <details className={styles.details}>
                  <summary className={styles.summary}>{item.question}</summary>
                  <div className={styles.answer}>{item.answer}</div>
                </details>
              </div>
            ))}
          </dl>
        </section>
        {items.length === 0 && (
          <p className={styles.description}>Пока нет добавленных вопросов.</p>
        )}
      </div>
    </main>
  );
}
