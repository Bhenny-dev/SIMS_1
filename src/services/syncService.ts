import { ISyncTransport } from './ISyncTransport';

export const STORAGE_EVENT_KEY = 'storage-update';
export const SYNC_CHANNEL_NAME = 'sims-sync-channel';

type SyncEventType = 'storage-update' | 'data-refresh' | 'force-sync';

interface SyncMessage {
  type: SyncEventType;
  key?: string;
  timestamp: number;
}

class SyncService implements ISyncTransport {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<() => void>> = new Map();
  private refreshInterval: number | null = null;
  private lastSyncTime: number = Date.now();
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private customEventListener: ((e: Event) => void) | null = null;
  private isStarted: boolean = false;

  constructor() {
  }

  start() {
    if (this.isStarted) {
      console.warn('SyncService already started');
      return;
    }
    this.isStarted = true;
    this.initializeBroadcastChannel();
    this.setupStorageListener();
    this.startAutoRefresh();
  }

  stop() {
    this.destroy();
  }

  private initializeBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          this.handleSyncMessage(event.data);
        };
      } catch (error) {
        console.warn('BroadcastChannel not available, falling back to storage events only', error);
      }
    }
  }

  private setupStorageListener() {
    this.storageListener = (e: StorageEvent) => {
      if (e.key) {
        this.notifyListeners(e.key);
        this.updateSyncTime();
      }
    };

    this.customEventListener = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type) {
        this.handleSyncMessage(detail);
      } else if (detail?.key) {
        this.notifyListeners(detail.key);
        this.updateSyncTime();
      }
    };

    window.addEventListener('storage', this.storageListener);
    window.addEventListener(STORAGE_EVENT_KEY, this.customEventListener);
  }

  private handleSyncMessage(message: SyncMessage) {
    this.updateSyncTime();

    switch (message.type) {
      case 'storage-update':
        if (message.key) {
          this.notifyListeners(message.key);
        }
        break;
      case 'data-refresh':
        this.notifyListeners('*');
        break;
      case 'force-sync':
        if (message.key) {
          this.notifyListeners(message.key);
        } else {
          this.notifyListeners('*');
        }
        break;
    }
  }

  private notifyListeners(key: string) {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(callback => callback());
    }

    const globalListeners = this.listeners.get('*');
    if (globalListeners && key !== '*') {
      globalListeners.forEach(callback => callback());
    }
  }

  private updateSyncTime() {
    this.lastSyncTime = Date.now();
    window.dispatchEvent(new CustomEvent('sync-time-update', {
      detail: { timestamp: this.lastSyncTime }
    }));
  }

  private startAutoRefresh() {
    this.refreshInterval = window.setInterval(() => {
      this.broadcast({ type: 'data-refresh' });
    }, 30000);
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  broadcast(message: { type: SyncEventType; key?: string }) {
    const fullMessage: SyncMessage = {
      type: message.type,
      key: message.key,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(fullMessage);
      } catch (error) {
        console.warn('Failed to broadcast message', error);
      }
    }

    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_KEY, {
      detail: fullMessage
    }));

    this.updateSyncTime();
  }

  notifyUpdate(key: string) {
    this.broadcast({ type: 'storage-update', key });
  }

  forceSync(key?: string) {
    this.broadcast({ type: 'force-sync', key });
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  private destroy() {
    if (!this.isStarted) {
      return;
    }

    if (this.refreshInterval !== null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }

    if (this.customEventListener) {
      window.removeEventListener(STORAGE_EVENT_KEY, this.customEventListener);
      this.customEventListener = null;
    }

    this.listeners.clear();
    this.isStarted = false;
  }
}

export const createLocalSyncTransport = (): ISyncTransport => {
  return new SyncService();
};

export const syncService = createLocalSyncTransport();
