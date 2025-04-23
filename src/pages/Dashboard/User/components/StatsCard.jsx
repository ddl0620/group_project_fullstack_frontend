// src/pages/components/StatsCards.jsx
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Users, Clock } from 'lucide-react';

const StatsCards = () => {
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
                            <h3 className="mr-2 text-2xl font-bold">300</h3>
                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-600">
                                +15%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Previous week: 260</p>
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
                            <h3 className="mr-2 text-2xl font-bold">150</h3>
                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-600">
                                +10%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Previous week: 135</p>
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
                            <h3 className="mr-2 text-2xl font-bold">50</h3>
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                                -5%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Previous week: 55</p>
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
                            <h3 className="mr-2 text-2xl font-bold">100</h3>
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-600">
                                +20%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Previous week: 80</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsCards;