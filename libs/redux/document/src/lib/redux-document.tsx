import styles from './redux-document.module.css';

/* eslint-disable-next-line */
export interface ReduxDocumentProps {}

export function ReduxDocument(props: ReduxDocumentProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReduxDocument!</h1>
    </div>
  );
}

export default ReduxDocument;
