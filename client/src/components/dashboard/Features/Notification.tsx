import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Define notification structure
interface INotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // Mock notifications - replace with actual API call in production
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        title: 'New Assignment',
        description: 'Your instructor has posted a new assignment.',
        time: '10 min ago',
        read: false,
      },
      {
        id: '2',
        title: 'Upcoming Deadline',
        description: 'Assignment #3 is due in 48 hours.',
        time: '1 hour ago',
        read: false,
      },
      {
        id: '3',
        title: 'Grade Posted',
        description: 'Your grade for Java Programming has been posted.',
        time: '2 days ago',
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(note => !note.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(note =>
      note.id === id ? { ...note, read: true } : note
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(note => ({ ...note, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="size-5 bg-primary text-primary-foreground text-xs grid place-content-center rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <Separator className="my-1" />

      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${notification.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/20'}`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <div className="flex space-x-1 ml-2">
                  {!notification.read && (
                    <button
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 size-5 rounded-full flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 size-5 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => removeNotification(notification.id)}
                    title="Remove notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{notification.description}</p>
              <p className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">{notification.time}</p>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="pt-2 pb-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      )}
    </div>
  )
}