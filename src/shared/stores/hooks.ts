let _rootStore

export function setRootStoreRefs (store) {
  _rootStore = store
}

export function useStore () {
  return _rootStore
}
