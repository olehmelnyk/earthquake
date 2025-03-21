import styles from './ui.module.css';
import { Button } from './Button/Button';

export function Ui() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Ui!</h1>
    </div>
  );
}

export default Ui;

export { Button };
export * from './Button/Button';
