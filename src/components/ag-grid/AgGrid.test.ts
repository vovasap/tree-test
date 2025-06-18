import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import AgGrid from './AgGrid.vue'

const delay = async (ms = 100) => await new Promise(resolve => setTimeout(resolve, ms))

vi.mock('./api/items', () => ({
  getItems: () => [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '2', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '2', label: 'Айтем 4' },
    { id: 5, parent: '2', label: 'Айтем 5' },
    { id: 6, parent: '2', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ],
}))

describe('AgGrid.vue', () => {
  let wrapper: VueWrapper
  let grid: VueWrapper

  beforeEach(async () => {
    wrapper = mount<typeof AgGrid>(AgGrid)
    await flushPromises()
    grid = wrapper.findComponent({ name: 'ag-grid-vue' })
    await delay()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders component correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders AG Grid component', () => {
    expect(grid.exists()).toBe(true)
  })

  describe('row display', () => {
    it('correct row count display', () => {
      const { groupDefaultExpanded } = grid.props() as AgGridProps
      const rows = grid.findAll('.ag-row')
      switch (groupDefaultExpanded) {
        case 0:
          expect(rows).toHaveLength(1)
          break
        case 1:
          expect(rows).toHaveLength(3)
          break
        case 2:
          expect(rows).toHaveLength(6)
          break
        default:
          expect(rows).toHaveLength(8)
          break
      }
    })

    it('сorrect ordinal values for rows', async () => {

      function checkOrdinalNumbers(texts: string[]) {
        let number = 1
        texts.forEach(text => {
          expect(Number(text)).toBe(number)
          number += 1
        })
      }

      let rows = grid.findAll('.ag-row')
      const rowTexts = rows.map(row => row.find('[col-id="row-number"]').text())

      checkOrdinalNumbers(rowTexts)

      // after collapsing

      const collapsedRow = rows[2]
      const groupButton = collapsedRow.find('.group-btn.expanded')
      await groupButton.trigger('click')

      await delay(500)

      rows = grid.findAll('.ag-row')
      const updatedRowTexts = rows.map(row => row.find('[col-id="row-number"]').text())

      expect(rowTexts.length).not.toBe(updatedRowTexts.length)

      checkOrdinalNumbers(updatedRowTexts)
    })
  })


  describe('Create-Update-Delete operations', () => {
    it('adds new item correctly', async () => {

      const addButton = grid.find('.actions .add')
      await addButton.trigger('click')

      await delay()

      const rows = grid.findAll('.ag-row')
      const newRows = rows.filter(row => row.find('[col-id="label"]').text() === 'Новый Айтем')

      expect(newRows).toHaveLength(1)
    })

    it('removes item correctly', async () => {

      const removeButton = grid.find('.actions .remove')
      await removeButton.trigger('click')

      await delay()

      const rows = grid.findAll('.ag-row')

      expect(rows).toHaveLength(0)
    })

    it('updates item label correctly', async () => {

      const row = grid.find('.ag-row')
      const labelCell = row.find('[col-id="label"]')

      await labelCell.trigger('dblclick')

      const input = labelCell.find('input')
      await input.trigger('focus')
      await input.setValue('new item')
      await input.trigger('keydown', { key: 'Tab' })

      expect(labelCell.text()).toBe('new item')
    })
  })


  it('history functionality', async () => {
    const removeButton = grid.find('.actions .remove')
    const prevHistoryButton = wrapper.find('.arrow.prev')
    const nextHistoryButton = wrapper.find('.arrow.next')

    const initialRows = grid.findAll('.ag-row')

    await removeButton.trigger('click')
    await delay()

    const afterDeletingRows = grid.findAll('.ag-row')

    await prevHistoryButton.trigger('click')
    await delay(600)

    const afterReturningBackRows = grid.findAll('.ag-row')

    await nextHistoryButton.trigger('click')
    await delay()

    const afterReturningForwardRows = grid.findAll('.ag-row')

    expect(initialRows).toHaveLength(8)
    expect(afterDeletingRows).toHaveLength(0)
    expect(afterReturningBackRows).toHaveLength(8)
    expect(afterReturningForwardRows).toHaveLength(0)
  })
})

type AgGridProps = {
  groupDefaultExpanded: number
}