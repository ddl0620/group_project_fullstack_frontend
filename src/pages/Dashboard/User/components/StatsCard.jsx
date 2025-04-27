// src/pages/components/StatsCards.jsx
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Users, Clock } from 'lucide-react';

// Utility function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0; // Avoid division by zero
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10; // Round to 1 decimal place
};

const StatsCards = ({ data }) => {
  // Default values if data is not available
  const stats = data || {};
  const currentStats = {
    totalInvitations: stats.totalInvitations || 0,
    acceptedRSVPs: stats.acceptedRSVPs || 0,
    deniedRSVPs: stats.deniedRSVPs || 0,
    pendingRSVPs: stats.pendingRSVPs || 0,
  };
  const previousStats = stats.previousWeek || {};
  const previousWeek = {
    totalInvitations: previousStats.totalInvitations || 0,
    acceptedRSVPs: previousStats.acceptedRSVPs || 0,
    deniedRSVPs: previousStats.deniedRSVPs || 0,
    pendingRSVPs: previousStats.pendingRSVPs || 0,
  };

  // Calculate percentage changes
  const invitationsChange = calculatePercentageChange(
    currentStats.totalInvitations,
    previousWeek.totalInvitations
  );
  const acceptedChange = calculatePercentageChange(
    currentStats.acceptedRSVPs,
    previousWeek.acceptedRSVPs
  );
  const deniedChange = calculatePercentageChange(
    currentStats.deniedRSVPs,
    previousWeek.deniedRSVPs
  );
  const pendingChange = calculatePercentageChange(
    currentStats.pendingRSVPs,
    previousWeek.pendingRSVPs
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center p-4">
          <div className="mr-4 rounded-full bg-blue-50 p-3">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Invitations Sent <span className="text-xs">(This week)</span>
            </p>
            <div className="flex items-center">
              <h3 className="mr-2 text-2xl font-bold">
                {currentStats.totalInvitations}
              </h3>
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  invitationsChange >= 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {invitationsChange >= 0 ? '+' : ''}
                {invitationsChange}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Previous week: {previousWeek.totalInvitations}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <div className="mr-4 rounded-full bg-green-50 p-3">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Accepted RSVPs <span className="text-xs">(This week)</span>
            </p>
            <div className="flex items-center">
              <h3 className="mr-2 text-2xl font-bold">
                {currentStats.acceptedRSVPs}
              </h3>
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  acceptedChange >= 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {acceptedChange >= 0 ? '+' : ''}
                {acceptedChange}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Previous week: {previousWeek.acceptedRSVPs}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <div className="mr-4 rounded-full bg-red-50 p-3">
            <Users className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Declined RSVPs <span className="text-xs">(This week)</span>
            </p>
            <div className="flex items-center">
              <h3 className="mr-2 text-2xl font-bold">
                {currentStats.deniedRSVPs}
              </h3>
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  deniedChange >= 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {deniedChange >= 0 ? '+' : ''}
                {deniedChange}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Previous week: {previousWeek.deniedRSVPs}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <div className="mr-4 rounded-full bg-amber-50 p-3">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Pending RSVPs <span className="text-xs">(This week)</span>
            </p>
            <div className="flex items-center">
              <h3 className="mr-2 text-2xl font-bold">
                {currentStats.pendingRSVPs}
              </h3>
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  pendingChange >= 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {pendingChange >= 0 ? '+' : ''}
                {pendingChange}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Previous week: {previousWeek.pendingRSVPs}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
