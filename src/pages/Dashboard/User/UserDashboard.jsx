// src/pages/Dashboard/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Charts from './components/Charts';
import RecipientsTable from './components/RecipientsTable';
import StatsCards from './components/StatsCard';
import { useUserStatis } from '@/hooks/useUserStatis';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector((state) => state.user.user);
  const {
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpTrend,
    fetchRsvpDistribution,
    fetchRecipients,
    engagementStats,
    invitationsOverTime,
    rsvpTrend,
    rsvpDistribution,
    recipients,
    totalRecipients,
    loading,
    error,
  } = useUserStatis();

  useEffect(() => {
    const startDate = '2025-01-01'; // Example: start of the week
    const endDate = '2025-04-24'; // Example: end of the week

    fetchEngagementStats({ startDate, endDate });
    fetchInvitationsOverTime({ startDate, endDate, interval: 'daily' });
    fetchRsvpTrend({ startDate, endDate, interval: 'daily' });
    fetchRsvpDistribution({ startDate, endDate });
    fetchRecipients({ page: 1, limit: 10 });
  }, [
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpTrend,
    fetchRsvpDistribution,
    fetchRecipients,
  ]);

  // Guard against undefined rsvpTrend, invitationsOverTime, and rsvpDistribution
  const invitationsData = (invitationsOverTime || []).map((item) => ({
    name: new Date(item.date).toLocaleString('en-US', { weekday: 'short' }),
    invitations: item.invitations,
  }));

  const rsvpTrendData = (rsvpTrend || []).map((item) => ({
    name: new Date(item.date).toLocaleString('en-US', { weekday: 'short' }),
    accepted: item.accepted,
    declined: item.denied,
    pending: item.pending,
  }));

  const rsvpDistributionData = (rsvpDistribution || []).map((item) => ({
    name: item.status,
    value: item.value,
  }));

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="py-4 text-3xl font-bold">
            Welcome back, {user?.name || 'User'}!
          </h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <>
              <StatsCards data={engagementStats} />
              <Charts
                invitationsData={invitationsData}
                rsvpTrendData={rsvpTrendData}
                rsvpDistributionData={rsvpDistributionData}
              />
              <RecipientsTable
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                recipientsData={recipients || []}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
