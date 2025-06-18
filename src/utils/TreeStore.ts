import type { Item, ItemId } from '@/types/item'


export default class TreeStore {

  items = new Map<ItemId, Item>()
  children = new Map<ItemId, Item[]>()

  constructor(items: Item[]) {
    items.forEach(item => {
      this.items.set(item.id, item)

      const childrenItems = this.children.get(item.parent)
      if (childrenItems) {
        this.children.set(item.parent, [...childrenItems, item])
      } else {
        this.children.set(item.parent, [item])
      }
    })
  }

  getAll() {
    return Array.from(this.items.values())
  }

  getItem(id: ItemId) {
    return this.items.get(id)
  }

  getChildren(id: ItemId) {
    return this.children.get(id) ?? []
  }

  getAllChildren(id: ItemId) {
    const children = []
    const items = this.children.get(id) ?? []
    let idx = 0

    while (idx < items.length) {
      const item = items[idx]
      children.push(item)

      const newChildren = this.children.get(item.id)
      if (newChildren) {
        items.push(...newChildren)
      }

      idx += 1
    }

    return children
  }

  getAllParents(id: ItemId) {
    let itemId: ItemId | undefined = id
    const parents: Item[] = []
    while (itemId !== undefined) {
      const parent = this.getItem(itemId)
      if (parent) {
        parents.push(parent)
      }
      itemId = parent?.parent
    }

    return parents
  }

  addItem(item: Item) {
    this.items.set(item.id, item)

    const children = this.children.get(item.parent) ?? []
    this.children.set(item.parent, [...children, item])
  }

  removeItem(id: ItemId) {
    const removingItem = this.items.get(id)
    if (!removingItem) return

    const removingItems = [
      ...this.getAllChildren(id),
      removingItem,
    ]
    removingItems.forEach(child => {
      this.items.delete(child.id)
      this.children.delete(child.id)
    })

    const parentsChildren = this.children.get(removingItem.parent) ?? []
    this.children.set(removingItem.parent, parentsChildren?.filter(child => child.id !== removingItem.id))
  }

  updateItem(item: Item) {
    // when the parent is changed (not tested)
    // const oldItem = this.items.get(item.id)

    // if (oldItem && oldItem.parent !== item.parent) {
    //   const oldParentChildren = this.children.get(oldItem.parent) ?? []
    //   this.children.set(item.parent, oldParentChildren.filter(child => child.id !== item.id))

    //   const newParentChildren = this.children.get(item.parent) ?? []
    //   this.children.set(item.parent, [...newParentChildren, item])
    // }

    this.items.set(item.id, item)
  }
}
