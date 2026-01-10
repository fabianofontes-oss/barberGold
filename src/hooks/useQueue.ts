'use client';

import { useState, useCallback } from 'react';
import type { QueueItem } from '@/types';

interface UseQueueReturn {
  queue: QueueItem[];
  joinQueue: (item: Omit<QueueItem, 'id' | 'arrivalTime'>) => void;
  leaveQueue: (id: string) => void;
}

export function useQueue(): UseQueueReturn {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const joinQueue = useCallback((item: Omit<QueueItem, 'id' | 'arrivalTime'>) => {
    const newItem: QueueItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      arrivalTime: new Date(),
    };
    setQueue((prev) => [...prev, newItem]);
  }, []);

  const leaveQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { queue, joinQueue, leaveQueue };
}
