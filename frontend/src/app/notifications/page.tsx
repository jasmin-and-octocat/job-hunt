'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Trash2, Eye } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Temporary mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 1;

interface Notification {
  id: number;
  attributes: {
    isRead: boolean;
    type: string;
    title: string;
    content: string;
    createdAt: string;
    job?: {
      data: {
        id: number;
      };
    };
    job_application?: {
      data: {
        id: number;
      };
    };
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true);
      const response = await notificationApi.getUserNotifications(
        MOCK_USER_ID,
        page,
        pageSize
      );
      setNotifications(response.data || []);
      setTotalPages(Math.ceil(response.meta.pagination.total / pageSize) || 1);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to load notifications'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                attributes: { ...notification.attributes, isRead: true },
              }
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(MOCK_USER_ID);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          attributes: { ...notification.attributes, isRead: true },
        }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const getNotificationUrl = (notification: Notification) => {
    const type = notification.attributes.type;

    if (type === 'job_match' && notification.attributes.job?.data) {
      return `/jobs/${notification.attributes.job.data.id}`;
    } else if (
      type === 'application_status' &&
      notification.attributes.job_application?.data
    ) {
      return `/applications/${notification.attributes.job_application.data.id}`;
    } else if (
      type === 'interview_invitation' &&
      notification.attributes.job_application?.data
    ) {
      return `/applications/${notification.attributes.job_application.data.id}`;
    }

    return '#';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return '🎯';
      case 'application_status':
        return '📝';
      case 'interview_invitation':
        return '📅';
      default:
        return '📣';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center text-2xl font-bold">
          <Bell className="mr-2 h-6 w-6" />
          Notifications
        </h1>
        <Button variant="outline" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-lg">Loading notifications...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16 text-red-500">
          <span className="text-lg">{error}</span>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-lg font-medium">No notifications</h2>
            <p className="text-muted-foreground">
              You don&apos;t have any notifications at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  'transition-colors hover:bg-muted/50',
                  !notification.attributes.isRead &&
                    'border-l-4 border-l-primary'
                )}
              >
                <CardContent className="flex items-start justify-between p-4">
                  <Link
                    href={getNotificationUrl(notification)}
                    className="flex-1"
                    onClick={() =>
                      !notification.attributes.isRead &&
                      handleMarkAsRead(notification.id)
                    }
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-2xl">
                        {getNotificationIcon(notification.attributes.type)}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h3 className="font-medium">
                            {notification.attributes.title}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              notification.attributes.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.attributes.content}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4 flex">
                    {!notification.attributes.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="mr-1"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
