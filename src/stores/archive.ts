import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArchiveStore = defineStore('archive', () => {
  const archives = ref<boolean>(false)

  function setTrue() {
    archives.value = true
  }

  function setFalse() {
    archives.value = false
  }

  return { archives, setFalse, setTrue }
})
