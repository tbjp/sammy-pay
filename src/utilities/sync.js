import { supabase } from "../lib/supabaseClient";
import { useAppStore } from "../stores/store";

let syncInterval

export function startSyncLoop() {
  syncInterval = setInterval(async () => {
    debouncedSync()
  }, 60000) // every minute
}

export function stopSyncLoop() {
  clearInterval(syncInterval)
}

// debounced sync
let syncTimeout

export function debouncedSync() {
  if (syncTimeout) {
    clearTimeout(syncTimeout)
  }
  syncTimeout = setTimeout(() => {
    sync()
  }, 1000)
}

export async function sync() {
  const appStore = useAppStore()
  if (!navigator.onLine || appStore.user === "none") return

  await syncTable("classes", appStore)
  await syncTable("pay_periods", appStore)
}

async function syncTable(table, appStore) {
  const storeTable = table === "classes" ? "classes" : "payPeriods";

  const { data: upstreamDatabase, error: error1 } = await supabase.from(table).select('*').eq('user_id', appStore.user.id)

  if (error1) {
    console.error('Database query failed', error1)
    return
    }
  const newerUpstreamRecords = appStore[storeTable].map(
    localObj => upstreamDatabase.filter(
      remoteObj => remoteObj.id === localObj.id && remoteObj.updated_at > localObj.updated_at
    )
  ).flat()

  const newerLocalRecords = upstreamDatabase.map(
    remoteObj => appStore[storeTable].filter( // ignore the last z on updated_at
      localObj => localObj.id === remoteObj.id && localObj.updated_at.slice(0, -1) > remoteObj.updated_at
    )
  ).flat()

const localIds = appStore[storeTable].map(obj => obj.id)
const supabaseIds = upstreamDatabase.map(obj => obj.id)

const localObjectsNotInSupabase = appStore[storeTable].filter(obj => !supabaseIds.includes(obj.id))

// upsert local objects not in supabase and newer local records
const toUpsert = [...localObjectsNotInSupabase, ...newerLocalRecords]

const toUpsertCleaned = toUpsert
.map(({ needsSync, ...cleaned }) => cleaned)

const { error: error2 } = await supabase.from(table).upsert(toUpsertCleaned)

if (error2) {
  console.error('Sync failed', error2)
  return
}

// push upstream objects not in appstore
appStore[storeTable].push(...upstreamDatabase.filter(obj => !localIds.includes(obj.id)))

// overwrite local objects with upstream objects
appStore[storeTable] = appStore[storeTable].map(localObj => {
  const updatedObj = newerUpstreamRecords.find(remoteObj => remoteObj.id === localObj.id)
  return updatedObj || localObj
})

}
