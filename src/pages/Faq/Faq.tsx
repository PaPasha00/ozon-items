import { FaqHelpCta } from '../../components';
import { useFaq } from '../../contexts/FaqContext';
import { useUiCopy } from '../../contexts/UiContext';
import styles from './Faq.module.scss';

export function Faq() {
  const { items, loading, error } = useFaq();
  const faqUi = useUiCopy().faq;

  if (loading) {
    return (
      <div className={styles.faq}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{faqUi.pageTitle}</h1>
          <p className={styles.status}>{faqUi.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.faq}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{faqUi.pageTitle}</h1>
          <p className={styles.status}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.faq}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{faqUi.pageTitle}</h1>
        {items.length > 0 ? (
          <div className={styles.panel} role="region" aria-label={faqUi.listAriaLabel}>
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
          <p className={styles.status}>{faqUi.empty}</p>
        )}
        <FaqHelpCta />
      </div>
    </div>
  );
}
