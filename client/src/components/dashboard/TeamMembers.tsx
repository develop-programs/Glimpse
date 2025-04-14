import React from 'react';
import { UserIcon, PlusCircleIcon, MessageCircleIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { teamMembers } from "@/data/mockdata";

const TeamMembers = () => {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-800 dark:to-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base text-blue-700 dark:text-blue-300">
          <UserIcon className="h-4 w-4 mr-2 text-sky-500" />
          Team Members
        </CardTitle>
        <CardDescription>People you frequently connect with</CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-2">
        <div className="space-y-2">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-sky-50 dark:hover:bg-slate-800/60 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-sky-400/30 to-blue-500/30 text-blue-500">
                    {member.initial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.status}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50/80">
                  <MessageCircleIcon className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50/80">
                  <VideoIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">8 team members total</p>
          <Button variant="outline" size="sm" className="h-8 text-xs border-blue-100 text-blue-600 hover:bg-blue-50 dark:border-slate-700">
            <PlusCircleIcon className="h-3.5 w-3.5 mr-1" /> Invite More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
