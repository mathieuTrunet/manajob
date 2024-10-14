<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { GithubLogoIcon, MoonIcon, SunIcon, UploadIcon } from '@radix-icons/vue';
import DataDialog from './DataDialog.vue'

const mode = useColorMode({ initialValue: 'light' })

const GITHUB_URL = 'https://github.com/mathieuTrunet/manajob'

</script>

<template>
    <nav class="inset-x-0 top-0 z-50 bg-background shadow-sm border-b">
        <div class="flex h-14 items-center justify-between mx-4">
            <div class="flex items-center ">
                <img src="/src/assets/icon.svg" width="44" height="44" class="mr-2">
                <p class="text-3xl mr-0.5 font-medium">Mana<span class="text-primary font-semibold">Job</span></p>
            </div>
            <div class="space-x-1">
                <Button @click="mode = mode === 'dark' ? 'light' : 'dark'" variant="ghost" class="px-2">
                    <MoonIcon
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <SunIcon
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span class="sr-only">Toggle theme</span>
                </Button>
                <DataDialog>
                    <Button name="parametres" variant="ghost" class="px-2">
                        <UploadIcon class="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </DataDialog>
                <Button name="mon GitHub" variant="ghost" class="px-2">
                    <a :href="GITHUB_URL" target="_blank">
                        <GithubLogoIcon class="h-[1.2rem] w-[1.2rem]" />
                    </a>
                </Button>

            </div>
        </div>
    </nav>
</template>
