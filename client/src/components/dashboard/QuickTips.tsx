import React from 'react';
import { InfoIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quickTips } from "@/data/mockdata";

const QuickTips = () => {
  const [showTips, setShowTips] = React.useState(true);
  
  if (!showTips) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs text-blue-500 hover:text-blue-600" 
        onClick={() => setShowTips(true)}
      >
        Show Tips
      </Button>
    );
  }
  
  return (
    <Card className="w-full bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
      <CardHeader className="pb-2 flex justify-between items-start">
        <CardTitle className="flex items-center text-base text-blue-700 dark:text-blue-300">
          <InfoIcon className="h-4 w-4 mr-2 text-sky-500" />
          Quick Tips
        </CardTitle>
        <Button 
          variant="link" 
          className="text-xs text-blue-500 hover:text-blue-600 px-0" 
          onClick={() => setShowTips(false)}
        >
          Hide Tips
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">{tip}</p>
            </div>
          ))}
          <Button variant="link" className="text-xs text-blue-500 hover:text-blue-600 px-0">
            View all tips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTips;
