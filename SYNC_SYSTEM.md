# Real-Time Synchronization System

## Overview

The SIMS application now features an enhanced real-time synchronization system that keeps data consistent across browser tabs and lays the foundation for future cross-device synchronization.

## Current Implementation (Client-Side Sync)

### Architecture

The sync system uses a **layered, interface-based architecture** that makes it easy to upgrade from local synchronization to backend-powered sync in the future.

```
┌─────────────────────────────────────┐
│         React Components            │
│  (use useSyncedData hook)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        useSyncedData Hook            │
│  (subscribes to sync events)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         SyncContext                  │
│  (provides ISyncTransport)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       ISyncTransport                 │
│     (interface/contract)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     LocalSyncService                 │
│  (BroadcastChannel + Events)         │
└─────────────────────────────────────┘
```

### Key Components

#### 1. ISyncTransport Interface
**File:** `src/services/ISyncTransport.ts`

Defines the contract for any sync transport mechanism:
```typescript
interface ISyncTransport {
  subscribe(key: string, callback: () => void): () => void;
  notifyUpdate(key: string): void;
  forceSync(key?: string): void;
  getLastSyncTime(): number;
  start(): void;
  stop(): void;
}
```

#### 2. LocalSyncService
**File:** `src/services/syncService.ts`

Current implementation using:
- **BroadcastChannel API** - High-performance cross-tab messaging
- **Storage Events** - Fallback for browsers without BroadcastChannel
- **Custom Events** - Same-tab synchronization
- **Auto-refresh** - Periodic data refresh every 30 seconds

**Features:**
- ✅ Prevents memory leaks (proper listener cleanup)
- ✅ Safe for React 18 Strict Mode
- ✅ Automatic fallback when BroadcastChannel unavailable
- ✅ Prevents duplicate initialization

#### 3. SyncContext
**File:** `src/contexts/SyncContext.tsx`

Provides sync functionality via dependency injection:
```typescript
<SyncProvider syncTransport={syncService}>
  {/* Your app */}
</SyncProvider>
```

Exposes:
- `lastSyncTime` - Timestamp of last sync
- `isSyncing` - Boolean indicating active sync
- `forceSync()` - Manual sync trigger
- `syncTransport` - The transport instance

#### 4. useSyncedData Hook
**File:** `src/hooks/useSyncedData.ts`

Enhanced data fetching hook that automatically refetches when data changes:
```typescript
const { data, loading, refetch } = useSyncedData(
  () => getLeaderboard(),
  ['sims_mock_teams', 'sims_mock_events']
);
```

**Parameters:**
- `fetcher` - Async function that returns data
- `watchKeys` - Array of localStorage keys to monitor (use `['*']` for all changes)

#### 5. SyncIndicator Component
**File:** `src/components/SyncIndicator.tsx`

Visual indicator showing sync status in the header:
- Displays "Synced X ago" with relative time
- Spinning icon during active sync
- Click to force manual sync

## How It Works

### Cross-Tab Synchronization

1. **User makes a change** (e.g., updates a team score)
2. **Data is saved** to localStorage
3. **SyncService broadcasts** the change via:
   - BroadcastChannel (if available) → Instant
   - CustomEvent → Same tab
4. **Other tabs receive** the broadcast
5. **useSyncedData refetches** data automatically
6. **UI updates** with fresh data

### Auto-Refresh

- Every 30 seconds, SyncService broadcasts a `data-refresh` event
- All components using `useSyncedData` refetch their data
- Ensures data stays fresh even without explicit changes

## Future Backend Integration

### Migration Path

The current architecture is designed to easily upgrade to a backend-powered sync system:

#### Phase 1: Add Backend API (Current → Backend)
1. Create a REST API or GraphQL backend
2. Move data from localStorage to a database (PostgreSQL, Firebase, Supabase)
3. Update `api.ts` to call real endpoints instead of mock localStorage

#### Phase 2: Add Real-Time Transport
1. Implement a `WebSocketSyncTransport` or `SSESyncTransport` class
2. Have it implement `ISyncTransport`
3. Replace `syncService` in App.tsx:
   ```typescript
   import { createWebSocketSyncTransport } from './services/webSocketSync';
   const transport = createWebSocketSyncTransport(API_URL);
   
   <SyncProvider syncTransport={transport}>
   ```

#### Phase 3: Hybrid Approach (Optional)
Keep localStorage for offline support:
```typescript
class HybridSyncTransport implements ISyncTransport {
  constructor(
    private remote: WebSocketSyncTransport,
    private local: LocalSyncService
  ) {}
  
  // Sync with server, fallback to local on offline
}
```

### Example: WebSocket Transport

```typescript
// Future: src/services/webSocketSync.ts
import { ISyncTransport } from './ISyncTransport';

class WebSocketSyncTransport implements ISyncTransport {
  private ws: WebSocket;
  private listeners: Map<string, Set<() => void>>;
  
  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      const { type, key } = JSON.parse(event.data);
      if (type === 'data-update') {
        this.notifyListeners(key);
      }
    };
  }
  
  notifyUpdate(key: string) {
    this.ws.send(JSON.stringify({ type: 'update', key }));
  }
  
  // ... implement other ISyncTransport methods
}
```

Then simply swap in App.tsx:
```typescript
import { createWebSocketSyncTransport } from './services/webSocketSync';

const syncTransport = createWebSocketSyncTransport('wss://api.sims.com');

<SyncProvider syncTransport={syncTransport}>
```

**No changes needed** to components or hooks!

## Usage Examples

### In Components

```typescript
import { useSyncedData } from '../hooks/useSyncedData';
import { getLeaderboard } from '../services/api';
import { STORAGE_KEYS } from '../services/api';

function Leaderboard() {
  const { data: teams, loading } = useSyncedData(
    getLeaderboard,
    [STORAGE_KEYS.TEAMS]  // Auto-refetch when teams change
  );
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {teams.map(team => (
        <div key={team.id}>{team.name}: {team.score}</div>
      ))}
    </div>
  );
}
```

### Manual Sync Trigger

```typescript
import { useSync } from '../contexts/SyncContext';

function MyComponent() {
  const { forceSync, isSyncing } = useSync();
  
  return (
    <button onClick={() => forceSync()} disabled={isSyncing}>
      {isSyncing ? 'Syncing...' : 'Refresh Data'}
    </button>
  );
}
```

### Watch All Changes

```typescript
const { data } = useSyncedData(
  fetchAllData,
  ['*']  // Refetch on any storage change
);
```

## Performance Considerations

### Current System
- **BroadcastChannel**: Zero overhead, native browser messaging
- **Auto-refresh**: 30 seconds (configurable)
- **localStorage**: ~5-10MB limit per domain

### Future Backend
- Consider debouncing rapid updates
- Implement optimistic UI updates
- Use WebSocket heartbeat for connection health
- Add request batching for multiple updates

## Testing Cross-Tab Sync

1. Open the app in two browser tabs
2. Log in to both tabs
3. Make a change in tab 1 (e.g., update a team score)
4. Watch tab 2 automatically update within seconds
5. Click the sync indicator to force immediate sync

## Troubleshooting

### Sync Not Working
- Check browser console for errors
- Verify BroadcastChannel support: `typeof BroadcastChannel !== 'undefined'`
- Check if localStorage is enabled
- Look for the SyncIndicator in the header (should show "Synced X ago")

### Memory Leaks
- The system properly cleans up all listeners on unmount
- Safe for React 18 Strict Mode (double mount/unmount)
- If you see duplicate sync events, check that you're not creating multiple SyncProviders

## Configuration

### Change Auto-Refresh Interval

Edit `src/services/syncService.ts`:
```typescript
private startAutoRefresh() {
  this.refreshInterval = window.setInterval(() => {
    this.broadcast({ type: 'data-refresh' });
  }, 60000);  // Change from 30000 to 60000 for 1 minute
}
```

### Disable Auto-Refresh

Comment out the call in `start()`:
```typescript
start() {
  this.initializeBroadcastChannel();
  this.setupStorageListener();
  // this.startAutoRefresh();  // Disabled
}
```

## Architecture Principles

1. **Interface-based design** - Easy to swap implementations
2. **Dependency injection** - SyncProvider accepts any ISyncTransport
3. **Single Responsibility** - Each component has one job
4. **Clean lifecycle** - Proper start/stop/cleanup
5. **Fallback support** - Works without BroadcastChannel
6. **Type safety** - Full TypeScript support

## Next Steps for Production

1. ✅ Client-side sync (Done)
2. ⬜ Add backend API (REST or GraphQL)
3. ⬜ Implement WebSocket/SSE transport
4. ⬜ Add offline support with IndexedDB
5. ⬜ Implement conflict resolution
6. ⬜ Add sync queue for failed updates
7. ⬜ Monitor sync performance
8. ⬜ Add user-specific sync permissions

## Resources

- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [Storage Event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
