<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
//import { useOffersStore } from '@/stores/offers'
import { Separator } from '../ui/separator'
import { NumberField, NumberFieldContent, NumberFieldIncrement, NumberFieldDecrement, NumberFieldInput } from '../ui/number-field'
import { Calendar } from '../ui/calendar'
import { PopoverTrigger, Popover, PopoverContent } from '../ui/popover'
import { cn } from '@/lib/utils'
import { toDate } from 'radix-vue/date'
import { ref } from 'vue'

//const store = useOffersStore()

const formSchema = toTypedSchema(z.object({
    companyName: z.string().min(2).max(25),
    offerLink: z.string().optional().default(''),
    experienceRequired: z.number().optional(),
    offerDate: z.string().optional()
}))

const form = useForm({
    validationSchema: formSchema,
    //keepValuesOnUnmount: true,
    //initialValues: { companyName: 'zed', offerLink: 'sfdfds', }
})

const onSubmit = form.handleSubmit((values) => {
    console.log(values)
})

const placeholder = ref()


</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot></slot>
        </DialogTrigger>
        <DialogContent class="md:max-w-[600px]">
            <form @submit="onSubmit">
                <DialogHeader class="mb-4">
                    <DialogTitle>Ajouter une candidature</DialogTitle>
                </DialogHeader>
                <DialogDescription />
                <div class="flex place-content-around gap-12">
                    <div>
                        <FormField v-slot="{ componentField }" name="companyName">
                            <FormItem>
                                <FormLabel>Entreprise<span class="text-rose-500"> *</span></FormLabel>
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
                                <FormControl>
                                    <NumberField :min="0"
                                        @update:model-value="(v) => form.setFieldValue('experienceRequired', v ? v : undefined)">
                                        <NumberFieldContent>
                                            <NumberFieldDecrement />
                                            <FormControl>
                                                <NumberFieldInput />
                                            </FormControl>
                                            <NumberFieldIncrement />
                                        </NumberFieldContent>
                                    </NumberField>
                                </FormControl>
                                <FormDescription>Nombre d'années d'expériences requises</FormDescription>
                            </FormItem>
                        </FormField>
                    </div>
                    <Separator orientation="vertical" class="h-auto" />
                    <div>
                        <FormField name="offerDate">
                            <FormItem>
                                <FormLabel>Date de l'annonce</FormLabel>
                                <Popover>
                                    <PopoverTrigger>
                                        <FormControl>
                                            <Button variant="outline"
                                                :class="cn('w-[240px] ps-3 text-start font-normal', !form.values.offerDate && 'text-muted-foreground',)">
                                                <span>{{ form.values.offerDate ? form.values.offerDate : "Pick a date"
                                                    }}</span>
                                                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            <input hidden>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0">
                                        <Calendar v-model:placeholder="placeholder" v-model="form.values.offerDate"
                                            calendar-label="Date of birth" initial-focus />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        </FormField>
                    </div>
                </div>


                <DialogFooter>
                    <Button type="submit">
                        Ajouter
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
