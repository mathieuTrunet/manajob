<script setup lang="ts">
import { Button } from './ui/button';
import OfferForm from './OfferForm.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { QuestionMarkIcon, LapTimerIcon, MagicWandIcon, UpdateIcon } from '@radix-icons/vue';
import { Input } from './ui/input';
import { computed, HTMLAttributes, ref } from 'vue';
import CompletionDialog from './CompletionDialog.vue';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const MINIMUM_INPUT_SIZE = 10
const MAXIMUM_INPUT_SIZE = 12_500
const DELAY_BETWEEN_REQUEST = 20_000

const COMPLETION_URL = '/api/completion'

const inputContent = ref<string>('')

const isFetching = ref<boolean>(false)
const isInDelay = ref<boolean>(false)

const errorMessage = ref<string>('')

const completion = ref<Partial<Offer>>({ companyName: '', offerDate: '', experienceRequired: 0, offerLink: '' })

const showOfferForm = ref(false)

const isContentInputInvalid = computed(() => inputContent.value.includes('http') ? false : inputContent.value.length < MINIMUM_INPUT_SIZE)

const isContentInputTooLarge = computed(() => inputContent.value.length >= MAXIMUM_INPUT_SIZE)

const triggerOfferDialog = () => document.getElementById('completion-dialog')?.click()

const getErrorMessage = (error: { status: number, message: string }) => {
    const { status, message } = error

    if (status === 413) return 'Contenu trop large'
    if (status === 403 || message === 'Offer Fetch Error') return `L'URL insérée ne semble pas valide ou pas autorisée, réessayer avec le texte de l'offre`
    if (status === 429 && message === 'User Limit Reached') return 'Vous avez atteint votre limite pour la minute'
    if (status === 503 || (status === 429 && message === 'Too Many Requests')) return `Trop de demandes actuellement, réessayer dans un instant`
    if (status === 403 && message === 'Region Not Supported') return `Région non autorisée`
    return 'erreur ' + status
}

const endCompletion = () => {
    isFetching.value = false

    isInDelay.value = true

    setTimeout(() => isInDelay.value = false, DELAY_BETWEEN_REQUEST)
}

const getCompletion = async () => {
    if (!inputContent.value.length) return
    if (isInDelay.value || isFetching.value) return

    isFetching.value = true

    const response = await fetch(COMPLETION_URL, { method: 'POST', body: `${inputContent.value}` })

    if (!response.ok) {
        endCompletion()

        return errorMessage.value = getErrorMessage({ status: response.status, message: await response.text() })
    }

    const data = await response.json() as Partial<Offer>

    const { companyName, offerDate, experienceRequired } = data

    if (!companyName && !offerDate && !experienceRequired) {
        endCompletion()

        return errorMessage.value = 'Aucune information pertinente trouvée'
    }

    completion.value = data
    showOfferForm.value = true

    errorMessage.value = ''
    inputContent.value = ''

    setTimeout(() => triggerOfferDialog(), 1)

    endCompletion()
}

</script>

<template>
    <Card :class="cn(props.class)">
        <div class="hidden">
            <OfferForm v-if="showOfferForm" :default-values="completion" :close-parent="() => showOfferForm = false">
                <div id="completion-dialog" />
            </OfferForm>
        </div>
        <CardHeader class="flex flex-row justify-between">
            <div class="space-y-2">
                <CardTitle class="flex">
                    <MagicWandIcon class="mr-2" />Remplir une candidature avec l'IA
                </CardTitle>
                <CardDescription>
                    Entrer une URL ou une offre d'emploi écrite, et l'IA la complétera
                </CardDescription>
            </div>
            <div class="ml-4">
                <CompletionDialog>
                    <Button variant="outline" class="px-3">
                        <QuestionMarkIcon />
                    </Button>
                </CompletionDialog>
            </div>
        </CardHeader>
        <CardContent>
            <Input :disabled="isFetching" v-model="inputContent" placeholder="Saisir une URL ou du texte" />
        </CardContent>
        <CardFooter class="space-x-10">
            <Button class="p-0" variant="outline" :onclick="getCompletion"
                :disabled="isFetching || isInDelay || isContentInputInvalid || isContentInputTooLarge">
                <div
                    :class="cn(!(isInDelay || isContentInputInvalid || isContentInputTooLarge) && 'transition-all ease-in-out duration-700 completion-button-background', 'px-2 h-full place-content-center rounded-l-[5px]')">
                    <UpdateIcon v-if="isFetching" src="/src/assets/load.svg"
                        class="w-[27px] size-5 animate-spin text-black" />
                    <LapTimerIcon v-else-if="isInDelay" class="w-[27px] size-5" />
                    <img v-else src="/src/assets/stars.svg" width="27" height="27">
                </div>
                <Separator orientation="vertical" />
                <div class="px-3 h-full place-content-center rounded-r-[5px]">
                    <span v-if="isInDelay">Patientez</span>
                    <span v-else-if="isFetching">Traitement...</span>
                    <span v-else>Ajouter</span>
                </div>
            </Button>
            <span v-if="isContentInputTooLarge" class="text-red-500">Contenu trop large</span>
            <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
        </CardFooter>
    </Card>
</template>