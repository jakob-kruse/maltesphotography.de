import type { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin',
      permanent: false,
    },
  };
};

const Home: NextPage = () => {
  return <div></div>;
};

export default Home;
