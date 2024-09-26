<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { columns } from './index'
import { Button } from '../ui/button';
import { PlusIcon, ArchiveIcon, TrashIcon } from '@radix-icons/vue'
import { useOffersStore } from '@/stores/offers';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import OfferForm from '../offerForm/OfferForm.vue';

const store = useOffersStore()

const table = useVueTable({
    get data() { return store.offers },
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'arrIncludes',
})

const y = () => store.addOffers({ companyName: 'fsd', applied: true, classified: false, answerReceived: true, experienceRequired: 4, applyDate: '24/10/2024' })

const u = () => store.addOffers({ companyName: 'truc', experienceRequired: 2, applied: true, classified: false, answerReceived: true })

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