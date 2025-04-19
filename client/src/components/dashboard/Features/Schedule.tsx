import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Info, CalendarClock, Clock, Users, FileText, Lock, Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import MultipleSelector, { Option } from '@/components/ui/MultiSelect'
import { DatetimePicker } from '@/components/ui/DateTimePicker'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, { message: "Meeting title is required" }),
  dateTime: z.date({ required_error: "Please select a date and time" }),
  isProtected: z.boolean(),
  password: z.string().optional(),
  participants: z.array(z.string()).optional(),
  description: z.string().optional(),
})

export default function Schedule() {
  // Define form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateTime: new Date(),
      isProtected: true,
      password: "",
      participants: [],
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const isProtected = form.watch("isProtected")

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-3 py-2"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="bg-card/50 p-2 rounded-lg border border-border">
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <span className="text-primary">Title</span>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter meeting title"
                      className="mt-0.5 bg-background focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Field */}
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="bg-card/50 p-2 rounded-lg border border-border">
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>Select Date and Time</span>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatetimePicker
                      value={field.value}
                      onChange={field.onChange}
                      format={[
                        ["months", "days", "years"],
                        ["hours", "minutes", "am/pm"],
                      ]}
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Protected Meeting Toggle */}
            <div className="bg-card/50 p-2 rounded-lg border border-border space-y-2">
              <FormField
                control={form.control}
                name="isProtected"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Lock className="size-3 text-primary" />
                      <FormLabel>Protected</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-3 space-y-0">
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter Password'
                        disabled={!isProtected}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/3 flex items-center gap-1"
                      disabled={!isProtected}
                      onClick={() => {
                        // Generate random password
                        const randomPassword = Math.random().toString(36).slice(2, 10);
                        form.setValue("password", randomPassword);
                      }}
                    >
                      <Sparkles className='size-3' />
                      <span className="text-xs font-medium">Generate</span>
                    </Button>
                  </FormItem>
                )}
              />
            </div>

            {/* Participants Field */}
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem className="bg-card/50 p-2 rounded-lg border border-border">
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <Users className="w-3 h-3 text-primary" />
                    <span>Participants</span>
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      defaultOptions={OPTIONS}
                      placeholder="Select participants"
                      value={field.value?.map(value => {
                        const option = OPTIONS.find(o => o.value === value);
                        return option ? { label: option.label, value: option.value } : { label: value, value };
                      })}
                      onChange={(options) => field.onChange(options.map(o => o.value))}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="bg-card/50 p-2 rounded-lg border border-border">
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3 text-primary" />
                    <span>Description</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Meeting agenda, topics to discuss, or additional notes"
                      className="mt-0.5 min-h-24 bg-background focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mt-3"
          >
            <Button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-sidebar-primary hover:from-primary/90 hover:to-sidebar-primary/90 text-base font-medium shadow-md shadow-primary/20 dark:shadow-primary/10 rounded-lg"
            >
              Schedule Meeting
            </Button>
          </motion.div>
        </form>
      </Form>

      <DialogFooter className="mt-2 text-xs flex items-center gap-1 text-chart-3 pt-2 border-t">
        <Info className="h-3 w-3 text-chart-3" />
        <span>Calendar invites will be sent to all participants</span>
      </DialogFooter>
    </div>
  )
}