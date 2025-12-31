import { useBarber } from '@/context/BarberContext';
import { AppointmentStatus } from '@/types';

const ensureDate = (d: Date | string): Date => {
  if (d instanceof Date) return d;
  return new Date(d);
};

export const useDashboardStats = () => {
  const { appointments, todayRevenue, clients, shopSettings, products } = useBarber();

  const todaysAppointments = appointments.filter(a => {
    const today = new Date();
    const apptDate = ensureDate(a.date);
    return apptDate.getDate() === today.getDate() && 
           apptDate.getMonth() === today.getMonth() &&
           apptDate.getFullYear() === today.getFullYear();
  });

  const nextAppointment = todaysAppointments
    .filter(a => a.status === AppointmentStatus.SCHEDULED && ensureDate(a.date) > new Date())
    .sort((a, b) => ensureDate(a.date).getTime() - ensureDate(b.date).getTime())[0];

  const lowStockProducts = products.filter(p => p.stock < 5);

  const stats = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 550 },
    { name: 'Thu', revenue: 450 },
    { name: 'Fri', revenue: 850 },
    { name: 'Sat', revenue: 1200 },
    { name: 'Sun', revenue: todayRevenue > 0 ? todayRevenue : 150 },
  ];

  return {
    todayRevenue,
    dailyGoal: shopSettings.dailyRevenueGoal || 1000,
    todaysAppointments,
    completedCount: todaysAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
    activeClientsCount: clients.length,
    nextAppointment,
    lowStockProducts,
    chartData: stats
  };
};
