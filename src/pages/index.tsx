import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotesComponent from "./components/NotesComponent";


const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();
  return (
    <>
      <Head>
        <title>Cobra Note Taker</title>
        <meta
          name="description"
          content="NoteTaker app created using create-t3-app & Supabase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="m-auto flex min-h-screen max-w-3xl flex-col items-center justify-start p-5">
        <Header />
        {sessionData ? (
          <NotesComponent />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "80vh" }}
          >
            Please login to continue
          </div>
        )}
        <Footer />
      </main>
    </>
  );
};

export default Home;
