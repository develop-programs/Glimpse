import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Info, CalendarClock, Clock, Users, FileText } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import MultipleSelector, { Option } from '@/components/ui/MultiSelect'
import { DatetimePicker } from '@/components/ui/DateTimePicker'

const OPTIONS: Option[] = [
  { label: 'John Smith', value: 'john.smith@example.com' },
  { label: 'Sarah Johnson', value: 'sarah.johnson@example.com' },
  { label: 'Michael Brown', value: 'michael.brown@example.com' },
  { label: 'Emily Davis', value: 'emily.davis@example.com' },
  { label: 'David Wilson', value: 'david.wilson@example.com' },
  { label: 'Jessica Taylor', value: 'jessica.taylor@example.com' },
  { label: 'Robert Martinez', value: 'robert.martinez@example.com' },
  { label: 'Jennifer Lee', value: 'jennifer.lee@example.com' },
  { label: 'Thomas Anderson', value: 'thomas.anderson@example.com', disable: true },
  { label: 'Amanda White', value: 'amanda.white@example.com', disable: true },
  { label: 'Daniel Clark', value: 'daniel.clark@example.com' },
];


export default function Schedule() {
  return (
    <div className="space-y-4">
      <DialogHeader className="pb-1 border-b">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-sidebar-primary bg-clip-text text-transparent flex items-center gap-1">
            <CalendarClock className="w-5 h-5 text-primary" />
            Schedule New Meeting
          </DialogTitle>
        </motion.div>
      </DialogHeader>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-3 py-2"
      >
        <div className="bg-card/50 p-2 rounded-lg border border-border">
          <Label htmlFor="meeting-title" className="text-sm font-medium mb-1 flex items-center gap-1">
            <span className="text-primary">Title</span>
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="meeting-title"
            placeholder="Enter meeting title"
            className="mt-0.5 bg-background focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="bg-card/50 p-2 rounded-lg border border-border">
            <Label htmlFor="time" className="text-sm font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              <span>Select Date and Time</span>
              <span className="text-destructive">*</span>
            </Label>
            <DatetimePicker format={[
              ["months", "days", "years"],
              ["hours", "minutes", "am/pm"],
            ]} className='w-full' />
          </div>
        </div>

        <div className="bg-card/50 p-2 rounded-lg border border-border">
          <Label htmlFor="participants" className="text-sm font-medium mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-primary" />
            <span>Participants</span>
          </Label>
          <MultipleSelector
            defaultOptions={OPTIONS}
            placeholder="Select participants"
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
          />
        </div>

        <div className="bg-card/50 p-2 rounded-lg border border-border">
          <Label htmlFor="description" className="text-sm font-medium mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-primary" />
            <span>Description</span>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Meeting agenda, topics to discuss, or additional notes"
            className="mt-0.5 min-h-24 bg-background focus:ring-primary"
          />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="mt-3"
      >
        <Button className="w-full py-4 bg-gradient-to-r from-primary to-sidebar-primary hover:from-primary/90 hover:to-sidebar-primary/90 text-base font-medium shadow-md shadow-primary/20 dark:shadow-primary/10 rounded-lg">
          Schedule Meeting
        </Button>
      </motion.div>

      <DialogFooter className="mt-2 text-xs flex items-center gap-1 text-chart-3 pt-2 border-t">
        <Info className="h-3 w-3 text-chart-3" />
        <span>Calendar invites will be sent to all participants</span>
      </DialogFooter>
    </div>
  )
}
