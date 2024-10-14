<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { useOffersStore } from '@/stores/offers'
import { Separator } from './ui/separator'
import { NumberField, NumberFieldContent, NumberFieldIncrement, NumberFieldDecrement, NumberFieldInput } from './ui/number-field'
import { Calendar } from './ui/calendar'
import { PopoverTrigger, Popover, PopoverContent } from './ui/popover'
import { cn } from '@/lib/utils'
import { toDate } from 'radix-vue/date'
import { CalendarIcon } from '@radix-icons/vue'
import { computed, watch } from 'vue'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Checkbox } from './ui/checkbox'

const MAXIMUM_COMPANY_NAME_SIZE = 25 

const { modify = false, defaultValues, closeParent } = defineProps<{ modify?: boolean, defaultValues?: Partial<Offer>, closeParent?: () => void }>()

const offersStore = useOffersStore()

const formSchema = toTypedSchema(z.object({
    companyName: z.string().min(2).max(MAXIMUM_COMPANY_NAME_SIZE),
    offerLink: z.string().optional().default(''),
    experienceRequired: z.number().optional(),
    offerDate: z.string().optional(),
    applied: z.boolean().default(false),
    applyDate: z.string().optional(),
}))

const { values, handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: defaultValues,
    keepValuesOnUnmount: modify
})

const dateFormatter = new DateFormatter('en-GB', { dateStyle: 'short' })

const selectedOfferDate = computed({
    get: () => values.offerDate ? parseDate(values.offerDate) : undefined,
    set: val => val,
})

const selectedApplyDate = computed({
    get: () => values.applyDate ? parseDate(values.applyDate) : undefined,
    set: val => val,
})

const formIsUncompleted = computed(() => !values.companyName || values.companyName.length < 2 || values.companyName.length >= MAXIMUM_COMPANY_NAME_SIZE)

watch(() => values.applied, (newVal, oldVal) => (!newVal && oldVal && values.applyDate) && setFieldValue('applyDate', undefined))

const capitalizeName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

const onSubmit = handleSubmit((values) => {
    if (modify) { offersStore.modifyOffer({ ...values, answerReceived: false, archived: defaultValues!.archived!, id: defaultValues!.id!, companyName: capitalizeName(values.companyName) }) }
    else { offersStore.addOffers({ ...values, answerReceived: false, archived: false, id: crypto.randomUUID(), companyName: capitalizeName(values.companyName) }) }
    if (closeParent) { closeParent() }
})

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot></slot>
        </DialogTrigger>
        <DialogContent class="md:max-w-[700px]" v-on:interact-outside="closeParent">
            <form @submit="onSubmit">
                <DialogHeader class="mb-4">
                    <DialogTitle>{{ modify ? 'Modifier' : 'Ajouter' }} une candidature</DialogTitle>
                </DialogHeader>
                <DialogDescription />
                <div class="flex place-content-around space-x-2">
                    <div class="space-y-4">
                        <FormField v-slot="{ componentField }" name="companyName">
                            <FormItem>
                                <FormLabel>Entreprise<span class="text-primary"> *</span></FormLabel>
                                <FormDescription />
                                <FormControl>
                                    <Input type="text" placeholder="Nom de l'entreprise" v-bind="componentField" />
                                </FormControl>
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="offerLink">
                            <FormItem>
                                <FormLabel>Annonce</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="URL vers l'annonce" v-bind="componentField" />
                                </FormControl>
                            </FormItem>
                        </FormField>
                        <FormField name="experienceRequired">
                            <FormItem>
                                <FormLabel>Expérience</FormLabel>
                                <FormDescription>Nombre d'années d'expériences requises</FormDescription>
                                <FormControl>
                                    <NumberField :min="0" :default-value="values.experienceRequired || 0"
                                        @update:model-value="(v) => setFieldValue('experienceRequired', v ? v : undefined)">
                                        <NumberFieldContent>
                                            <NumberFieldDecrement />
                                            <FormControl>
                                                <NumberFieldInput />
                                            </FormControl>
                                            <NumberFieldIncrement />
                                        </NumberFieldContent>
                                    </NumberField>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>
                    <Separator orientation="vertical" class="h-auto" />
                    <div class="space-y-4">
                        <FormField name="offerDate">
                            <FormItem class="space-y-1">
                                <FormLabel>Date de l'annonce</FormLabel>
                                <FormDescription />
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <FormControl>
                                            <Button variant="outline" :class="cn(
                                                'w-[260px] ps-3 text-start font-normal',
                                                !selectedOfferDate && 'text-muted-foreground',
                                            )">
                                                <span>{{ selectedOfferDate ?
                                                    dateFormatter.format(toDate(selectedOfferDate)) : `Date de
                                                    publication de l'annonce`}}</span>
                                                <CalendarIcon class="ms-auto h-4 w-4 text-primary" />
                                            </Button>
                                            <input hidden>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0">
                                        <Calendar v-model="selectedOfferDate" calendar-label="Date de l'annonce"
                                            :min-value="new CalendarDate(1970, 1, 1)"
                                            :max-value="today(getLocalTimeZone())"
                                            @update:model-value="(v) => v ? setFieldValue('offerDate', v.toString()) : setFieldValue('offerDate', undefined)" />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ value, handleChange }" type="checkbox" name="applied">
                            <FormItem>
                                <FormControl>
                                    <Checkbox :checked="value" @update:checked="handleChange" class="mr-2" />
                                </FormControl>
                                <FormLabel>Candidature envoyée</FormLabel>
                            </FormItem>
                        </FormField>
                        <FormField name="applyDate">
                            <FormItem>
                                <FormLabel>Date de candidature</FormLabel>
                                <FormDescription></FormDescription>
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <FormControl>
                                            <Button :disabled="!values.applied" variant="outline" :class="cn(
                                                'w-[260px] ps-3 text-start font-normal',
                                                !selectedApplyDate && 'text-muted-foreground',
                                            )">
                                                <span>{{ selectedApplyDate ?
                                                    dateFormatter.format(toDate(selectedApplyDate)) : `Date de
                                                    candidature au poste`}}</span>
                                                <CalendarIcon class="ms-auto h-4 w-4 text-primary" />
                                            </Button>
                                            <input hidden>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0">
                                        <Calendar v-model="selectedApplyDate" calendar-label="Date de candidature"
                                            :min-value="selectedOfferDate || new CalendarDate(1900, 1, 1)"
                                            :max-value="today(getLocalTimeZone())"
                                            @update:model-value="(v) => v ? setFieldValue('applyDate', v.toString()) : setFieldValue('applyDate', undefined)" />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        </FormField>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" v-if="formIsUncompleted" disabled>
                        {{ modify ? 'Modifier' : 'Ajouter' }}
                    </Button>
                    <DialogClose v-else>
                        <Button type="submit">
                            {{ modify ? 'Modifier' : 'Ajouter' }}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
