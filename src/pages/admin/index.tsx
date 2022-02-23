import AdminLayout from '$pages/admin/layout';
import type { ReactElement } from 'react';

export default function AdminDashboard() {
  return <h1>TBD</h1>;
}

AdminDashboard.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
