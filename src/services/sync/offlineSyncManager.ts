import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { mmkvStorage, MMKVKeys } from '../storage/mmkv';
import apiClient from '../api/client';

export type SyncActionType = 'RATE_OUTFIT' | 'LIKE_OUTFIT' | 'SAVE_OUTFIT' | 'ADD_COMMENT';

export interface SyncTask {
  id: string;
  type: SyncActionType;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  timestamp: number;
  retryCount: number;
}

class OfflineSyncManager {
  private isSyncing = false;
  private isConnected = true;

  constructor() {
    this.initNetworkListener();
  }

  private initNetworkListener() {
    NetInfo.addEventListener((state: NetInfoState) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      const wasOffline = !this.isConnected && online;
      this.isConnected = online;

      if (wasOffline) {
        console.log('[OfflineSyncManager] Internet connection restored. Triggering background sync...');
        this.processSyncQueue();
      }
    });
  }

  public getQueue(): SyncTask[] {
    return mmkvStorage.getItem<SyncTask[]>(MMKVKeys.OFFLINE_SYNC_QUEUE) || [];
  }

  public enqueueTask(task: Omit<SyncTask, 'id' | 'timestamp' | 'retryCount'>): void {
    const queue = this.getQueue();
    const newTask: SyncTask = {
      ...task,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    queue.push(newTask);
    mmkvStorage.setItem(MMKVKeys.OFFLINE_SYNC_QUEUE, queue);
    console.log(`[OfflineSyncManager] Task enqueued: ${newTask.type} (Queue size: ${queue.length})`);

    if (this.isConnected && !this.isSyncing) {
      this.processSyncQueue();
    }
  }

  public async processSyncQueue(): Promise<void> {
    if (this.isSyncing) return;
    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    console.log(`[OfflineSyncManager] Processing ${queue.length} pending offline tasks...`);

    const remainingTasks: SyncTask[] = [];

    for (const task of queue) {
      try {
        await apiClient({
          method: task.method,
          url: task.endpoint,
          data: task.payload,
          headers: {
            'X-Offline-Synced': 'true',
          },
        });
        console.log(`[OfflineSyncManager] Task ${task.id} (${task.type}) synchronized successfully.`);
      } catch (error: any) {
        console.warn(`[OfflineSyncManager] Failed to sync task ${task.id}:`, error.message);
        if (task.retryCount < 2) {
          remainingTasks.push({ ...task, retryCount: task.retryCount + 1 });
        } else {
          console.warn(`[OfflineSyncManager] Task ${task.id} exceeded max retries. Dropping.`);
        }
      }
    }

    mmkvStorage.setItem(MMKVKeys.OFFLINE_SYNC_QUEUE, remainingTasks);
    mmkvStorage.setItem(MMKVKeys.LAST_SYNC_TIMESTAMP, Date.now());
    this.isSyncing = false;
  }
}

export const offlineSyncManager = new OfflineSyncManager();
export default offlineSyncManager;
