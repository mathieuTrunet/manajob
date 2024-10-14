import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOffersStore = defineStore(
  'offers',
  () => {
    const offers = ref<Offer[]>([])

    function addOffers(...addedOffers: Offer[]) {
      offers.value = [...offers.value, ...addedOffers]
    }

    function deleteOffers(...offersToDelete: Offer[]) {
      const offersId = offersToDelete.map(offer => offer.id)
      offers.value = offers.value.filter(offer => !offersId.includes(offer.id))
    }

    function modifyOffer(modifiedOffer: Offer) {
      offers.value = offers.value.map(offer =>
        offer.id === modifiedOffer.id ? { ...offer, ...modifiedOffer } : offer
      )
    }

    function setOffersApplied(newApplied: boolean, ...offersToUpdate: Offer[]) {
      const offersId = offersToUpdate.map(offer => offer.id)
      offers.value = offers.value.map(offer =>
        offersId.includes(offer.id) ? { ...offer, applied: newApplied } : offer
      )
    }

    function setOffersAnswerReceived(newAnswerReceived: boolean, ...offersToUpdate: Offer[]) {
      const offersId = offersToUpdate.map(offer => offer.id)
      offers.value = offers.value.map(offer =>
        offersId.includes(offer.id) ? { ...offer, answerReceived: newAnswerReceived } : offer
      )
    }

    function setOffersArchived(newArchived: boolean, ...offersToUpdate: Offer[]) {
      const offersId = offersToUpdate.map(offer => offer.id)
      offers.value = offers.value.map(offer =>
        offersId.includes(offer.id) ? { ...offer, archived: newArchived } : offer
      )
    }

    return {
      offers,
      addOffers,
      setOffersApplied,
      setOffersAnswerReceived,
      setOffersArchived,
      deleteOffers,
      modifyOffer,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['offers'],
    },
  }
)
