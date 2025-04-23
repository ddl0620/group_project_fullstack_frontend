import { useState } from 'react';
import { useSelector } from 'react-redux';
import Charts from './components/Charts';
import RecipientsTable from './components/RecipientsTable';
import StatsCards from "@/pages/Dashboard/User/components/StatsCard.jsx";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const user = useSelector((state) => state.user.user);
    // Sample data for charts and table
    const invitationsData = [
        { name: 'Mon', invitations: 50 },
        { name: 'Tue', invitations: 70 },
        { name: 'Wed', invitations: 30 },
        { name: 'Thu', invitations: 90 },
        { name: 'Fri', invitations: 60 },
        { name: 'Sat', invitations: 80 },
        { name: 'Sun', invitations: 40 },
    ];

    const rsvpTrendData = [
        { name: 'Mon', accepted: 20, declined: 10, pending: 20 },
        { name: 'Tue', accepted: 30, declined: 15, pending: 25 },
        { name: 'Wed', accepted: 15, declined: 5, pending: 10 },
        { name: 'Thu', accepted: 40, declined: 20, pending: 30 },
        { name: 'Fri', accepted: 25, declined: 10, pending: 25 },
        { name: 'Sat', accepted: 35, declined: 15, pending: 30 },
        { name: 'Sun', accepted: 20, declined: 10, pending: 10 },
    ];

    const rsvpDistributionData = [
        { name: 'Accepted', value: 150 },
        { name: 'Declined', value: 50 },
        { name: 'Pending', value: 100 },
    ];

    const recipientsData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            rsvp: 'Accepted',
            respondedAt: '2023-07-24 10:30 AM',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            rsvp: 'Declined',
            respondedAt: '2023-07-24 11:00 AM',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: 3,
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            rsvp: 'Pending',
            respondedAt: '-',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            id: 4,
            name: 'Bob Wilson',
            email: 'bob.wilson@example.com',
            rsvp: 'Accepted',
            respondedAt: '2023-07-24 12:15 PM',
            avatar: '/placeholder.svg?height=32&width=32',
        },
    ];

    return (
        <div className="flex h-screen">
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto  p-4 md:p-6">
                    <h1 className="text-3xl font-bold py-4">
                        Welcome back, {user?.name}!
                    </h1>
                    <>
                        <StatsCards />
                        <Charts
                            invitationsData={invitationsData}
                            rsvpTrendData={rsvpTrendData}
                            rsvpDistributionData={rsvpDistributionData}
                        />
                        <RecipientsTable
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            recipientsData={recipientsData}
                        />
                    </>
                </main>
            </div>
        </div>
    );
}