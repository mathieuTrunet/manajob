<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { createColumnHelper, FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { Button } from './ui/button';
import { PlusIcon, ArchiveIcon, TrashIcon, CaretSortIcon } from '@radix-icons/vue'
import { useOffersStore } from '@/stores/offers';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import OfferForm from './OfferForm.vue';
import { Checkbox } from './ui/checkbox';
import { h } from 'vue';
import DropDown from './DropDown.vue'

const store = useOffersStore()

const columnHelper = createColumnHelper<Offer>()

const selectColumn = columnHelper.display({
    id: 'select',
    header: ({ table }) =>
        h(Checkbox, {
            checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            ariaLabel: 'Select all',
        }),
    cell: ({ row }) =>
        h(Checkbox, {
            checked: row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            ariaLabel: 'Select row',
        }),
    enableSorting: false,
    enableHiding: false,
})

const parseDate = (date: string) => date.split('-').reverse().join('/')

const companyNameColumn = columnHelper.accessor('companyName', {
    header: ({ column }) =>
        h(
            Button,
            {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            },
            () => ['Entreprise', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
        ),
    cell: ({ row }) =>
        row.original.offerLink
            ? h(
                'a',
                {
                    href: `${row.original.offerLink}`,
                    target: '_blank',
                    class: 'font-bold capitalize text-base hover:underline decoration-rose-500',
                },
                row.getValue('companyName')
            )
            : h('a', { class: 'font-bold capitalize text-base' }, row.getValue('companyName')),
    enableSorting: true,
    enableGlobalFilter: true,
})

const appliedColumn = columnHelper.display({
    id: 'applied',
    header: `Candidature envoyée`,
    cell: ({ row }) =>
        h(Checkbox, {
            defaultChecked: row.original.applied,
            //'onUpdate:checked': status => { store.toggleAppliedByName(row.original.companyName, status), console.log(store.offers) },
            class: 'data-[state=checked]:bg-green-600 data-[state=checked]:border-transparent',
        }),
    enableSorting: false,
    enableHiding: false,
})

const answerReceivedColumn = columnHelper.display({
    id: 'answerReceived',
    header: `Réponse obtenue`,
    cell: ({ row }) =>
        h(Checkbox, {
            defaultChecked: row.original.answerReceived,
            class: 'data-[state=checked]:bg-green-600 data-[state=checked]:border-transparent',
        }),
    enableSorting: false,
    enableHiding: false,
})

const offerDateColumn = columnHelper.accessor('offerDate', {
    header: ({ column }) =>
        h(
            Button,
            {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            },
            () => [`Date de l'annonce`, h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
        ),
    cell: ({ row }) => row.original.applyDate ? parseDate(row.original.applyDate) : '-',
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const applyDateColumn = columnHelper.accessor('applyDate', {
    header: ({ column }) =>
        h(
            Button,
            {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            },
            () => ['Date de candidature', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })]
        ),
    cell: ({ row }) => row.original.applyDate ? parseDate(row.original.applyDate) : '-',
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const experienceRequiredColumn = columnHelper.accessor('experienceRequired', {
    header: `Expérience requise`,
    cell: ({ row }) => (row.getValue('experienceRequired') ? `${row.getValue('experienceRequired')} ans` : '-'),
    enableGlobalFilter: true,
    enableColumnFilter: true,
})

const actionsColumn = columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: () => h(DropDown),
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


const table = useVueTable({
    get data() { return store.offers },
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'arrIncludes',
})

const y = () => store.addOffers({ companyName: 'fsd', applied: true, classified: false, answerReceived: true, experienceRequired: 4, applyDate: '24/10/2024' })

const u = () => store.addOffers({ companyName: 'gfdd', applied: false, classified: false, answerReceived: false, experienceRequired: 3, applyDate: '20214-05-24' })

</script>

<template>
    <div class="flex justify-between">
        <div class="flex flex-row space-x-3">
            <Input class="mb-4 w-[24vh]" placeholder="Chercher une entreprise..."
                @update:model-value="value => table.setGlobalFilter(value)" />
            <Tabs>
                <TabsList>
                    <TabsTrigger value="current">
                        En cours
                    </TabsTrigger>
                    <TabsTrigger value="archived">
                        Archives
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <Button :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                :variant="table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? 'default' : 'ghost'"
                :onclick="y">
                <ArchiveIcon class="mr-2" /> Archiver
            </Button>
            <Button :disabled="!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())"
                :class="(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && 'focus-visible:bg-red-300 hover:bg-red-300 bg-red-500'"
                variant="ghost" :onclick="u">
                <TrashIcon class="mr-2" /> Supprimer
            </Button>
        </div>
        <OfferForm>
            <Button>
                <PlusIcon class="mr-2" /> Ajouter
            </Button>
        </OfferForm>
    </div>

    <Card class="h-full">
        <CardContent class="p-0 h-full">
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
                            <TableRow :data-state="row.getIsSelected() && 'selected'" class="text-center">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>
                    <TableRow v-else>
                        <TableCell :colspan="table.getAllColumns().length" class=" text-center">
                            <span class="font-medium">Pas de candidature</span>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>