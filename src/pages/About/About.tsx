import { useSiteConfig } from '../../contexts/SiteContext';
import styles from './About.module.scss';

export function About() {
  const { config, loading, error } = useSiteConfig();
  const { siteName, about } = config;

  if (loading) {
    return (
      <main className={styles.about}>
        <div className={styles.container}>
          <p className={styles.description}>Загрузка…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.about}>
        <div className={styles.container}>
          <p className={styles.description}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.about}>
      <div className={styles.container}>
        <section className={styles.section}>
          <h1 className={styles.title}>{siteName}</h1>
          <p className={styles.description}>{about.description}</p>
        </section>

        <section className={styles.section} aria-labelledby="advantages-heading">
          <h2 id="advantages-heading" className={styles.sectionTitle}>
            {about.advantagesHeading}
          </h2>
          <ul className={styles.advantagesList}>
            {about.advantages.map((item) => (
              <li key={item.title}>
                <article className={styles.advantageCard}>
                  <h3 className={styles.advantageTitle}>{item.title}</h3>
                  <p className={styles.advantageSlogan}>{item.slogan}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="contacts-heading">
          <h2 id="contacts-heading" className={styles.sectionTitle}>
            {about.contactsHeading}
          </h2>
          <ul className={styles.contactsList}>
            {about.contacts.map(({ label, value, href }) => (
              <li key={label} className={styles.contactItem}>
                <span className={styles.contactLabel}>{label}:</span>
                {href ? (
                  <a href={href} className={styles.contactLink}>
                    {value}
                  </a>
                ) : (
                  <span>{value}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="social-heading">
          <h2 id="social-heading" className={styles.sectionTitle}>
            {about.socialHeading}
          </h2>
          <ul className={styles.socialList}>
            {about.socialLinks.map(({ name, href, icon }) => (
              <li key={icon}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={name}
                >
                  <span className={styles.socialIcon} aria-hidden>
                    {icon}
                  </span>
                  <span className={styles.socialName}>{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
