import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions",
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function NewUser() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        console.log(data);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Handle success or error
        }, 1500);
        // Handle form submission here - API call to create account
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
            {/* Enhanced animated background blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-blue-500/15 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1.1, 1.4, 1],
                        x: [0, 20, -20, 0],
                        y: [0, -30, 20, 0],
                        opacity: [0.5, 0.8, 0.6, 0.9, 0.5]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-purple-500/15 blur-3xl"
                    animate={{
                        scale: [1, 1.4, 1.2, 1.5, 1],
                        x: [0, -30, 30, 0],
                        y: [0, 40, -20, 0],
                        opacity: [0.4, 0.7, 0.5, 0.8, 0.4]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute top-[40%] right-[30%] w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 0.9, 1.3, 1],
                        x: [0, 40, -40, 0],
                        y: [0, -20, 30, 0],
                        opacity: [0.3, 0.6, 0.4, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </div>

            <motion.div
                className="w-full max-w-md z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-none shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl overflow-hidden">
                    <CardHeader className="space-y-2 text-center pb-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mx-auto mb-2"
                        >
                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-green-500 p-3 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
                                <UserIcon className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Create an account</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 text-base">Sign up to get started with Glimpse</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Full name</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <UserIcon className="h-4 w-4 absolute top-3 left-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                        <Input
                                                            placeholder="John Doe"
                                                            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus-visible:ring-blue-500/30 h-12 dark:bg-slate-800/50"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Email address</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <MailIcon className="h-4 w-4 absolute top-3 left-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                        <Input
                                                            placeholder="you@example.com"
                                                            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus-visible:ring-blue-500/30 h-12 dark:bg-slate-800/50"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <LockIcon className="h-4 w-4 absolute top-3 left-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="********"
                                                            className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus-visible:ring-blue-500/30 h-12 dark:bg-slate-800/50"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute top-2.5 right-3 text-slate-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Confirm password</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <LockIcon className="h-4 w-4 absolute top-3 left-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="********"
                                                            className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus-visible:ring-blue-500/30 h-12 dark:bg-slate-800/50"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute top-2.5 right-3 text-slate-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm text-slate-600 dark:text-slate-300">
                                                        I agree to the{" "}
                                                        <Link to="/terms" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                                            Terms of Service
                                                        </Link>
                                                        {" "}and{" "}
                                                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                                            Privacy Policy
                                                        </Link>
                                                    </FormLabel>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="pt-2"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-lg font-medium shadow-lg shadow-blue-600/20 dark:shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 group relative overflow-hidden"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <span className="absolute right-full w-full h-full bg-white/10 skew-x-12 group-hover:right-[-200%] transition-all duration-1000 ease-in-out" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 dark:text-slate-400 rounded-full">or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500 transition-all duration-200 h-12 group">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform">
                                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163129 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                </svg>
                                <span className="font-medium">Google</span>
                            </Button>

                            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500 transition-all duration-200 h-12 group">
                                <svg width="20" height="20" viewBox="0 0 26 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform">
                                    <path d="M23.4927 26.6403L24.7973 18.3588H16.7611V12.9759C16.7611 10.7114 17.883 8.49872 21.4706 8.49872H25.1756V1.44655C23.018 1.10279 20.8378 0.91682 18.6527 0.890137C12.0385 0.890137 7.72038 4.86265 7.72038 12.0442V18.3588H0.388672V26.6403H7.72038V46.671H16.7611V26.6403H23.4927Z" fill="#337FFF" />
                                </svg>
                                <span className="font-medium">Facebook</span>
                            </Button>
                        </div>

                        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                            Already have an account?{" "}
                            <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}