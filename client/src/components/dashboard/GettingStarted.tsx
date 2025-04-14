import React from 'react';
import { motion } from "framer-motion";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import NewMeeting from './Features/NewMeeting';
import Schedule from './Features/Schedule';
import TeamMember from './Features/TeamMember';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  completed: boolean;
}

interface GettingStartedProps {
  steps: Step[];
  onDismiss: () => void;
}

const GettingStarted = ({ steps, onDismiss }: GettingStartedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
              Getting Started with Glimpse
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
          <CardDescription>Complete these steps to get the most out of Glimpse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="border rounded-lg p-4 bg-white dark:bg-slate-800"
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant={i === 0 ? "default" : "outline"}
                          className={`mt-3 h-8 text-xs ${i === 0 ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                        >
                          {step.action}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {
                          step.id === 1 ? (
                            <NewMeeting />
                          ) :
                            step.id === 3 ? <Schedule /> : (
                              <TeamMember />
                            )
                        }
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GettingStarted;
