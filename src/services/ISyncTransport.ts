export interface ISyncTransport {
  subscribe(key: string, callback: () => void): () => void;
  
  notifyUpdate(key: string): void;
  
  forceSync(key?: string): void;
  
  getLastSyncTime(): number;
  
  start(): void;
  
  stop(): void;
}
