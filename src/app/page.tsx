import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome to the Test Page</h1>

      <div className={styles.imageContainer}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={300}
          height={200}
          priority
          className={styles.image}
        />
      </div>
      <p className={styles.description}>
        This is a simple test page to demonstrate the use of Next.js and CSS
        modules.
      </p>
    </div>
  );
}
