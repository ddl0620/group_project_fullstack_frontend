// src/pages/components/Charts.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Bar,
    BarChart as RechartsBarChart,
    Line,
    LineChart as RechartsLineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const Charts = ({ invitationsData, rsvpTrendData, rsvpDistributionData }) => {
    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <CardTitle className="text-base font-medium">Invitations Sent</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                This week <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>This Month</DropdownMenuItem>
                            <DropdownMenuItem>This Year</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                                data={invitationsData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis hide={true} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded border bg-white p-2 shadow-sm">
                                                    <p className="text-xs">{`${payload[0].value} Invitations`}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="invitations" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <CardTitle className="text-base font-medium">RSVP Trend</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                This week <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>This Month</DropdownMenuItem>
                            <DropdownMenuItem>This Year</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                                data={rsvpTrendData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis hide={true} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded border bg-white p-2 shadow-sm">
                                                    <p className="text-xs">{`Accepted: ${payload[0].value}`}</p>
                                                    <p className="text-xs">{`Declined: ${payload[1].value}`}</p>
                                                    <p className="text-xs">{`Pending: ${payload[2].value}`}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="accepted"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: 'white', stroke: '#10B981', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="declined"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: 'white', stroke: '#EF4444', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pending"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: 'white', stroke: '#F59E0B', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex justify-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="text-xs">Accepted</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            <span className="text-xs">Declined</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                            <span className="text-xs">Pending</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <CardTitle className="text-base font-medium">RSVP Distribution</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                This week <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>This Month</DropdownMenuItem>
                            <DropdownMenuItem>This Year</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={rsvpDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {rsvpDistributionData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                        {rsvpDistributionData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className="mr-1 h-3 w-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="text-xs">{entry.name}: {entry.value}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Charts;