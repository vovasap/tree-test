<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from 'vue'
import { type GridApi, type ICellRendererParams } from 'ag-grid-enterprise'
import type { Item } from '@/types/item'
import type TreeStore from '@/utils/TreeStore'
import { useHistory } from '@/composables/useHistory'

type Context = {
  tree: TreeStore,
  isEditableMode: boolean
}

const props = defineProps<{ params: ICellRendererParams<Item, unknown, Context> }>()

const { setRecord } = useHistory()

const tree = props.params.context.tree
const item = ref(props.params.data)
const gridApi = shallowRef<GridApi<Item>>(props.params.api)

const getGroupStatus = () => {
  const itemId = props.params.data?.id
  return itemId ? !!tree.children.get(itemId)?.length : false
}

const isGroup = ref(getGroupStatus())
const text = computed(() => {
  return isGroup.value ? 'Группа' : 'Элемент'
})

const update = (shouldAdd?: boolean) => {
  if (!item.value) return

  if (shouldAdd) {
    const newItem: Item = { id: Date.now(), parent: item.value.id, label: 'Новый Айтем' }
    tree.addItem(newItem)
    setRecord({ action: 'add', oldValue: newItem, newValue: newItem })

    if (!props.params.node.expanded) {
      nextTick(() => props.params.node.setExpanded(true))
    }
  } else {
    const removedItem = tree.getItem(item.value.id)

    if (removedItem) {
      const removedItems = [
        { ...removedItem },
        ...tree.getAllChildren(item.value.id).map(child => ({ ...child })),
      ]
      setRecord({ action: 'remove', oldValue: removedItems, newValue: { ...item.value } })
      tree.removeItem(item.value.id)
    }
  }
  
  gridApi.value.setGridOption('rowData', tree.getAll())
}

</script>
<template>
  <div class="group-cell">
    <button
      class="group-btn"
      :class="{ expanded: params.node.expanded }"
      @click="params.node.setExpanded(!params.node.expanded)"
    />
    <span
      class="text"
      :style="{ paddingLeft: (params.node.level + 1) * 15 + 'px' }"
    >
      {{ text }}
    </span>
    <div
      v-if="params.context.isEditableMode"
      class="actions"
    >
      <button
        class="add"
        @click="update(true)"
      />
      <button
        class="remove"
        @click="update()"
      />
    </div>
  </div>
</template>
