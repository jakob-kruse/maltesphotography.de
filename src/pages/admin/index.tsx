import { GetServerSideProps } from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      code: 307,
      permanent: false,
      destination: '/admin/collections',
    },
  };
};

const AdminIndexPage = () => {
  return (
    <>
      <Link href="/admin/collections">Collections</Link>
    </>
  );
};

export default AdminIndexPage;
