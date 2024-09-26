<script lang="ts" setup>
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import { DotsHorizontalIcon, Pencil1Icon, ArchiveIcon, TrashIcon, UpdateIcon } from '@radix-icons/vue';
import { Button } from '../ui/button';
</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="ghost" class="px-3">
                <DotsHorizontalIcon />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem class="space-x-2">
                    <Pencil1Icon />
                    <span>Notes</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="space-x-2">
                    <UpdateIcon /><span>Modifier</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="space-x-2">
                    <ArchiveIcon /><span>Archiver</span>
                </DropdownMenuItem>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="space-x-2 bg-red-500 focus:bg-red-300 text-white">
                <TrashIcon /><span>Supprimer</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
