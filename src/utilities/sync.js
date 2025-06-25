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
  if (!navigator.onLine || !appStore.user) return

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

  console.log("Newer upstream records: ")
  console.log(newerUpstreamRecords)

  const newerLocalRecords = upstreamDatabase.map(
    remoteObj => appStore[storeTable].filter( // ignore the last z on updated_at
      localObj => localObj.id === remoteObj.id && localObj.updated_at.slice(0, -1) > remoteObj.updated_at
    )
  ).flat()

  console.log("Newer local records: ")
  console.log(newerLocalRecords)

const localIds = appStore[storeTable].map(obj => obj.id)
const supabaseIds = upstreamDatabase.map(obj => obj.id)

// const localIdsNotInSupabase = localIds.filter(id => !supabaseIds.includes(id))
// console.log("Ids not in supabase: ")
// console.log(localIdsNotInSupabase)

const localObjectsNotInSupabase = appStore[storeTable].filter(obj => !supabaseIds.includes(obj.id))
console.log("Objects not in supabase: ")
console.log(localObjectsNotInSupabase)

// const supabaseIdsNotInLocal = supabaseIds.filter(id => !localIds.includes(id))
// console.log("Supabase ids not in local: ")
// console.log(supabaseIdsNotInLocal)

// upsert local objects not in supabase and newer local records
const toUpsert = [...localObjectsNotInSupabase, ...newerLocalRecords]
console.log("To upsert: ")
console.log(toUpsert)

const toUpsertCleaned = toUpsert
.map(({ needsSync, ...cleaned }) => cleaned)

console.log("To upsert cleaned: ")
console.log(toUpsertCleaned)

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
