import React from 'react';
import { BarChart3Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { meetingMetrics } from "@/data/mockdata";

const MeetingStats = () => {
    return (
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-800 dark:to-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center text-blue-700 dark:text-blue-300">
                    <BarChart3Icon className="h-4 w-4 mr-2 text-sky-500" />
                    Your Meeting Stats
                </CardTitle>
                <CardDescription>This week's meeting activity</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {meetingMetrics.map((metric, index) => (
                        <Card key={index} className="border shadow-sm bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xl font-bold">{metric.value}</p>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs px-1.5 ${metric.change.startsWith('+')
                                                    ? 'text-green-500 border-green-200 bg-gradient-to-r from-green-50 to-green-50/80 dark:bg-green-900/20'
                                                    : 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20'}`}
                                            >
                                                {metric.change}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-sky-500">
                                        {metric.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default MeetingStats;
