import styles from './About.module.scss';

const COMPANY_NAME = 'ozon-items';
const DESCRIPTION =
  'Мы помогаем продавцам и маркетплейсам эффективно управлять товарами и продвигать бренды. Наша команда создаёт инструменты, которые экономят время и увеличивают продажи.';

const CONTACTS = [
  { label: 'Email', value: 'hello@ozon-items.ru', href: 'mailto:hello@ozon-items.ru' },
  { label: 'Телефон', value: '+7 (999) 123-45-67', href: 'tel:+79991234567' },
  { label: 'Адрес', value: 'Москва, ул. Примерная, д. 1', href: null },
] as const;

const SOCIAL_LINKS = [
  { name: 'Telegram', href: 'https://t.me/ozon_items', icon: 'tg' },
  { name: 'ВКонтакте', href: 'https://vk.com/ozon_items', icon: 'vk' },
] as const;

const ADVANTAGES = [
  {
    title: 'Скорость',
    slogan: 'Быстрая обработка заказов и обновление данных — вы всегда в курсе.',
  },
  {
    title: 'Надёжность',
    slogan: 'Стабильная работа сервиса и сохранность ваших данных 24/7.',
  },
  {
    title: 'Поддержка',
    slogan: 'Отвечаем на вопросы и помогаем настроить всё под ваши задачи.',
  },
] as const;

export function About() {
  return (
    <main className={styles.about}>
      <div className={styles.container}>
        <section className={styles.section}>
          <h1 className={styles.title}>{COMPANY_NAME}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
        </section>

        <section className={styles.section} aria-labelledby="advantages-heading">
          <h2 id="advantages-heading" className={styles.sectionTitle}>
            Наши преимущества
          </h2>
          <ul className={styles.advantagesList}>
            {ADVANTAGES.map((item) => (
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
            Контакты
          </h2>
          <ul className={styles.contactsList}>
            {CONTACTS.map(({ label, value, href }) => (
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
            Мы в соцсетях
          </h2>
          <ul className={styles.socialList}>
            {SOCIAL_LINKS.map(({ name, href, icon }) => (
              <li key={icon}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={name}
                >
                  <span className={styles.socialIcon} data-icon={icon} aria-hidden />
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
