import Head from "next/head";
import OwnTransactions from "@/components/transactions/OwnTransactions";

export default function MyTransactionsPage() {
  return (
    <>
      <Head>
        <title>My transactions | Wallapep</title>
      </Head>
      <OwnTransactions />
    </>
  );
}
