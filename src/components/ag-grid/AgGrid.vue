<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import {
  type GridApi,
  type ColDef,
  type CellValueChangedEvent,
  type GridReadyEvent,
  ModuleRegistry,
  type CellClassParams,
  AllCommunityModule,
} from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'

import { nextTick, onBeforeMount, onBeforeUnmount, ref, shallowRef } from 'vue'
import TreeStore from '@/utils/TreeStore'
import GroupCell from '@/components/ag-grid/AgGridGroupCell.vue'
import type { Item } from '@/types/item'
import { useHistory } from '@/composables/useHistory'
import { getItems } from '@/api/items'

ModuleRegistry.registerModules([
  AllCommunityModule,
  TreeDataModule,
])

const { getRecord, setRecord, isFirstRecord, isLastRecord } = useHistory()

let tree: TreeStore
let gridApi: GridApi<Item> | null = null
const data = shallowRef<Item[]>([])
const rowNumberMap = new Map()
const isLoading = ref(true)
const isEditableMode = ref(true)

const cellClassRules = {
  group: (params: CellClassParams) => !!tree.children.get(params.data.id)?.length,
}

const columns: ColDef[] = [
  {
    headerName: '№ п\\п',
    colId: 'row-number',
    width: 80,
    valueFormatter: (params) => {
      return rowNumberMap.get(params.node!.id)
    },
    cellClass: 'group',
  },
  {
    colId: 'group',
    headerName: 'Категория',
    cellRenderer: GroupCell,
    cellRendererParams: {
      isEditableMode,
    },
    cellClassRules: {
      ...cellClassRules,
      expanded: (params) => params.node.expanded,
    },
    width: 400,
  },
  {
    headerName: 'Наименование',
    field: 'label',
    editable: () => isEditableMode.value,
    cellClassRules,
    flex: 1,
  },
]

const onGridReady = (params: GridReadyEvent) => {
  gridApi = params.api
  refreshCells()
  gridApi.addEventListener('modelUpdated', refreshCells)
}

const refreshCells = () => {
  if (!gridApi) return

  rowNumberMap.clear()
  const rowCount = gridApi.getDisplayedRowCount()

  for (let i = 0; i < rowCount; i++) {
    const row = gridApi.getDisplayedRowAtIndex(i)

    if (row) {
      rowNumberMap.set(row.id, i + 1)
    }
  }

  gridApi.refreshCells({ columns: ['row-number', 'group', 'label']})
}

const saveTextCellChanges = (e: CellValueChangedEvent) => {
  setRecord({
    action: 'edit',
    oldValue: { ...e.data, label: e.oldValue },
    newValue: { ...e.data },
  })
  gridApi!.setGridOption('rowData', tree.getAll())
}

const setHistoryData = (isPrev = true) => {
  const changes = getRecord(isPrev)

  switch (changes.action) {
    case 'edit':
      const updatedValue = isPrev ? changes.oldValue : changes.newValue
      tree.updateItem(updatedValue)
      gridApi!.setGridOption('rowData', tree.getAll())
      break

    case 'add':
      if (isPrev) {
        tree.removeItem(changes.newValue.id)
      } else {
        tree.addItem(changes.newValue)
      }
      gridApi?.setGridOption('rowData', tree.getAll())
      break

    case 'remove':
      if (isPrev) {
        changes.oldValue.forEach(child => {
          tree.addItem(child)
        })
      } else {
        tree.removeItem(changes.newValue.id)
      }
      gridApi?.setGridOption('rowData', tree.getAll())
      break
  }
  nextTick(refreshCells)
}

onBeforeMount(async () => {
  const items = await getItems()
  tree = new TreeStore(items)
  data.value = tree.getAll()
  isLoading.value = false
})

onBeforeUnmount(() => {
  gridApi?.removeEventListener('modelUpdated', refreshCells)
})

</script>
<template>
  <main class="ag-grid-container">
    <div class="panel">
      <button
        class="mode"
        @click="isEditableMode = !isEditableMode"
      >
        Режим: {{ isEditableMode ? 'редактирование' : 'просмотр' }}
      </button>
      <template v-if="isEditableMode">
        <button
          class="arrow prev"
          :disabled="isFirstRecord"
          @click="setHistoryData()"
        />
        <button
          class="arrow next"
          :disabled="isLastRecord"
          @click="setHistoryData(false)"
        />
      </template>
    </div>
    <ag-grid-vue
      class="ag-grid"
      :column-defs="columns"
      :loading="isLoading"
      :row-data="data"
      :get-row-id="(params) => params.data.id + ''"
      :tree-data="true"
      tree-data-parent-id-field="parent"
      :group-default-expanded="-1"
      :context="{ tree, isEditableMode }"
      :debounce-vertical-scrollbar="false"
      :group-maintain-order="true"
      group-display-type="custom"
      @cell-value-changed="saveTextCellChanges"
      @grid-ready="onGridReady"
    />
  </main>
</template>

<style lang="scss" scoped>
.ag-grid-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .ag-grid {
    height: 100%
  }

  .panel {
    display: flex;
    gap: 8px;
    height: 24px;
    padding: 10px 0;

    .mode,
    .arrow {
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .mode {
      height: 24px;
      margin-right: 5px;
      font-size: 14px;
      color: #2378D7;
    }

    .arrow {
      width: 24px;
      height: 24px;
      border: none;
      background: url('@/assets/icons/arrow.svg') no-repeat center/contain;
      cursor: pointer;

      &:active {
        scale: 0.9;
      }

      &:disabled {
        filter: grayscale(1);
        opacity: 0.3;
        pointer-events: none;
      }

      &.next {
        transform: scaleX(-1);
      }
    }
  }
}
</style>
