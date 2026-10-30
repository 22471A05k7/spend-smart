export const STORAGE_KEY = 'spendsmart:data:v1'
const empty = { version: 1, transactions: [], budgets: {} }
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...empty }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.transactions) || typeof parsed.budgets !== 'object') throw new Error('Invalid SpendSmart data')
    return { ...empty, ...parsed, version: 1 }
  } catch (error) {
    if (error instanceof SyntaxError) return { ...empty, storageError: 'Saved data could not be read. Your original data was left untouched.' }
    return { ...empty, storageError: 'Saved data could not be read. Your original data was left untouched.' }
  }
}
export function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, transactions: data.transactions, budgets: data.budgets })); return true }
  catch { return false }
}
