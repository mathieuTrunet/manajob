<script setup lang="ts">
import { useNoteStore } from '@/stores/note';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from './ui/card';
import { useOffersStore } from '@/stores/offers';
import { computed, HTMLAttributes, ref, watch } from 'vue';
import { Textarea } from './ui/textarea';
import { useArchiveStore } from '@/stores/archive';
import { Pencil2Icon } from '@radix-icons/vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const noteStore = useNoteStore()

const offersStore = useOffersStore()

const archiveStore = useArchiveStore()

const text = ref('')

watch(() => offersStore.offers, () => {
    if (!noteStore.noteId) return
    const offersId = offersStore.offers.map(offer => offer.id)
    if (!offersId.includes(noteStore.noteId)) { noteStore.setNoteId(undefined) }
})

watch(() => archiveStore.archives, () => {
    if (noteStore.noteId) return noteStore.setNoteId(undefined)
})

const offer = computed(() => offersStore.offers.find(offer => offer.id === noteStore.noteId)!)

watch(() => offer.value, () => text.value = offer.value?.additionalNotes!)

const updateOfferNotes = (newNotes: string) => offersStore.modifyOffer({ ...offer.value, additionalNotes: newNotes })

const capitalizeString = (string: string) => string[0].toUpperCase() + string.slice(1)
</script>

<template>
    <Card :class="cn(props.class)">
        <CardHeader>
            <CardTitle class="flex">
                <Pencil2Icon class="mr-2" /> Notes
            </CardTitle>
            <CardDescription>
                {{ offer ? `Notes de : ${capitalizeString(offer.companyName)}` : 'Selectionnez une offre' }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea :disabled="!noteStore.noteId" class="resize-none h-20 lg:h-32"
                placeholder="Ajoutez des informations additionnelles sur une candidature" :model-value="text"
                @input="updateOfferNotes($event.target.value)" />
        </CardContent>
    </Card>
</template>