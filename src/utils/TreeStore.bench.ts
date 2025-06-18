import { describe, bench } from 'vitest'
import TreeStore from './TreeStore'

const getItems = (length: number) => {
  let parent: number | null = null
  const items = Array.from({ length }, (_, idx) => {
    parent = !idx ? parent : idx - 1
    return {
      id: idx,
      parent,
      label: 'item ' + idx,
    }
  })

  return items
}

const SMALL = 5
const MEDIUM = 100
const LARGE = 1000

const sizes = [SMALL, MEDIUM, LARGE]

// VERTICAL

const getTest = () => {
  sizes.forEach(size => {
    describe(`${size} items`, () => {

      const getTree = () => new TreeStore(getItems(size))

      bench('getAll()', async () => {
        getTree().getAll()
      })

      bench('getItem()', () => {
        getTree().getItem(0)
      })

      bench('getChildren()', () => {
        getTree().getChildren(0)
      })

      bench('getAllChildren()', () => {
        getTree().getAllChildren(0)
      }, { warmupIterations: 3 })

      bench('addItem()', () => {
        getTree().addItem({ id: size, parent: 0, label: 'added' })
      })

      bench('updateItem()', () => {
        getTree().updateItem({ id: 0, parent: null, label: 'updated' })
      })

      bench('removeItem()', () => {
        getTree().removeItem(0)
      })
    })
  })
}

describe('VERTICAL tree store benchmark', getTest)

// HORIZONTAL

describe('HORIZONTAL tree store benchmark', () => {
  const trees = {} as Record<typeof sizes[number], () => TreeStore>

  sizes.forEach(size => trees[size] = () => new TreeStore(getItems(size)))

  describe('getAll()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().getAll()
      })
    })
  })
  describe('getItem()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().getItem(0)
      })
    })
  })
  describe('getChildren()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().getChildren(0)
      })
    })
  })
  describe('getAllChildren()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().getAllChildren(0)
      })
    })
  })
  describe('addItem()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().addItem({ id: size, parent: 0, label: 'added' })
      })
    })
  })
  describe('updateItem()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().updateItem({ id: 0, parent: null, label: 'updated' })
      })
    })
  })
  describe('removeItem()', () => {
    sizes.forEach(size => {
      bench(`${size} items`, () => {
        trees[size]().removeItem(0)
      })
    })
  })
})
