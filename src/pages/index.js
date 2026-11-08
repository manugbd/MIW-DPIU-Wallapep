import Head from "next/head";
import Link from "next/link";
import CategoryGrid from "@/components/products/CategoryGrid";
import styles from "@/styles/Home.module.css";

export default function Home({ isLoggedIn = false }) {
  return (
    <main className={styles.page}>
      <Head>
        <title>Wallapep | Buy and sell second-hand products</title>
        <meta
          name="description"
          content="Buy and sell second-hand products on Wallapep. Explore categories and give your things a second life."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <section className={styles.intro} aria-labelledby="welcome-title">
          <span className={styles.eyebrow}>WELCOME TO WALLAPEP</span>
          <h1 id="welcome-title">Good finds. New beginnings.</h1>
          <p>
            Buy and sell second-hand products. Find something you need, sell
            what you no longer use and give things a second life.
          </p>
          <div className={styles.ctas}>
            <a className={styles.primary} href="#categories">
              Explore categories
            </a>
            <Link
              className={styles.secondary}
              href={isLoggedIn ? "/createProduct" : "/register"}
            >
              {isLoggedIn ? "Sell a product" : "Create an account"}
            </Link>
          </div>
        </section>

        <section
          id="categories"
          aria-labelledby="categories-title"
          className={styles.categorySection}
        >
          <h2 id="categories-title">What are you looking for?</h2>
          <p className={styles.sectionDescription}>
            {isLoggedIn
              ? "Choose a category to explore its products."
              : "Explore our categories. Sign in to browse products and buy."}
          </p>
          <CategoryGrid isLoggedIn={isLoggedIn} />
        </section>
      </div>
    </main>
  );
}
