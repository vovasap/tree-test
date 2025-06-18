import { computed, ref } from 'vue'
import type { Item } from '@/types/item'

const data: Data[] = []
const currentIndex = ref(-1)
const isFirstRecord = computed(() => currentIndex.value < 0)
const isLastRecord = computed(() => currentIndex.value >= (data.length - 1) || !data.length)

export function useHistory() {
  function getRecord(isPrev = true) {
    const newIndex = currentIndex.value + (isPrev ? -1 : 1)
    const newData = data[isPrev ? currentIndex.value : newIndex]
    currentIndex.value = newIndex

    return newData
  }

  function setRecord(value: Data) {
    currentIndex.value += 1
    data[currentIndex.value] = structuredClone(value)
    if (data.length > currentIndex.value + 1) {
      data.length = currentIndex.value + 1
    }
  }

  return {
    getRecord,
    setRecord,
    isFirstRecord,
    isLastRecord,
    currentIndex,
  }
}

// type Data = {
//   action: "edit";
//   oldValue: Item;
//   newValue: Item;
// } | {
//   action: "add";
//   oldValue: Item;
//   newValue: Item;
// } | {
//   action: "remove";
//   oldValue: Item[];
//   newValue: Item;
// }

type Action = 'edit' | 'add' | 'remove'

export type Data = {
  [T in Action]: {
    action: T
    oldValue: T extends 'remove' ? Item[] : Item
    newValue: Item
  }
}[Action]
