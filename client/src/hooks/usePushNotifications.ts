import { useState, useEffect, useCallback } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  permission: NotificationPermission;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    permission: 'default',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if push notifications are supported
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (isSupported) {
      setState(prev => ({
        ...prev,
        isSupported,
        permission: Notification.permission,
      }));

      // Check existing subscription
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setState(prev => ({
            ...prev,
            isSubscribed: !!subscription,
            subscription,
          }));
        });
      });
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      setError('Push notifications are not supported in this browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setError('Notification permission denied');
        setState(prev => ({ ...prev, permission }));
        return null;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      // Note: In production, you'd get the VAPID public key from your server
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // This is a placeholder - in production, use your actual VAPID public key
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
        ),
      });

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
        permission,
      }));

      // Send subscription to server
      // await sendSubscriptionToServer(subscription);

      return subscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [state.isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    setIsLoading(true);
    setError(null);

    try {
      await state.subscription.unsubscribe();
      
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      // Notify server about unsubscription
      // await removeSubscriptionFromServer(state.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
    } finally {
      setIsLoading(false);
    }
  }, [state.subscription]);

  return {
    ...state,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default usePushNotifications;
