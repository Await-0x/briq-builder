<template>
    <div>
        <h2 class="visible text-center text-[5rem] opacity-50 pointer-events-none">SCREENSHOTTING</h2>
        <teleport to="#inputComp">
            <div class="flex flex-col my-4 gap-2">
                <Btn @click="$emit('close')">Cancel</Btn>
                <Btn @click="returnScreen">Take Screenshot</Btn>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
import { takeScreenshot } from '../../../builder/graphics/builder.js';
import { inputStore } from '../../../builder/inputs/InputStore';
import { setOnlyShowLast } from '../../Modals.vue';

import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            oldInput: "",
            screenshot: "",
            screenshotPromise: undefined as Promise<string> | undefined,
        };
    },
    mounted() {
        this.oldInput = inputStore.currentInput;
        inputStore.currentInput = "camera";
        inputStore.forceInput = true;
        // Hide the modal itself (the teleported stuff isn't affected)
        this.$emit('hide');
        setOnlyShowLast(true);
    },
    unmounted() {
        inputStore.currentInput = this.oldInput;
        inputStore.forceInput = false;
        setOnlyShowLast(false);
    },
    props: ["metadata"],
    emits: ["close", "hide", "show"],

    methods: {
        takeScreen()
        {
            let uri = takeScreenshot();
            let img = new Image();
            img.src = uri;
            this.screenshotPromise = new Promise((resolve: (data: string) => void) => {
                img.decode().then(() => {
                    this.screenshot = img.src;
                    resolve(this.screenshot);
                });
            })
        },
        async returnScreen() {
            this.takeScreen();
            this.$emit('close', await this.screenshotPromise!);
        }
    }
})
</script>