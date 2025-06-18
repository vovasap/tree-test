import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory, type Data } from './useHistory'

describe('useHistory', () => {
  let history: ReturnType<typeof useHistory>

  beforeEach(() => {
    history = useHistory()
  })

  it('navigate history', () => {
    const editedOldItem = { id: 2, parent: 1, label: 'old' }
    const editedNewItem = { id: 2, parent: 1, label: 'new' }
    const addedItem = { id: 3, parent: 2, label: 'new' }

    const editStep: Data = { action: 'edit', oldValue: editedOldItem, newValue: editedNewItem }
    const addStep: Data = { action: 'add', oldValue: addedItem, newValue: addedItem }

    // forward
    history.setRecord(editStep)
    // forward
    history.setRecord(addStep)

    expect(history.currentIndex.value).toBe(1)
    expect(history.isLastRecord.value).toBe(true)

    // back
    expect(history.getRecord(true)).toEqual(addStep)
    expect(history.currentIndex.value).toBe(0)
    expect(history.isFirstRecord.value).toBe(false)

    // back
    expect(history.getRecord()).toEqual(editStep)
    expect(history.currentIndex.value).toBe(-1)
    expect(history.isFirstRecord.value).toBe(true)
  })
})
