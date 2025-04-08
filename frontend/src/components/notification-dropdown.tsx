"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notificationsApi } from '@/lib/api';
import { Notification } from '@/lib/types';
import NotificationItem from './notification-item';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/context/auth-context';
import { getAuthHeader } from '@/lib/auth';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setIsLoading(true);
    try {
      const result = await notificationsApi.getUserNotifications(user.id, 1, 5);
      setNotifications(result.data);
      
      // Update unread count
      // const countResult = await notificationsApi.getUnreadCount(user.id);
      // setUnreadCount(countResult.count);
      setUnreadCount(1)
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      await notificationsApi.markAllAsRead(user.id);
      fetchNotifications();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    // We'll refetch notifications after marking one as read
    fetchNotifications();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      
      // Set up polling for notifications
      const intervalId = setInterval(fetchNotifications, 60000); // Check every minute
      
      return () => clearInterval(intervalId);
    }
  }, [user?.id, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-2 border-b flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead}
                showActions
              />
            ))}
            <div className="p-2 text-center">
              <Link 
                href="/notifications" 
                className="text-sm text-blue-600 hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}