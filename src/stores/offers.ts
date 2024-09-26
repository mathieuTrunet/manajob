import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOffersStore = defineStore('offers', () => {
  const offers = ref<Offer[]>([{ companyName: 'fsd', applied: true, classified: false, answerReceived: true }])

  function addOffers(...addedOffers: Offer[]) {
    offers.value = [...offers.value, ...addedOffers]
  }

  return { offers, addOffers }
})
