import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MultipleSelector, { Option } from '@/components/ui/MultiSelect'
import { useState } from "react"
import { CheckCircle, Loader2, Calendar } from "lucide-react"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    meetingTitle: z.string().min(1, {
        message: "Meeting title is required",
    }),
    meetingDescription: z.string().optional(),
    email: z.string().email({
        message: "Please enter a valid email address",
    }).optional(),
    members: z.array(z.string()).optional(),
    role: z.string().min(1, {
        message: "Please select a role",
    }),
})

const ROLES = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
    { label: "Developer", value: "developer" },
]

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

export default function TeamMember() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [inviteType, setInviteType] = useState<'existing' | 'new'>('existing')
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            meetingTitle: "",
            meetingDescription: "",
            email: "",
            members: [],
            role: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        setError(null)
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            console.log({
                ...values,
                inviteType,
            })
            
            setSuccess(true)
            form.reset()
            
            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError("Failed to send meeting invitation. Please try again.")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold">Meeting Invitation</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-2">
                    Invite team members to your meeting. You can invite existing members or send invites to new members.
                </DialogDescription>
            </DialogHeader>
            
            {success && (
                <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                        Meeting invitations sent successfully!
                    </AlertDescription>
                </Alert>
            )}
            
            {error && (
                <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900">
                    <AlertDescription className="text-red-800 dark:text-red-300">
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="meetingTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Meeting Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Quarterly Review" 
                                        {...field} 
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="meetingDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Meeting Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Details about the meeting agenda"
                                        {...field}
                                        rows={3}
                                        className="resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Tabs 
                        defaultValue="existing" 
                        className="w-full"
                        onValueChange={(value) => setInviteType(value as 'existing' | 'new')}
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="existing">Existing Members</TabsTrigger>
                            <TabsTrigger value="new">New Member</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="existing">
                            <FormField
                                control={form.control}
                                name="members"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Select Team Members</FormLabel>
                                        <FormControl>
                                            <MultipleSelector
                                                {...field}
                                                defaultOptions={OPTIONS}
                                                value={(field.value || []).map(v => ({ label: OPTIONS.find(o => o.value === v)?.label || v, value: v }))}
                                                onChange={options => field.onChange(options.map(option => option.value))}
                                                placeholder="Search and select team members"
                                                emptyIndicator={
                                                    <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                                                        No results found
                                                    </p>
                                                } 
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground mt-1">
                                            Select existing team members to invite to the meeting
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                        
                        <TabsContent value="new">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Invite by Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="email@example.com" 
                                                type="email" 
                                                {...field} 
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground mt-1">
                                            Send invitation to a new member via email
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                    
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Participant Role</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {ROLES.map(role => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Invitations...
                            </>
                        ) : (
                            <>
                                <Calendar className="mr-2 h-4 w-4" />
                                Send Meeting Invitations
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
