import Head from "next/head";
import styles from "../styles/Home.module.css";
import Input from "reactstrap/lib/Input";
import Alert from "reactstrap/lib/Alert";
import { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import graphQlClient from "../configs/ApolloClient.config";
import { GET_CERTIFICATE_QUERY } from "../gql/getCertificate";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    if (localStorage.userToken) router.push('/info');
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>ShapeAI Affiliate Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img
          width={500}
          src={
            "https://shapeai-uploads.s3.ap-south-1.amazonaws.com/logo-high.svg"
          }
          alt={"Shape AI"}
        />
        <h1 className={"title"}>ShapeAI Affiliate Dashboard</h1>

        <p className={styles.description}>
          Under Development
        </p>
        <Button
          onClick={() => router.push('/signin')}
        >Signin</Button>
        <div className={styles.grid}>
          <form>
          </form>
        </div>
      </main>
    </div>
  );
}
