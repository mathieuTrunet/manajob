<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { CardContent, CardTitle, CardDescription, CardHeader, Card } from '../components/ui/card';
import { Input } from './ui/input';
import { createColumnHelper, FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { Button } from './ui/button';
import { PlusIcon, ArchiveIcon, TrashIcon, CaretSortIcon, BackpackIcon } from '@radix-icons/vue'
import { useOffersStore } from '@/stores/offers';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import OfferForm from './OfferForm.vue';
import { Checkbox } from './ui/checkbox';
import { computed, h, HTMLAttributes, ref, watch } from 'vue';
import DropDown from './DropDown.vue'
import { cn } from '@/lib/utils';
import { useArchiveStore } from '@/stores/archive';
import { useNoteStore } from '@/stores/note';
import DeleteAlertDialog from './DeleteAlertDialog.vue';

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const offersStore = useOffersStore()

const archiveStore = useArchiveStore()

const noteStore = useNoteStore()

const parseDate = (date: string) => date.split('-').reverse().join('/')

const columnHelper = createColumnHelper<Offer>()

const selectColumn = columnHelper.display({
    id: 'select',
    header: ({ table }) => h(Checkbox, {
        checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': value => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
})
const companyNameColumn = columnHelper.accessor('companyName', {
    header: ({ column }) => h(
        Button, { variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'), },
        () => ['Entreprise', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
    ),
    cell: ({ row }) => h('a', {
        class: cn('capitalize text-base', row.original.offerLink && 'font-bold hover:underline decoration-primary'),
        ...(row.original.offerLink && { href: `${row.original.offerLink}`, target: '_blank', }),
    }, row.original.companyName),
    enableSorting: true,
    enableGlobalFilter: true,
})

const appliedColumn = columnHelper.display({
    id: 'applied',
    header: `Candidature envoyée`,
    cell: ({ row }) => h(Checkbox, {
        checked: row.original.applied,
        'onUpdate:checked': (checked) => {
            if (!row.getIsSelected()) return offersStore.setOffersApplied(checked, row.original)
            if (row.getIsSelected() && getAllSelectedOffers().length === 1) return offersStore.setOffersApplied(checked, row.original)
            if (row.getIsSelected() && getAllSelectedOffers().length > 1) return offersStore.setOffersApplied(checked, ...getAllSelectedOffers())
        },
    }),
    enableSorting: false,
    enableHiding: false,
})

const answerReceivedColumn = columnHelper.display({
    id: 'answerReceived',
    header: `Réponse obtenue`,
    cell: ({ row }) => h(Checkbox, {
        checked: row.original.answerReceived,
        'onUpdate:checked': (checked) => {
            if (!row.getIsSelected()) return offersStore.setOffersAnswerReceived(checked, row.original)
            if (row.getIsSelected() && getAllSelectedOffers().length === 1) return offersStore.setOffersAnswerReceived(checked, row.original)
            if (row.getIsSelected() && getAllSelectedOffers().length > 1) return offersStore.setOffersAnswerReceived(checked, ...getAllSelectedOffers())
        },
    }),
    enableSorting: false,
    enableHiding: false,
})

const offerDateColumn = columnHelper.accessor('offerDate', {
    header: ({ column }) => h(Button, {
        variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    },
        () => [`Date de l'annonce`, h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
    ),
    cell: ({ row }) => row.original.offerDate ? parseDate(row.original.offerDate) : '-',
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const applyDateColumn = columnHelper.accessor('applyDate', {
    header: ({ column }) => h(Button, {
        variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    },
        () => ['Date de candidature', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
    ),
    cell: ({ row }) => row.original.applyDate ? parseDate(row.original.applyDate) : '-',
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const experienceRequiredColumn = columnHelper.accessor('experienceRequired', {
    header: ({ column }) => h(Button, {
        variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    },
        () => [`Expérience requise`, h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
    ),
    cell: ({ row }) => (row.getValue('experienceRequired') ? `${row.getValue('experienceRequired')} ans` : '-'),
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const actionsColumn = columnHelper.display({
    header: () => h('a', { class: 'px-6' }),
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => h(DropDown, { offer: row.original }),
})

const columns = [
    selectColumn,
    companyNameColumn,
    appliedColumn,
    answerReceivedColumn,
    offerDateColumn,
    applyDateColumn,
    experienceRequiredColumn,
    actionsColumn,
]

const archivedOffers = computed(() => offersStore.offers.filter(offer => offer.archived))

const nonArchivedOffers = computed(() => offersStore.offers.filter(offer => !offer.archived))

const globalFilter = ref('')

const setGlobalFilter = (value: string) => globalFilter.value = value

const table = useVueTable({
    get data() { if (archiveStore.archives) { return archivedOffers.value } else { return nonArchivedOffers.value } },
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get globalFilter() {
            return globalFilter.value
        }
    },
    onGlobalFilterChange: setGlobalFilter,
})

const getAllSelectedOffers = () => table.getSelectedRowModel().rows.filter(row => row.getIsSelected()).map(row => row.original)

const deleteSelectedOffers = () => { offersStore.deleteOffers(...getAllSelectedOffers()), table.resetRowSelection() }

const setArchivedSelectedOffers = () => { offersStore.setOffersArchived(!archiveStore.archives, ...getAllSelectedOffers()), table.resetRowSelection() }

watch(() => archiveStore.archives, table.resetRowSelection)

watch(() => table.getRowCount(), () => { if (!table.getRowCount()) return table.resetRowSelection() })
</script>

<template>
    <div :class="cn(props.class)">
        <Card class="mb-4 max-w-6xl">
            <CardHeader>
                <CardTitle class="flex">
                    <BackpackIcon class="mr-2" /> Candidatures
                </CardTitle>
                <CardDescription>Gérer vos candidatures à des offres d'emploi</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    class="grid max-w-5xl gap-3 lg:grid-rows-1 lg:grid-cols-6 sm:grid-rows-2 sm:grid-cols-3 grid-rows-5 grid-cols-1">

                    <Input class="sm:col-span-2" placeholder="Chercher une entreprise..." v-model="globalFilter" />

                    <OfferForm>
                        <Button>
                            <PlusIcon class="mr-2" /> Ajouter
                        </Button>
                    </OfferForm>

                    <Button :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                        variant="outline" :onclick="setArchivedSelectedOffers">
                        <ArchiveIcon class="mr-2" /> {{ archiveStore.archives ? 'Désarchiver' : 'Archiver' }}
                    </Button>

                    <DeleteAlertDialog :delete-function="deleteSelectedOffers" many-offers-to-delete>
                        <Button :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                            :variant="(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) ? 'destructive' : 'outline'">
                            <TrashIcon class="mr-2" /> Supprimer
                        </Button>
                    </DeleteAlertDialog>

                    <Tabs default-value="current">
                        <TabsList>
                            <TabsTrigger :onclick="archiveStore.setFalse" value="current">En cours</TabsTrigger>
                            <TabsTrigger :onclick="archiveStore.setTrue" value="archived">Archives</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
        <Card class="max-h-[400px] overflow-y-auto">
            <Table class="h-[300px]">
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id" class="text-center">
                            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <template v-for="row in table.getRowModel().rows" :key="row.id">
                            <TableRow :data-state="row.getIsSelected() && 'selected'" class="text-center"
                                :onclick="() => noteStore.setNoteId(row.original.id)">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>
                    <TableRow v-else>
                        <TableCell :colspan="table.getAllColumns().length">
                            <div class="flex flex-col place-content-center text-center items-center space-y-2">
                                <span class="font-medium">
                                    Pas de candidature {{ archiveStore.archives ? `archivée` : '' }}
                                </span>
                                <OfferForm v-if="!archiveStore.archives">
                                    <Button class=" w-[25vh] ">
                                        <PlusIcon class="mr-2" /> Ajouter une candidature
                                    </Button>
                                </OfferForm>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    </div>
</template>