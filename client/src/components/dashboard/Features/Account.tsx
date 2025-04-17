import { LogOut, Settings, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function Account() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)

    // Replace with actual user data from your auth context/state management
    const [user] = useState({
        name: 'User Smith',
        email: 'user@example.com',
        role: 'Pro User',
        avatar: 'https://github.com/shadcn.png' // Add a default or placeholder avatar URL
    })

    useEffect(() => {
        // Here you would fetch the user data from your API/auth system
        const fetchUserData = async () => {
            setLoading(true)
            try {
                // Mock API call - replace with actual API call
                // const response = await fetch('/api/user/profile')
                // const userData = await response.json()
                // setUser(userData)

                // Simulating API delay for demo
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            } catch (error) {
                console.error('Failed to fetch user data', error)
                toast.error("Failed to load user profile data")
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleLogout = async () => {
        setLogoutLoading(true)
        try {
            // Add actual logout logic here - e.g., API call to logout endpoint
            // await fetch('/api/auth/logout', { method: 'POST' })

            // Clear local storage/cookies
            localStorage.removeItem('token') // Adjust based on your auth implementation

            // Simulate API delay for demo
            setTimeout(() => {
                toast.success("You have been successfully logged out")
                navigate('/login')
                setLogoutLoading(false)
            }, 800)
        } catch (error) {
            console.error('Logout failed', error)
            toast.error("Logout failed, please try again")
            setLogoutLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="py-6 px-4 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="py-3 px-2 transition-all">
            <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full w-fit mb-2 inline-block">
                {user.role}
            </span>

            <Separator className="my-2" />

            <div className="flex flex-col space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8 hover:bg-primary/5 transition-colors"
                    onClick={() => navigate('/profile')}
                >
                    <User className="h-3.5 w-3.5 mr-2" />
                    My Profile
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8 hover:bg-primary/5 transition-colors"
                    onClick={() => navigate('/settings')}
                >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Settings
                </Button>
            </div>

            <Separator className="my-2" />

            <Button
                variant="destructive"
                size="sm"
                className="w-full text-xs mt-1 h-8 transition-colors"
                onClick={handleLogout}
                disabled={logoutLoading}
            >
                {logoutLoading ? (
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                )}
                {logoutLoading ? "Logging out..." : "Logout"}
            </Button>
        </div>
    )
}
