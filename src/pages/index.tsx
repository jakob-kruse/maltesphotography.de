import { File } from '$lib/api/schemas/file';
import FileRenderer from '$lib/components/FileRenderer';
import Footer from '$lib/components/Footer';
import Navbar from '$lib/components/Navbar';
import { prisma } from '$lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  previewFiles: File[];
}> = async () => {
  const previewFiles = await prisma.$queryRaw<
    File[]
  >`SELECT * FROM "public"."File" WHERE featured = true ORDER BY random() LIMIT 5`;

  return {
    props: { previewFiles },
  };
};

function Home({
  previewFiles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Navbar>
        <Link href="/collections">
          <a className="btn btn-ghost rounded-btn">Collections</a>
        </Link>
      </Navbar>
      {previewFiles.length > 0 && (
        <div className="fixed top-0 w-screen h-screen -z-10 animate-opacityHighlight">
          <FileRenderer file={previewFiles[0]} layout="fill" objectFit="fill" />
        </div>
      )}

      <div className="container mx-auto">
        <div className="min-h-screen hero">
          <div className="text-center hero-content">
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
