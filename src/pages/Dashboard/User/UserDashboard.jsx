// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Charts from './components/Charts';
import RecipientsTable from './components/RecipientsTable';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsCards from "@/pages/Dashboard/User/components/StatsCard.jsx";
import BrowseEvent from "@/pages/Event/BrowseEvent.jsx";
import DiscussionPage from "@/pages/Discussion/DiscussionPage.jsx";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const mainContent = () => {
        if (activeSection === 'dashboard') {
            return (
                <>
                    <div className="mb-4 flex justify-end">
                        <p className="text-sm text-gray-600">Wed // July 26th, 2023</p>
                    </div>
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
            );
        }
        else if(activeSection === 'events'){
            return <BrowseEvent />;
        }
        else if(activeSection === 'discussions'){
            return <DiscussionPage/>;
        }
        else{
            return (
                <div className="flex h-full items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Coming Soon</CardTitle>
                            <CardDescription>
                                This section is under development and will be available soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                The{' '}
                                {activeSection === 'events'
                                    ? 'My Events'
                                    : activeSection === 'messages'
                                        ? 'Messages'
                                        : activeSection === 'profile'
                                            ? 'Profile'
                                            : 'Premium Version'}{' '}
                                module is currently being built. Please check back later.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => setActiveSection('dashboard')}>
                                Return to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }
    }
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    isMobile={isMobile}
                    setSidebarOpen={setSidebarOpen}
                    activeSection={activeSection}
                    user={user}
                />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                    {
                        mainContent()
                    }
                </main>
            </div>
        </div>
    );
}