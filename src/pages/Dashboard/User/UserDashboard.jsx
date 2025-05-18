import { useState, useEffect, useRef } from 'react';
import { subDays } from 'date-fns';
import { Mail, MessageSquare, User, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useUserStatis } from '@/hooks/useUserStatis';
import { InvitationTrend } from '@/pages/Dashboard/User/components/InvitationTrend.jsx';
import { RsvpSummary } from '@/pages/Dashboard/User/components/RsvpSummary.jsx';
import { useSelector } from 'react-redux';

export default function UserDashboard() {
  const {
    invitationsOverTime,
    rsvpDistribution,
    loadingEngagementStats,
    loadingInvitations,
    loadingRsvpDistribution,
    errorEngagementStats,
    errorInvitations,
    errorRsvpDistribution,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  } = useUserStatis();

  const user = useSelector((state) => state.user.user);
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Fetch all data
  useEffect(() => {
    const startDate = date.from.toISOString().split('T')[0];
    const endDate = date.to.toISOString().split('T')[0];
    Promise.all([
      fetchEngagementStats(),
      fetchInvitationsOverTime(startDate, endDate),
      fetchRsvpDistribution(),
      fetchRecipients(1, 10),
    ]).catch((err) => {
      console.error('Failed to fetch data:', err);
    });
  }, [
    date.from,
    date.to,
    fetchEngagementStats,
    fetchInvitationsOverTime,
    fetchRsvpDistribution,
    fetchRecipients,
  ]);

  // Map rsvp distribution data to numeric data
  const numericData =
    rsvpDistribution &&
    Array.isArray(rsvpDistribution) &&
    rsvpDistribution.length > 0
      ? (() => {
          // Calculate total responses
          const totalResponses = rsvpDistribution.reduce(
            (sum, item) => sum + (item.value || 0),
            0
          );

          // Find specific RSVP types
          const findRsvpValue = (status) => {
            const item = rsvpDistribution.find(
              (item) => item.status === status || item.name === status
            );
            return item ? item.value : 0;
          };

          const acceptedCount = findRsvpValue('Accepted');
          const declinedCount = findRsvpValue('Denied');
          const pendingCount = findRsvpValue('Pending');

          return [
            {
              title: 'Total Responses',
              value: totalResponses,
              percentage: 0,
              icon: <Mail className="text-muted-foreground h-4 w-4" />,
            },
            {
              title: 'Accepted',
              value: acceptedCount,
              percentage:
                totalResponses > 0
                  ? Math.round((acceptedCount / totalResponses) * 100)
                  : 0,
              icon: <Users className="text-muted-foreground h-4 w-4" />,
            },
            {
              title: 'Declined',
              value: declinedCount,
              percentage:
                totalResponses > 0
                  ? Math.round((declinedCount / totalResponses) * 100)
                  : 0,
              icon: <User className="text-muted-foreground h-4 w-4" />,
            },
            {
              title: 'Pending',
              value: pendingCount,
              percentage:
                totalResponses > 0
                  ? Math.round((pendingCount / totalResponses) * 100)
                  : 0,
              icon: <MessageSquare className="text-muted-foreground h-4 w-4" />,
            },
          ];
        })()
      : [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-2 pt-6 font-semibold sm:p-4 md:p-8">
      <div className="flex-1 space-y-4 p-4 pt-6 sm:p-6 md:p-8">
        <div className={'text-lg font-bold sm:text-lg md:text-2xl lg:text-4xl'}>
          Welcome, {user?.name || 'User'}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {errorEngagementStats ? (
              <div className="text-red-500">
                Error loading engagement stats: {errorEngagementStats}
              </div>
            ) : loadingEngagementStats ? (
              <div>Loading engagement stats...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {numericData.map((data, index) => (
                  <div key={index}>
                    <Card className="transition-shadow duration-500 hover:shadow-xl">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {data.title}
                        </CardTitle>
                        {data.icon}
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold sm:text-2xl">
                          {data.value}
                        </div>
                        <p
                          className={`text-xs font-medium ${
                            data.title === 'Declined'
                              ? 'text-red-500'
                              : 'text-blue-500'
                          }`}
                        >
                          {data.title !== 'Total Responses'
                            ? `${data.percentage}% of total`
                            : 'Total responses'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              {errorInvitations ? (
                <div className="text-red-500">
                  Error loading invitations: {errorInvitations}
                </div>
              ) : loadingInvitations ? (
                <div>Loading invitations...</div>
              ) : (
                <div className="col-span-1 lg:col-span-4">
                  <InvitationTrend data={invitationsOverTime} />
                </div>
              )}

              {errorRsvpDistribution ? (
                <div className="text-red-500">
                  Error loading RSVP distribution: {errorRsvpDistribution}
                </div>
              ) : loadingRsvpDistribution ? (
                <div>Loading RSVP distribution...</div>
              ) : (
                <div className="col-span-1 lg:col-span-3">
                  <RsvpSummary data={rsvpDistribution} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {errorInvitations ? (
                <div className="text-red-500">
                  Error loading invitations: {errorInvitations}
                </div>
              ) : loadingInvitations ? (
                <div>Loading invitations...</div>
              ) : (
                <div className="transition-shadow duration-500 hover:shadow-xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>RSVP Trend</CardTitle>
                      <CardDescription>
                        RSVP responses over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {invitationsOverTime &&
                          invitationsOverTime.slice(0, 7).map((item, index) => {
                            const date = new Date(item.date);
                            const formattedDate = date.toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              }
                            );

                            return (
                              <div
                                key={index}
                                className="flex flex-col space-y-2 rounded-md border p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {formattedDate}
                                  </span>
                                  <span className="text-muted-foreground text-sm">
                                    {item.invitations} invitations
                                  </span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-gray-100">
                                  <div
                                    className="h-2.5 rounded-full bg-blue-600"
                                    style={{
                                      width: `${Math.min(100, (item.invitations / 10) * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {errorRsvpDistribution ? (
                <div className="text-red-500">
                  Error loading RSVP distribution: {errorRsvpDistribution}
                </div>
              ) : loadingRsvpDistribution ? (
                <div>Loading RSVP distribution...</div>
              ) : (
                <div className="transition-shadow duration-500 hover:shadow-xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Details</CardTitle>
                      <CardDescription>
                        Detailed breakdown of responses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {rsvpDistribution &&
                          rsvpDistribution.map((item, index) => {
                            const status = item.status || item.name;
                            let bgColor = 'bg-gray-100';
                            let textColor = 'text-gray-800';

                            if (status === 'Accepted') {
                              bgColor = 'bg-green-100';
                              textColor = 'text-green-800';
                            } else if (status === 'Declined') {
                              bgColor = 'bg-red-100';
                              textColor = 'text-red-800';
                            } else if (status === 'Pending') {
                              bgColor = 'bg-yellow-100';
                              textColor = 'text-yellow-800';
                            }

                            return (
                              <div
                                key={index}
                                className={`rounded-lg p-4 ${bgColor}`}
                              >
                                <h4
                                  className={`text-lg font-semibold ${textColor}`}
                                >
                                  {status}
                                </h4>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-muted-foreground text-sm">
                                      Count
                                    </p>
                                    <p className="text-xl font-bold">
                                      {item.value}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-sm">
                                      Details
                                    </p>
                                    <p className="text-sm">
                                      {status === 'Accepted'
                                        ? 'Ready to attend'
                                        : status === 'Declined'
                                          ? 'Cannot attend'
                                          : 'Awaiting response'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
