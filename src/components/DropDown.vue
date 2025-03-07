<script lang="ts" setup>
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from './ui/dropdown-menu';
import { DotsHorizontalIcon, ArchiveIcon, TrashIcon, UpdateIcon } from '@radix-icons/vue';
import { Button } from './ui/button';
import { useOffersStore } from '@/stores/offers';
import OfferForm from './OfferForm.vue';
import { ref } from 'vue';
import DeleteAlertDialog from './DeleteAlertDialog.vue';

const { offer } = defineProps<{ offer: Offer }>()

const offersStore = useOffersStore()

const deleteOffer = () => offersStore.deleteOffers(offer)

const setArchivedOffer = () => offersStore.setOffersArchived(!offer.archived, offer)

const open = ref<false | undefined>(undefined)

const closeMenu = () => { open.value = false, setTimeout(() => { open.value = undefined }, 1) }

</script>
<template>
    <DropdownMenu :open="open">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="px-3">
                <DotsHorizontalIcon />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel id="actions-title">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <OfferForm :modify="true" :default-values="offer" :close-parent="closeMenu">
                    <Button
                        class="flex items-center space-x-2 text-sm font-normal p-2 w-full cursor-default select-none justify-start h-8 rounded"
                        variant="ghost">
                        <UpdateIcon /><span>Modifier</span>
                    </Button>
                </OfferForm>
                <DropdownMenuItem :onclick="setArchivedOffer" class="space-x-2">
                    <ArchiveIcon /><span>{{ offer.archived ? 'Désarchiver' : 'Archiver' }}</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DeleteAlertDialog :delete-function="deleteOffer">
                <Button
                    class="flex items-center text-sm font-normal p-2 w-full cursor-default select-none justify-start h-8 rounded"
                    variant="destructive">
                    <TrashIcon class="mr-2" /><span>Supprimer</span>
                </Button>
            </DeleteAlertDialog>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
