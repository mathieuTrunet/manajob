import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('notes', () => {
  const noteId = ref<string | undefined>(undefined)

  function setNoteId(offerId: string | undefined) {
    noteId.value = offerId
  }

  return { noteId, setNoteId }
})
