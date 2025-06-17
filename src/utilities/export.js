import { useAppStore } from '../stores/store'

function exportCSV(key) {
  const store = useAppStore()
  const rows = store[key]

  if (!rows.length) return

  const headers = Object.keys(rows[0])

  if (key === 'payPeriods') {
    headers.push('calculated_pay')
  }

  const csv = [
    headers.join(','), // header row
    ...rows.map(row => {
      return headers.map(h => {
        let value = row[h]


        // Special handling for calculated pay
        if (h === 'calculated_pay' && key === 'payPeriods') {
          value = store.calculatePayPeriod(row)
        }

        // Convert ISO string to 'YYYY-MM-DD HH:mm' if it's a date
        if (['class_date', 'start_time', 'end_time'].includes(h) && typeof value === 'string' && value.includes('T')) {
          const d = new Date(value)
          value = d.toISOString().slice(0, 16).replace('T', ' ')
        }

        return JSON.stringify(value ?? '')
      }).join(',')
    })
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${key}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default exportCSV
