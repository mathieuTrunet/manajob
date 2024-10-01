<script setup lang="ts">
import { useNoteStore } from '@/stores/note';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from './ui/card';
import { useOffersStore } from '@/stores/offers';
import { computed, ref, watch } from 'vue';
import { Textarea } from './ui/textarea';

const noteStore = useNoteStore()

const offersStore = useOffersStore()

const text = ref('')

watch(() => offersStore.offers, () => {
    if (!noteStore.noteId) return
    const offersId = offersStore.offers.map(offer => offer.id)
    if (!offersId.includes(noteStore.noteId)) { noteStore.setNoteId(undefined) }
})

const offer = computed(() => offersStore.offers.find(offer => offer.id === noteStore.noteId)!)

watch(() => offer.value, () => text.value = offer.value?.additionalNotes!)

const updateOfferNotes = (newNotes: string) => offersStore.modifyOffer({ ...offer.value, additionalNotes: newNotes })
</script>

<template>
    <Card class="my-3 mr-5 w-full h-max-[35vh] h-full">
        <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>{{ offer ? `Notes de : ${offer.companyName}` : 'Selectionnez une offre' }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea :disabled="!noteStore.noteId" class="resize-none h-[25vh]"
                placeholder="Ajoutez des informations additionnelles sur une candidature" :model-value="text"
                @input="updateOfferNotes($event.target.value)" />
        </CardContent>
    </Card>
</template>