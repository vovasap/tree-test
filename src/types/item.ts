export type Item = {
  id: ItemId
  parent: ItemId
  label: string
}

export type ItemId = number | string | null