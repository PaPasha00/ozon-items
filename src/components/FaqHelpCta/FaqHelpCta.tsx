import { useUiCopy } from '../../contexts/UiContext';
import styles from './FaqHelpCta.module.scss';

/**
 * Блок «Не нашли ответ?» — тексты из `/ui.json` → `helpCta`.
 */
export function FaqHelpCta() {
  const { helpCta } = useUiCopy();

  return (
    <div className={styles.card}>
      <div className={styles.hero}>
        <span className={styles.heroBlurA} aria-hidden />
        <span className={styles.heroBlurB} aria-hidden />
        <div className={styles.heroInner}>
          <h2 className={styles.heading}>{helpCta.heading}</h2>
          <p className={styles.description}>{helpCta.description}</p>
        </div>
      </div>

      <details className={styles.details} name="faq-help">
        <summary className={styles.summary}>
          <span>{helpCta.toggleLabel}</span>
          <span className={styles.chevron} aria-hidden />
        </summary>
        <div className={styles.stepsWrap}>
          <div className={styles.steps}>
            {helpCta.steps.map((text, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <p className={styles.stepText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
