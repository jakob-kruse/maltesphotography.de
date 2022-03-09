import { Collection } from '$lib/api/schemas/collection';
import { prisma } from '$lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
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
