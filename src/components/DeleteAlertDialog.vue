<script setup lang="ts">
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';

const { deleteFunction, manyOffersToDelete = false, closeParent } = defineProps<{
    deleteFunction: () => void,
    manyOffersToDelete?: boolean,
    closeParent?: () => void
}>()

const submit = () => {
    if (closeParent) closeParent()
    deleteFunction()
}
</script>

<template>
    <AlertDialog>
        <AlertDialogTrigger as-child>
            <slot></slot>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                <AlertDialogDescription v-if="manyOffersToDelete">
                    Les éléments sélectionnés seront définitivement supprimés et ne pourront plus être récupérés
                </AlertDialogDescription>
                <AlertDialogDescription v-else>
                    L'offre sélectionnée sera définitivement supprimée et ne pourra plus être récupérée
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction :onclick="submit">
                    Supprimer
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
