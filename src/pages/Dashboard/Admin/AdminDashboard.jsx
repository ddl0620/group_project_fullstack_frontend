// src/pages/Dashboard/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Charts from '../User/components/Charts';
import RecipientsTable from '../User/components/RecipientsTable';
import StatsCards from '../User/components/StatsCard';
import { useUserStatis } from '@/hooks/useUserStatis';
import UserManagementTable from './components/UserManagementTable';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const user = useSelector((state) => state.user.user);
    const {
        // // các hàm fetch gọi API để lấy dữ liệu thống kê
        // fetchEngagementStats,
        // fetchInvitationsOverTime,
        // fetchRsvpTrend,
        // fetchRsvpDistribution,
        // fetchRecipients,`

        // // các biến
        // engagementStats,
        // invitationsOverTime,
        // rsvpTrend,
        // rsvpDistribution,
        
        // recipients,     // lưu trữ dữ liệu trả về từ API
        // totalRecipients,

        // các trạng thái tải dữ liệu và lỗi
        loading,
        error,
    } = useUserStatis();

    // useEffect(() => {
    //     const startDate = '2025-01-01'; // Example: start of the week
    //     const endDate = '2025-04-24'; // Example: end of the week

    //     fetchEngagementStats({ startDate, endDate });
    //     fetchInvitationsOverTime({ startDate, endDate, interval: 'daily' });
    //     fetchRsvpTrend({ startDate, endDate, interval: 'daily' });
    //     fetchRsvpDistribution({ startDate, endDate });
    //     fetchRecipients({ page: 1, limit: 10 });
    // }, [
    //     fetchEngagementStats,
    //     fetchInvitationsOverTime,
    //     fetchRsvpTrend,
    //     fetchRsvpDistribution,
    //     fetchRecipients,
    // ]);

    // // Guard against undefined rsvpTrend, invitationsOverTime, and rsvpDistribution
    // const invitationsData = (invitationsOverTime || []).map((item) => ({
    //     name: new Date(item.date).toLocaleString('en-US', { weekday: 'short' }),
    //     invitations: item.invitations,
    // }));

    // const rsvpTrendData = (rsvpTrend || []).map((item) => ({
    //     name: new Date(item.date).toLocaleString('en-US', { weekday: 'short' }),
    //     accepted: item.accepted,
    //     declined: item.denied,
    //     pending: item.pending,
    // }));

    // const rsvpDistributionData = (rsvpDistribution || []).map((item) => ({
    //     name: item.status,
    //     value: item.value,
    // }));

    /* SAMPLE DATA */
    const invitationsData = [
        { name: 'Mon', invitations: 50 },
        { name: 'Tue', invitations: 80 },
        { name: 'Wed', invitations: 65 },
        { name: 'Thu', invitations: 90 },
        { name: 'Fri', invitations: 120 },
        { name: 'Sat', invitations: 70 },
        { name: 'Sun', invitations: 100 },];
    
    const rsvpTrendData = [
        { name: 'Mon', accepted: 40, declined: 10, pending: 5 },
        { name: 'Tue', accepted: 60, declined: 15, pending: 10 },
        { name: 'Wed', accepted: 55, declined: 20, pending: 15 },
        { name: 'Thu', accepted: 70, declined: 25, pending: 20 },
        { name: 'Fri', accepted: 90, declined: 30, pending: 25 },
        { name: 'Sat', accepted: 80, declined: 20, pending: 15 },
        { name: 'Sun', accepted: 100, declined: 35, pending: 10 },];
    
    const rsvpDistributionData = [
        { name: 'Accepted', value: 60 },
        { name: 'Declined', value: 25 },
        { name: 'Pending', value: 15 },
    ];

    const recipientsData = [
        { name: 'Luong Chi Bach', email: 'bach@example.com'},
        { name: 'Khong Quoc Khanh', email: 'khanh@example.com' },
        { name: 'Dao Duc Lam', email: 'lam@example.com' },
        { name: 'Nguyen Van A', email: 'nguyenvana@example.com' },
        { name: 'Tran Thi B', email: 'tranthib@example.com' },
        { name: 'Pham Van C', email: 'phamvanc@example.com' },
        { name: 'Le Thi D', email: 'lethid@example.com' },
        { name: 'Hoang Van E', email: 'hoangvane@example.com' },
        { name: 'Nguyen Thi F', email: 'nguyenthif@example.com' },
        { name: 'Tran Van G', email: 'tranvang@example.com' },
        { name: 'Pham Thi H', email: 'phamthih@example.com' },
        { name: 'Le Van I', email: 'levani@example.com' },
        { name: 'Nguyen Van J', email: 'nguyenvanj@example.com' },
        { name: 'Tran Thi K', email: 'tranthik@example.com' },
        { name: 'Pham Van L', email: 'phamvanl@example.com' },
        { name: 'Le Thi M', email: 'lethim@example.com' },
        { name: 'Hoang Van N', email: 'hoangvann@example.com' },
        { name: 'Nguyen Thi O', email: 'nguyenthio@example.com' },
        { name: 'Tran Van P', email: 'tranvanp@example.com' },
        { name: 'Pham Thi Q', email: 'phamthiq@example.com' },
    ];

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
                <StatsCards 
                    // data={engagementStats} 
                    data={{ totalInvitations: 3200, totalRSVPs: 1200 }}
                />
                <Charts
                    invitationsData={invitationsData}
                    rsvpTrendData={rsvpTrendData}
                    rsvpDistributionData={rsvpDistributionData}
                />
                <RecipientsTable
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    // recipientsData={recipients || []}
                    recipientsData={recipientsData}
                />
                {/* <UserManagementTable/> */}
                </>
            )}
            </main>
        </div>
        </div>
    );
}
