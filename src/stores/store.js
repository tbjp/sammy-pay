import { defineStore } from 'pinia'

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDateInRange(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().slice(0, 10)
}

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      id: null,
      email: null,
    },
    payPeriods: [],
    classes: [],
  }),

  actions: {
    // User actions
    setUser(id, email) {
      this.user = { id, email }
    },
    seedData() {
      this.payPeriods = []
      this.classes = []

      const today = new Date()
      const msInDay = 24 * 60 * 60 * 1000

      for (let i = 0; i < 3; i++) {
        const end = new Date(today.getTime() - i * 14 * msInDay)
        const start = new Date(end.getTime() - 13 * msInDay)

        const payPeriod = {
          id: crypto.randomUUID(),
          user_id: this.user.id,
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          created_at: new Date().toISOString(),
        }

        this.payPeriods.push(payPeriod)

        // Add 3–6 classes per pay period
        const classCount = randomInt(3, 6)
        for (let j = 0; j < classCount; j++) {
          const classDate = randomDateInRange(start, end)

          this.classes.push({
            id: crypto.randomUUID(),
            user_id: this.user.id,
            pay_period_id: payPeriod.id,
            class_date: classDate,
            num_students: randomInt(4, 8),
            num_bonus_students: randomInt(0, 3),
            base_pay_per_class: 3000,
            bonus_pay_per_student: 500,
            created_at: new Date().toISOString(),
          })
        }
      }
    },
    // Pay Period actions
    addPayPeriod(startDate, endDate) {
      const newPeriod = {
        id: crypto.randomUUID(),
        user_id: this.user.id,
        start_date: startDate,
        end_date: endDate,
        created_at: new Date().toISOString(),
      }
      this.payPeriods.unshift(newPeriod)
    },

    // Class actions
    addClass({ pay_period_id, class_date, num_students, num_bonus_students, base_pay_per_class, bonus_pay_per_student }) {
      const newClass = {
        id: crypto.randomUUID(),
        user_id: this.user.id,
        pay_period_id,
        class_date,
        num_students,
        num_bonus_students,
        base_pay_per_class,
        bonus_pay_per_student,
        created_at: new Date().toISOString(),
      }
      this.classes.unshift(newClass)
    },

    getClassesForPayPeriod(pay_period_id) {
      return this.classes.filter(cls => cls.pay_period_id === pay_period_id)
    },

    calculatePay(classItem) {
      return (
        Number(classItem.base_pay_per_class || 0) +
        Number(classItem.num_bonus_students || 0) * Number(classItem.bonus_pay_per_student || 0)
      )
    }
  },

  persist: true,
})
