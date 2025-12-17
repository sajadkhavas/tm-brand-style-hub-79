import React from 'react';
import { Box, H1, H2, Text, Table, TableHead, TableBody, TableRow, TableCell, Card, Icon } from '@adminjs/design-system';

const StatCard = ({ title, value, icon }) => (
  <Card variant="container" flex flexDirection="column" alignItems="flex-start" justifyContent="center" p="lg">
    <Box display="flex" alignItems="center" gap="md">
      <Icon icon={icon} color="primary100" />
      <Box>
        <Text variant="sm" color="grey60">{title}</Text>
        <H2 mt="xs">{value}</H2>
      </Box>
    </Box>
  </Card>
);

const Dashboard = (props) => {
  const stats = props?.data?.stats || {};
  const recentOrders = stats.recentOrders || [];

  return (
    <Box p="xl" variant="white" style={{ direction: 'rtl' }}>
      <H1 mb="lg">داشبورد مدیریت TM-BRAND</H1>
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gridGap="lg" mb="xl">
        <StatCard title="تعداد سفارشات" value={stats.orderCount || 0} icon="ShoppingCart" />
        <StatCard title="درآمد کل" value={`${(stats.revenue || 0).toLocaleString('fa-IR')} تومان`} icon="Coins" />
        <StatCard title="کاربران جدید هفتگی" value={stats.recentUsers || 0} icon="UserPlus" />
        <StatCard title="محصولات کم‌موجودی" value={stats.lowStock || 0} icon="AlertTriangle" />
      </Box>

      <Card variant="container" p="lg">
        <H2 mb="md">آخرین سفارش‌ها</H2>
        {recentOrders.length === 0 ? (
          <Text color="grey60">سفارشی ثبت نشده است.</Text>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>کد سفارش</TableCell>
                <TableCell>مشتری</TableCell>
                <TableCell>مبلغ</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>تاریخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.orderNumber}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{`${Number(order.totalAmount || 0).toLocaleString('fa-IR')} تومان`}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;
