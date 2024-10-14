<script setup lang="ts">
import Completion from './components/Completion.vue';
import MainTable from './components/MainTable.vue';
import NoteZone from './components/NoteZone.vue';
import UpperBar from './components/UpperBar.vue';
</script>

<template>
    <UpperBar class="mb-6" />
    <div class="mx-8 space-y-4 lg:space-y-4 gap-x-4 lg:grid grid-cols-2 grid-rows-2">
        <MainTable class="col-span-2 row-span-3" />
        <NoteZone />
        <Completion />
    </div>
</template>