<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

const mode = useColorMode()

</script>

<template>
    <nav class="inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-neutral-950 border-b">
        <div class="flex h-16 items-center justify-between mx-4">
            <div class="flex items-center ">
                <img src="/src/assets/logo.svg" width="44" height="44" class="mr-2">
                <p class="text-3xl mr-0.5 font-medium">Mana<span class="text-rose-500 font-semibold">Job</span></p>
            </div>
            <div>
                <Button @click="mode = mode === 'dark' ? 'light' : 'dark'" variant="ghost" class="px-2">
                    <Icon icon="radix-icons:moon"
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Icon icon="radix-icons:sun"
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </div>
        </div>
    </nav>
</template>
