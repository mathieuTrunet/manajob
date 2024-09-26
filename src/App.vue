<script setup lang="ts">
import MainTable from './components/mainTable/MainTable.vue';
import { CardContent, CardTitle, CardDescription, CardHeader } from './components/ui/card';
import UpperBar from './components/UpperBar.vue';
</script>

<template>
    <div>
        <UpperBar />
        <div class="flex">
            <CardContent>
                <CardHeader class="px-0">
                    <CardTitle>Candidatures</CardTitle>
                    <CardDescription>Gérer vos candidatures en cours</CardDescription>
                </CardHeader>
                <MainTable />
            </CardContent>
        </div>
    </div>
</template>