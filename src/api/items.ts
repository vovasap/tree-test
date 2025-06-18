import type { Item } from '@/types/item'

// const getFakeItems = () => {
//   return Array.from({ length: 500 }, (_, k) => ({ id: k + 9, parent: 4, label: 'Айтем ' + (k + 9) }))
// }
const items: Item[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '2', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '2', label: 'Айтем 4' },
  { id: 5, parent: '2', label: 'Айтем 5' },
  { id: 6, parent: '2', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
  // ...getFakeItems()
]

const getItems = async (): Promise<Item[]> => {
  return new Promise(res => {
    setTimeout(() => {
      res(items)
    }, 100)
  })
}

export {
  getItems,
}
