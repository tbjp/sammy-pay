import { defineStore } from 'pinia'

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDateInRange(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date
}

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      id: null,
      email: null,
    },
    payPeriods: [],
    classes: [],
    dataSeeded: false,
  }),

  getters: {
    sortedClasses(state) {
      return [...state.classes].sort((b, a) => a.class_date.localeCompare(b.class_date));
    },
    sortedPayPeriods(state) {
      return [...state.payPeriods].sort((b, a) => a.start_date.localeCompare(b.start_date));
    },
  },

  actions: {
    // User actions
    setUser(id, email) {
      this.user = { id, email }
    },
    seedData() {
      if (this.dataSeeded) {
        this.payPeriods = []
        this.classes = []
        this.dataSeeded = false
        return
      }

      const today = new Date()
      const msInDay = 24 * 60 * 60 * 1000

      for (let i = 0; i < 3; i++) {
        const end = new Date(today.getTime() - i * 14 * msInDay)
        const start = new Date(end.getTime() - 13 * msInDay)

        const payPeriod = {
          id: crypto.randomUUID(),
          user_id: this.user.id,
          start_date: start.toISOString().split("T")[0],
          end_date: end.toISOString().split("T")[0],
          created_at: new Date()
        }

        this.payPeriods.push(payPeriod)

        // Add 3–6 classes per pay period
        const classCount = randomInt(3, 6)
        for (let j = 0; j < classCount; j++) {
          const classDate = randomDateInRange(start, end)
          const endTime = new Date(classDate.getTime() + 1000 * 60 * 60)

          this.classes.push({
            id: crypto.randomUUID(),
            user_id: this.user.id,
            pay_period_id: payPeriod.id,
            class_date: classDate.toISOString(),
            end_time: endTime.toISOString(),
            num_students: randomInt(4, 12),
            num_bonus_students: randomInt(0, 7),
            base_pay_per_class: randomInt(20, 101),
            bonus_pay_per_student: randomInt(1, 11),
            created_at: new Date(),
          })
        }
      }

      this.dataSeeded = true
    },
    // Pay Period actions
    addPayPeriod({ start_date, end_date }) {
      const newPeriod = {
        id: crypto.randomUUID(),
        user_id: this.user.id,
        start_date: start_date,
        end_date: end_date,
        created_at: new Date().toISOString(),
      }
      this.payPeriods.unshift(newPeriod)
    },

    editPayPeriod({ id, start_date, end_date }) {
      const periodItem = this.payPeriods.find(period => period.id === id)
      if (!periodItem) {
        console.error(`Pay period with id ${id} not found`)
        return
      }
      periodItem.start_date = start_date
      periodItem.end_date = end_date
    },

    deletePayPeriod(id) {
      this.payPeriods = this.payPeriods.filter(period => period.id !== id)
    },

    // Class actions
    addClass({ pay_period_id, class_date, num_students, num_bonus_students, base_pay_per_class, bonus_pay_per_student, hours, minutes }) {
      const endTime = new Date(class_date).getTime() + 1000 * 60 * 60 * hours + 1000 * 60 * minutes
      const newClass = {
        id: crypto.randomUUID(),
        user_id: this.user.id,
        pay_period_id,
        class_date: class_date,
        num_students,
        num_bonus_students,
        base_pay_per_class,
        bonus_pay_per_student,
        end_time: new Date(endTime).toISOString(),
        created_at: new Date().toISOString(),
      }
      this.classes.unshift(newClass)
    },

    editClass({ id, class_date, num_students, num_bonus_students, base_pay_per_class, bonus_pay_per_student, hours, minutes }) {
      const classItem = this.classes.find(cls => cls.id === id)
      if (!classItem) {
        console.error(`Class with id ${id} not found`)
        return
      }
      classItem.class_date = class_date
      classItem.num_students = num_students
      classItem.num_bonus_students = num_bonus_students
      classItem.base_pay_per_class = base_pay_per_class
      classItem.bonus_pay_per_student = bonus_pay_per_student
      const endTime = new Date(class_date).getTime() + 1000 * 60 * 60 * hours + 1000 * 60 * minutes
      classItem.end_time = new Date(endTime)
    },

    deleteClass(id) {
      this.classes = this.classes.filter(cls => cls.id !== id)
    },

    getClassesForPayPeriod({start_date, end_date}) {
      const endDatePlusOne = new Date(end_date)
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1)
      const endDateISOString = endDatePlusOne.toISOString().split("T")[0]
      return this.classes.filter(cls => cls.class_date >= start_date && cls.class_date <= endDateISOString)
    },

    calculatePay(classItem) {
      return (
        Number(classItem.base_pay_per_class|| 0) +
        Number(classItem.num_students - classItem.num_bonus_students || 0) * Number(classItem.bonus_pay_per_student || 0)
      )
    },
    calculatePayPeriod(payPeriod) {
      console.log("Calculating pay period: ")
      console.log(payPeriod)
      const classes = this.getClassesForPayPeriod(payPeriod)
      console.log("Classes: ")
      console.log(classes)
      return classes.reduce((total, cls) => total + this.calculatePay(cls), 0)
    },
    // Get date formatted as "Wed MM/DD/YY"
    getFormattedDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      })
    },
    getFormattedDateNoDay(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
    },
    getDayOfWeek(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
      })
    },
    // Get start and end time of class
    getStartTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    getEndTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },

  persist: true,
})
