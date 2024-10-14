<script setup lang="ts">
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

</script>

<template>
    <Dialog>
        <DialogTrigger>
            <slot></slot>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader class="space-y-3">
                <DialogTitle>Remplir une candidature avec l'IA</DialogTitle>
                <DialogDescription>Dans la zone de texte, copiez une URL vers une annonce d'offre d'emploi (commencant
                    par
                    http:// et terminant par un domaine .com, .fr...), ou directement le contenu texte d'une offre
                    d'emploi.
                </DialogDescription>
                <DialogTitle>Les cas d'utilisation invalides</DialogTitle>
                <DialogDescription>
                    <ul class="ml-6 list-disc [&>li]:mt-2">
                        <li>Certains sites ne permettront pas l'utilisation d'une URL
                        </li>
                        <li>Les sites ne proposant pas d'offres d'emploi avec une page dédiée (Linkedin, Indeed...)
                            ne seront
                            pas acceptées
                        </li>
                    </ul>
                    Dans ces cas, utilisez plutôt directement le texte de l'offre
                </DialogDescription>
                <DialogTitle>Les informations récupérées</DialogTitle>
                <DialogDescription>Les informations recherchées dans l'offre d'emploi sont :
                    <ul class="ml-6 list-disc [&>li]:mt-2">
                        <li>Nom de l'entreprise</li>
                        <li>Date de publication de l'offre</li>
                        <li>Années d'expérience requises</li>
                        <li>Lien vers l'offre si utilisé pour la recherche</li>
                    </ul>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
</template>