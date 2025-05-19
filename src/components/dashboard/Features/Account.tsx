import { LogOut, Settings, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router'

export default function Account() {
    const { user, logout } = useAuth();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const navigate = useNavigate()
    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            setTimeout(() => {
                toast.success("You have been successfully logged out");
                logout();
                setLogoutLoading(false);
            }, 800);
        } catch (error) {
            console.error('Logout failed', error);
            toast.error("Logout failed, please try again");
            setLogoutLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="py-6 px-4 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="py-3 px-2 transition-all">
            <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="font-medium text-sm">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full w-fit mb-2 inline-block">
                {user.role || 'User'}
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
    );
}
