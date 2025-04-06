import React, { useState } from 'react';
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Bell, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Notification } from '@/lib/types';
import { notificationsApi } from '@/lib/api';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  showActions?: boolean;
}

export default function NotificationItem({ notification, onMarkAsRead, showActions = true }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.isRead);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async () => {
    if (isRead) return;
    
    setIsLoading(true);
    try {
      await notificationsApi.markAsRead(notification.id);
      setIsRead(true);
      if (onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationUrl = () => {
    const type = notification.type
    
    if (type === 'job_match' && notification.job?.data) {
      return `/jobs/${notification.job.data.id}`
    } else if (type === 'application_status' && notification.job_application?.data) {
      return `/applications/${notification.job_application.data.id}`
    } else if (type === 'interview_invitation' && notification.job_application?.data) {
      return `/applications/${notification.job_application.data.id}`
    }
    
    return '#'
  }
  
  const getNotificationIcon = () => {
    const type = notification.type
    switch (type) {
      case 'job_match':
        return '🎯'
      case 'application_status':
        return '📝'
      case 'interview_invitation':
        return '📅'
      default:
        return '📣'
    }
  }

  // Get content text from blocks format if available
  const getContentText = () => {
    if (!notification.content) return '';
    
    // Try to extract text from blocks format
    if (Array.isArray(notification.content)) {
      return notification.content
        .map(block => 
          block.children?.map(child => child.text).join(' ') || ''
        )
        .join(' ');
    }
    
    // Fallback to direct content if not in blocks format
    return notification.content.toString();
  };

  return (
    <div 
      className={`p-4 border-b last:border-b-0 ${!isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
      onClick={handleMarkAsRead}
    >
      <Link href={getNotificationUrl()} className="block">
        <div className="flex items-start gap-3">
          <div className="text-lg">{getNotificationIcon()}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className={cn("font-medium", !isRead && "font-semibold")}>
                {notification.title}
              </p>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getContentText()}
            </p>
            
            {showActions && !isRead && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleMarkAsRead()
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Marking...' : 'Mark as read'}
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}