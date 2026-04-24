import styles from './Header.module.scss';

/**
 * Словарный знак Deltima (светлая заливка #15181E через currentColor + .logo)
 */
export function LogoDeltima() {
  return (
    <svg
      className={styles.logoSvg}
      xmlns="http://www.w3.org/2000/svg"
      width="89"
      height="13"
      viewBox="0 0 89 13"
      fill="none"
      aria-hidden
    >
      <path
        d="M7.02 0C8.376 0 9.402 0.354 10.098 1.062C10.806 1.758 11.16 2.784 11.16 4.14V8.46C11.16 9.816 10.806 10.848 10.098 11.556C9.402 12.252 8.376 12.6 7.02 12.6H0V0H7.02ZM7.92 4.14C7.92 3.06 7.38 2.52 6.3 2.52H3.24V10.08H6.3C7.38 10.08 7.92 9.54 7.92 8.46V4.14Z"
        fill="currentColor"
      />
      <path
        d="M24.3851 12.6H14.3951V0H24.3851V2.52H17.6351V4.95H22.9451V7.47H17.6351V10.08H24.3851V12.6Z"
        fill="currentColor"
      />
      <path
        d="M30.5009 10.08H37.0709V12.6H27.2609V0H30.5009V10.08Z"
        fill="currentColor"
      />
      <path
        d="M43.733 12.6H40.493V2.52H36.713V0H47.513V2.52H43.733V12.6Z"
        fill="currentColor"
      />
      <path
        d="M56.1551 12.6H49.6751V10.08H51.2951V2.52H49.6751V0H56.1551V2.52H54.5351V10.08H56.1551V12.6Z"
        fill="currentColor"
      />
      <path
        d="M70.0137 5.58L67.4937 10.08H64.9737L62.4537 5.58V12.6H59.2137V0H62.6337L66.2337 6.66L69.8337 0H73.2537V12.6H70.0137V5.58Z"
        fill="currentColor"
      />
      <path
        d="M79.1107 12.6H75.6007L80.3707 0H83.9707L88.7407 12.6H85.2307L84.4207 10.35H79.9207L79.1107 12.6ZM80.7307 8.01H83.6107L82.1707 3.78L80.7307 8.01Z"
        fill="currentColor"
      />
    </svg>
  );
}
