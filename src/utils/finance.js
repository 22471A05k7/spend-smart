export const EXPENSE_CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Housing', 'Other']
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other']

export function localDateKey(date = new Date()) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export function monthKey(date) { return String(date).slice(0, 7) }
export function inMonth(item, month) { return typeof item.date === 'string' && item.date.slice(0, 7) === month }
export function sumType(items, type) { return items.reduce((sum, x) => sum + (x.type === type && Number.isFinite(+x.amount) ? +x.amount : 0), 0) }
export function totals(items) {
  const income = sumType(items, 'income'), expenses = sumType(items, 'expense')
  return { income, expenses, balance: income - expenses, savingsRate: income > 0 ? ((income - expenses) / income) * 100 : null }
}
export function categoryTotals(items) {
  const map = new Map()
  items.filter(x => x.type === 'expense').forEach(x => map.set(x.category, (map.get(x.category) || 0) + Number(x.amount || 0)))
  return [...map].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}
export function budgetState(spent, limit) {
  if (!(limit > 0)) return { percent: null, remaining: null, status: 'unset' }
  const percent = spent / limit * 100
  return { percent, remaining: limit - spent, status: percent >= 100 ? 'over' : percent >= 80 ? 'approaching' : 'normal' }
}
export function filterTransactions(items, filters) {
  const query = (filters.query || '').trim().toLowerCase()
  return items.filter(x => (!query || `${x.description} ${x.notes || ''}`.toLowerCase().includes(query)) && (!filters.type || x.type === filters.type) && (!filters.category || x.category === filters.category) && (!filters.month || inMonth(x, filters.month))).sort((a, b) => filters.sort === 'amount' ? b.amount - a.amount : b.date.localeCompare(a.date))
}
export const formatCurrency = amount => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number.isFinite(+amount) ? +amount : 0)
