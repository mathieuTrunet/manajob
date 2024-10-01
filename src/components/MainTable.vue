<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { CardContent, CardTitle, CardDescription, CardHeader, Card } from '../components/ui/card';
import { Input } from './ui/input';
import { createColumnHelper, FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { Button } from './ui/button';
import { PlusIcon, ArchiveIcon, TrashIcon, CaretSortIcon } from '@radix-icons/vue'
import { useOffersStore } from '@/stores/offers';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import OfferForm from './OfferForm.vue';
import { Checkbox } from './ui/checkbox';
import { computed, h, watch } from 'vue';
import DropDown from './DropDown.vue'
import { cn } from '@/lib/utils';
import { useArchiveStore } from '@/stores/archive';
import { useNoteStore } from '@/stores/note';

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
        class: cn('capitalize text-base', row.original.offerLink && 'font-bold hover:underline decoration-rose-500'),
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
        class: 'data-[state=checked]:bg-green-600 data-[state=checked]:border-transparent',
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
        class: 'data-[state=checked]:bg-green-600 data-[state=checked]:border-transparent',
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

const table = useVueTable({
    get data() { if (archiveStore.archives) { return archivedOffers.value } else { return nonArchivedOffers.value } },
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'arrIncludes',
})

const getAllSelectedOffers = () => table.getSelectedRowModel().rows.filter(row => row.getIsSelected()).map(row => row.original)

const deleteSelectedOffers = () => { offersStore.deleteOffers(...getAllSelectedOffers()), table.resetRowSelection() }

const setArchivedSelectedOffers = () => { offersStore.setOffersArchived(!archiveStore.archives, ...getAllSelectedOffers()), table.resetRowSelection() }

watch(() => archiveStore.archives, () => table.resetRowSelection())

watch(() => table.getRowCount(), () => { if (!table.getRowCount()) return table.resetRowSelection() })
</script>

<template>
    <CardContent>
        <Card class="p-2 my-3">
            <CardHeader class="px-0">
                <CardTitle>Candidatures</CardTitle>
                <CardDescription>Gérer vos candidatures à des offres d'emploi</CardDescription>
            </CardHeader>
            <div class="flex justify-between">
                <div class="flex flex-row space-x-3">
                    <Input class="mb-4 w-[24vh]" placeholder="Chercher une entreprise..."
                        @update:model-value="value => table.setGlobalFilter(value)" />
                    <Tabs default-value="current">
                        <TabsList>
                            <TabsTrigger :onclick="archiveStore.setFalse" value="current">En cours</TabsTrigger>
                            <TabsTrigger :onclick="archiveStore.setTrue" value="archived">Archives</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button class="w-32" :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                        :variant="table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? 'default' : 'ghost'"
                        :onclick="setArchivedSelectedOffers">
                        <ArchiveIcon class="mr-2" /> {{ archiveStore.archives ? 'Désarchiver' : 'Archiver' }}
                    </Button>
                    <Button :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                        :class="cn((table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && 'focus-visible:bg-red-300 hover:bg-red-300 bg-red-500 text-white')"
                        variant="ghost" :onclick="deleteSelectedOffers">
                        <TrashIcon class="mr-2" /> Supprimer
                    </Button>
                </div>
                <OfferForm>
                    <Button>
                        <PlusIcon class="mr-2" /> Ajouter
                    </Button>
                </OfferForm>
            </div>
        </Card>

        <Card class="h-full">
            <CardContent class="p-0 h-full w-[125vh] h-full m-h-[10vh]">
                <Table class="h-full">
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
                            <TableCell>
                                <span class="text-transparent select-none">____</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </CardContent>

</template>