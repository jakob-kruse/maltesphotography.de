import Footer from '$lib/components/Footer';
import Navbar from '$lib/components/Navbar';
import Link from 'next/link';

function Home() {
  return (
    <>
      <Navbar>
        <Link href="/collections">
          <a className="btn btn-ghost rounded-btn">Collections</a>
        </Link>
      </Navbar>

      <div className="container mx-auto">
        <div className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hey!</h1>
              <p className="py-6">
                Ich bin ein passionierter Reisender und Fotograf. Außerdem
                interessiere ich mich für Technik. In der folgenden Übersicht
                kannst du dir meine Seite anschauen. Viel Spaß!
              </p>
              <Link href="/collections">
                <a className="btn btn-primary">View Collections</a>
              </Link>
            </div>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}

export default Home;
