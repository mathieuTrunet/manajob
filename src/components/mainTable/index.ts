import { createColumnHelper } from '@tanstack/vue-table'
import { Checkbox } from '../ui/checkbox'
import { h } from 'vue'
import DropDown from './DropDown.vue'
import { CaretSortIcon } from '@radix-icons/vue'
import { Button } from '../ui/button'

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
      checked: row.getValue<boolean>('applied'),
      'onUpdate:checked': value => console.log(row.id),
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
      checked: row.getValue<boolean>('answerReceived'),
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
  cell: ({ row }) => row.getValue('offerDate') || '-',
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
  cell: ({ row }) => row.getValue('applyDate') || '-',
  enableSorting: true,
  enableGlobalFilter: true,
  enableColumnFilter: true,
})

const experienceRequiredColumn = columnHelper.accessor('experienceRequired', {
  header: `Expérience requise`,
  cell: ({ row }) =>
    row.getValue<Experience>('experienceRequired') ? `${row.getValue('experienceRequired')} ans` : '-',
  enableGlobalFilter: true,
  enableColumnFilter: true,
})

const actionsColumn = columnHelper.display({
  id: 'actions',
  enableHiding: false,
  cell: () => h(DropDown),
})

export const columns = [
  selectColumn,
  companyNameColumn,
  appliedColumn,
  answerReceivedColumn,
  offerDateColumn,
  applyDateColumn,
  experienceRequiredColumn,
  actionsColumn,
]
