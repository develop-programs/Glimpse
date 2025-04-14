import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'


export default function Schedule() {
  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Schedule Meeting</DialogTitle>
      </DialogHeader>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 py-5"
      >
        <div className="grid gap-2">
          <Label htmlFor="meeting-title" className="text-sm font-medium">Meeting Title</Label>
          <Input id="meeting-title" placeholder="What's this meeting about?" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input id="date" type="date" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time" className="text-sm font-medium">Time</Label>
            <Input id="time" type="time" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>
        <div className="grid gap-2 mt-2">
          <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
          <Input id="description" placeholder="Meeting agenda or notes" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
        </div>
      </motion.div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg font-medium shadow-md">
          Schedule Meeting
        </Button>
      </motion.div>

      <DialogFooter className="mt-4 text-xs flex gap-2 text-emerald-600 dark:text-emerald-400 pt-2 border-t">
        <Info className="h-3 w-3" />
        Calendar invites will be sent to all participants
      </DialogFooter>
    </div>
  )
}
