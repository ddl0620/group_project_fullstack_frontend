// src/pages/Event/MyOrganizedEvents/EventRSVP.jsx
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";

// Mock data đơn giản cho lời mời, tuân thủ InvitationInterface
const mockInvitations = [
    {
        _id: 'inv1',
        sentAt: new Date('2025-04-15T10:00:00Z'),
        content: 'Tham gia sự kiện nhé! Tham gia sự kiện nhé! Tham gia sự kiện nhé!Tham gia sự kiện nhé!',
        eventId: '67fff267232f5df4eaf6dfcb',
        inviteeId: 'user1',
        invitorId: 'user0',
        isDeleted: false,
        createdAt: new Date('2025-04-15T10:00:00Z'),
        updatedAt: new Date('2025-04-15T10:00:00Z'),
        rsvpStatus: 'ACCEPTED', // Thêm trường rsvpStatus để hiển thị trạng thái
    },
    {
        _id: 'inv2',
        sentAt: new Date('2025-04-16T12:00:00Z'),
        content: 'Mời bạn đến sự kiện!',
        eventId: '67fff267232f5df4eaf6dfcb',
        inviteeId: 'user2',
        invitorId: 'user0',
        isDeleted: false,
        createdAt: new Date('2025-04-16T12:00:00Z'),
        updatedAt: new Date('2025-04-16T12:00:00Z'),
        rsvpStatus: 'PENDING',
    },
];

// Mock data đơn giản cho người dùng
const mockUsers = {
    user1: { _id: 'user1', name: 'Nguyễn An', avatar: '' },
    user2: { _id: 'user2', name: 'Trần Bình', avatar: '' },
};

const EventRSVP = ({ event }) => {
    // Lọc lời mời theo event._id và không bị xóa
    const invitations = mockInvitations
        .filter((inv) => inv.eventId === event._id && !inv.isDeleted)
        .map((invitation) => ({
            ...invitation,
            invitee: mockUsers[invitation.inviteeId] || {
                _id: invitation.inviteeId,
                name: 'Không xác định',
                avatar: '',
            },
        }));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return (
                    <Badge className="bg-green-100 text-green-800">Đã chấp nhận</Badge>
                );
            case 'DECLINED':
                return <Badge className="bg-red-100 text-red-800">Đã từ chối</Badge>;
            case 'PENDING':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>
                );
            default:
                return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
        }
    };

    const formatDateTime = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            return 'Không xác định';
        }
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            {invitations.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Người được mời</TableHead>
                            <TableHead>Nội dung lời mời</TableHead>
                            <TableHead>Trạng thái RSVP</TableHead>
                            <TableHead>Thời gian gửi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitations.map((invitation) => (
                            <TableRow key={invitation._id}>
                                <TableCell className="flex items-center gap-3">
                                    <CustomAvatar
                                        className="h-8 w-8"
                                        src={invitation.invitee.avatar}
                                        alt={invitation.invitee.name}
                                        fallbackText={invitation.invitee.name || 'N/A'}
                                    />
                                    <span>{invitation.invitee.name}</span>
                                </TableCell>
                                <TableCell>{invitation.content || 'Không có nội dung'}</TableCell>
                                <TableCell>{getStatusBadge(invitation.rsvpStatus)}</TableCell>
                                <TableCell>{formatDateTime(invitation.sentAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-gray-500">
                    Chưa có lời mời nào được gửi.
                </p>
            )}
        </div>
    );
};

export default EventRSVP;