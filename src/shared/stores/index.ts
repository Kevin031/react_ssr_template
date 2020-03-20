import { types } from 'mobx-state-tree'
import { setRootStoreRefs } from './hooks'

const RootStore = types.model('RootStore')
  .props({})

const createStore = function (initStates) {
  const store = RootStore.create({})
  setRootStoreRefs(store)
  return store
}

export default createStore
