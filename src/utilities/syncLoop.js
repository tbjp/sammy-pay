// TODO: Handle deleted records from other sessions
import { supabase } from "../lib/supabaseClient";

let syncInterval
let noUpstreamChanges = false

function startSyncLoop(appStore) {
  syncInterval = setInterval(async () => {
    onetimeSync(appStore)
  }, 10000) // every 10 seconds, or tweak as needed
}

// Function to stop the sync loop
function stopSyncLoop() {
  clearInterval(syncInterval)
}

async function setLastSyncedTime(appStore, ISODateString) {
  appStore.lastSyncedAt = ISODateString
  console.log("Setting last synced at to: " + ISODateString)
  const { error } = await supabase.from('last_synced').upsert({ id: appStore.user.id, last_synced: ISODateString })
  if (error) {
    console.error('Failed to update last_synced', error)
  }
}

async function onetimeSync(appStore) {
    if (!navigator.onLine || !appStore.user) return


    const { data: lastSyncedAtDB, error } = await supabase.from('last_synced').select('*').eq('id', appStore.user.id).single()
    console.log("Last synced at: ")
    console.log("DB: " + lastSyncedAtDB.last_synced)
    console.log("App: " + appStore.lastSyncedAt)
    if (lastSyncedAtDB.last_synced === appStore.lastSyncedAt && !appStore.needsSync) {
      console.log("Needs sync: " + appStore.needsSync)
      return }

    if (error) {
      console.error('Sync failed', error)
      await setLastSyncedTime(appStore, new Date().toISOString())
    }

    const since = appStore.lastSyncedAt || '1970-01-01T00:00:00.000Z'
    // const since = '1970-01-01T00:00:00.000Z' // Always sync for testing

    await syncClasses(appStore, since)
    await syncPayPeriods(appStore, since)
    appStore.needsSync = false
    console.log("Needs sync after sync: " + appStore.needsSync)
    if (noUpstreamChanges) {
      setLastSyncedTime(appStore, new Date().toISOString())
      noUpstreamChanges = false
      return
    }
}
async function syncClasses(appStore, since) {
    const { data: upstreamClasses, error } = await supabase
    .from('classes')
    .select('*')
    .eq('user_id', appStore.user.id)
    .gte('updated_at', since);

    if (error) {
      console.error('Sync failed', error)
      return
    }
    console.log("Upstream classes: ")
    console.log(upstreamClasses)
    if (upstreamClasses.length) {
    const mergedClasses = appStore.mergeRecords(appStore.classes, upstreamClasses)
    appStore.classes = mergedClasses
    } else {
      noUpstreamChanges = true
    }

    const toUpsert = appStore.classes
  .filter(cls => cls.needsSync)
  .map(({ needsSync, ...cleaned }) => cleaned)

    const toDelete = appStore.classes.filter(c => c._deleted)

    if (toUpsert.length) {
    try {
        const { error } = await supabase
          .from('classes')
          .upsert(toUpsert)

        if (!error) {
          console.log('Synced classes and setting needsSync to false')
          appStore.setSyncedClasses(toUpsert)
          await setLastSyncedTime(appStore, new Date().toISOString())
        }
      } catch (e) {
        console.error('Sync failed', e)
      }
    }
    if (toDelete.length) {
      try {
        const { error } = await supabase.from('classes').delete().in('id', toDelete.map(c => c.id))
        if (!error) {
          console.log('Deleted classes')
          appStore.deleteSyncedClasses(toDelete)
          await setLastSyncedTime(appStore, new Date().toISOString())
        }
      } catch (e) {
        console.error('Delete failed', e)
      }
    }
}
async function syncPayPeriods(appStore, since) {
    const { data: upstreamPayPeriods, error } = await supabase
    .from('pay_periods')
    .select('*')
    .eq('user_id', appStore.user.id)
    .gte('updated_at', since);

    if (error) {
      console.error('Sync failed', error)
      return
    }
    console.log("Upstream pay periods: ")
    console.log(upstreamPayPeriods)

    if (upstreamPayPeriods.length) {
    const mergedPayPeriods = appStore.mergeRecords(appStore.payPeriods, upstreamPayPeriods)
    appStore.payPeriods = mergedPayPeriods
    } else {
      noUpstreamChanges = true
    }

    const toUpsert = appStore.payPeriods
  .filter(pp => pp.needsSync)
  .map(({ needsSync, ...cleaned }) => cleaned)

  console.log("To upsert: ")
  console.log(toUpsert)

    const toDelete = appStore.payPeriods.filter(pp => pp._deleted)

    if (toUpsert.length) {
    try {
        const { error } = await supabase
          .from('pay_periods')
          .upsert(toUpsert)

        if (!error) {
          console.log('Synced pay periods and setting needsSync to false')
          appStore.setSyncedPayPeriods(toUpsert)
          await setLastSyncedTime(appStore, new Date().toISOString())

        }
      } catch (e) {
        console.error('Sync failed', e)
      }
    }
    if (toDelete.length) {
      try {
        const { error } = await supabase.from('pay_periods').delete().in('id', toDelete.map(pp => pp.id))
        if (!error) {
          console.log('Deleted pay periods')
          appStore.deleteSyncedPayPeriods(toDelete)
          await setLastSyncedTime(appStore, new Date().toISOString())
        }
      } catch (e) {
        console.error('Delete failed', e)
      }
    }
}
export { startSyncLoop, onetimeSync, stopSyncLoop }
