import { describe, expect, it, beforeEach } from 'vitest'
import TreeStore from './TreeStore'

const items = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '2', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '2', label: 'Айтем 4' },
  { id: 5, parent: '2', label: 'Айтем 5' },
  { id: 6, parent: '2', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

describe('TreeStore', () => {
  let tree: TreeStore

  beforeEach(() => {
    tree = new TreeStore(items)
  })

  it('initialize class ', () => {
    expect(tree).toBeInstanceOf(TreeStore)
  })

  it('returns item by id', () => {
    expect(tree.getItem('2')).toEqual(items[1])
    expect(tree.getItem(7)).toEqual(items[6])
  })

  it('returns direct children of item', () => {
    expect(tree.getChildren('2')).toEqual([items[3], items[4], items[5]])
    expect(tree.getChildren(4)).toEqual([items[6], items[7]])
  })

  it('returns all nested children', () => {
    expect(tree.getAllChildren(1)).toEqual(items.slice(1))
    expect(tree.getAllChildren('2')).toEqual(items.slice(3))
  })

  it('updates item', () => {
    tree.updateItem({ id: '2', parent: 1, label: 'updated' })
    tree.updateItem({ id: 4, parent: '2', label: 'updated' })

    expect(tree.getItem('2')?.label).toBe('updated')
    expect(tree.getItem(4)?.label).toBe('updated')
    expect(tree.getItem(3)?.label).toBe('Айтем 3')
  })

  it('adds item', () => {
    const newItem = { id: '9', parent: 8, label: 'Новый Айтем' }
    tree.addItem(newItem)

    expect(tree.getItem('9')).toEqual(newItem)
    expect(tree.getChildren(8)).toEqual([newItem])
  })

  it('removes item', () => {
    tree.removeItem(4)

    expect(tree.getAll()).toHaveLength(5)
    expect(tree.getItem(4)).toBeUndefined()
    expect(tree.getChildren(4)).toHaveLength(0)
    expect(tree.getChildren('2')).toEqual([items[4], items[5]])
  })
})
