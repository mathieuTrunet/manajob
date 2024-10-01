<script setup lang="ts">
import MainTable from './components/MainTable.vue';
import NoteZone from './components/NoteZone.vue';
import UpperBar from './components/UpperBar.vue';
</script>

<template>
    <div id="background" class="h-full">
        <UpperBar />
        <div class="flex flex-row">
            <MainTable class="pl-5" />
            <div class="w-full mr-5">
                <NoteZone />
            </div>
        </div>
    </div>
</template>

<style scoped>
#background {
    background-image: url('./assets/grid.svg');
}
</style>