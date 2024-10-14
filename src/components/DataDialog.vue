<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { UploadIcon, DownloadIcon } from '@radix-icons/vue';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useOffersStore } from '@/stores/offers';

const offersStore = useOffersStore()

const DEFAULT_VALUE = JSON.stringify({ offers: [] })

const FILE_NAME = 'manajob.json'

const downloadOffersFile = () => {
    const blob = new Blob([JSON.stringify({ offers: offersStore.offers }) || DEFAULT_VALUE], { type: 'application/json' })

    const url = URL.createObjectURL(blob)

    const link: HTMLAnchorElement | null = document.createElement('a')
    link.href = url
    link.download = FILE_NAME

    link.click()

    URL.revokeObjectURL(url)
}

const uploadedFileContent = ref<string>()

const upload = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'

    fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files![0]

        const reader = new FileReader()

        reader.onload = event => {
            const fileContent = event.target!.result
            uploadedFileContent.value = JSON.parse(fileContent as string || '')
        }

        reader.readAsText(file)

    })

    fileInput.click()
}

const fileContentSchema = z.object({
    offers: z.array(z.object({
        id: z.string().min(32),
        companyName: z.string().min(2),
        applied: z.boolean(),
        answerReceived: z.boolean(),
        archived: z.boolean(),
        applyDate: z.string().default(''),
        offerDate: z.string().default(''),
        offerLink: z.string().default(''),
        experienceRequired: z.number().default(0),
        additionalNotes: z.string().default(''),
    }))
})

const uploadStatusMessage = computed(() => {
    try {
        if (!uploadedFileContent.value) return ''
        fileContentSchema.parse(uploadedFileContent.value)
        return 'Données importées avec succès'
    } catch (error) {
        return ('Erreur dans le format du fichier ou de son contenu')
    }
})

watch(() => uploadedFileContent.value, () => {
    if (!uploadedFileContent.value) return

    const result = fileContentSchema.safeParse(uploadedFileContent.value)

    if (result.success) offersStore.offers = result.data.offers
})

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot></slot>
        </DialogTrigger>
        <DialogContent class="md:max-w-[500px]">
            <div class=" place-content-around space-y-6">
                <div class="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Exporter</DialogTitle>
                        <DialogDescription>
                            Obtenir un fichier contenant vos données sur ce navigateur
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex justify-center">
                        <Button class="space-x-2 py-6" :onclick="downloadOffersFile">
                            <DownloadIcon /><span> Exporter </span>
                        </Button>
                    </div>
                </div>
                <Separator orientation="horizontal" class="w-auto my-4" />
                <div class="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Importer</DialogTitle>
                        <DialogDescription>
                            Déposer un fichier de données pour les avoir sur ce navigateur
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex justify-center">
                        <Button class="space-x-2 py-6" :onclick="upload">
                            <UploadIcon /><span> Importer</span>
                        </Button>
                    </div>
                    <span
                        :class="cn('flex justify-center mt-4 text-center', uploadStatusMessage === 'Données importées avec succès' ? 'text-green-500' : 'text-red-500')">
                        {{ uploadStatusMessage }}
                    </span>
                </div>
            </div>
        </DialogContent>
    </Dialog>

</template>