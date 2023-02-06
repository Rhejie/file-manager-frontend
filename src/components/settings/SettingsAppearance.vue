<template>
    <div>
        <div class="sm:overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6">
                <div>
                    <h2 id="payment-details-heading" class="text-lg leading-6 font-medium text-gray-900">Appearance
                    </h2>
                    <p class="mt-1 text-sm text-gray-500">Create your own theme</p>
                </div>

                <div class="mt-6 grid grid-cols-4 gap-6">
                    <div class="col-span-4 sm:col-span-2">
                        <label for="first-name" class="block text-sm font-medium text-gray-700">Folder Color</label>
                        <div class="">
                            <el-color-picker v-model="color1" class="mr-10" />
                            <input type="text" v-model="color1" readonly
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>
                    </div>

                    <div class="col-span-4 sm:col-span-2">
                        <FolderIcon class="w-32 " :style="{ color: color1 }" />
                    </div>

                    <div class="col-span-4 sm:col-span-2">
                        <label for="email-address" class="block text-md font-medium text-gray-700">Sidebar</label>
                        <label for="email-address" class="block text-sm text-gray-700">Background
                            Color</label>
                        <div class="">
                            <el-color-picker v-model="side_color" class="mr-10" />
                            <input type="text" v-model="side_color" readonly
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>
                        <label for="email-address" class="block text-sm text-gray-700">Font
                            Color</label>
                        <div class="">
                            <el-color-picker v-model="font_color" class="mr-10 w-full" />
                            <input type="text" v-model="font_color" readonly
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>
                    </div>

                    <div class="col-span-4 p-2 sm:col-span-2">
                        <div class="w-full h-full p-4" :style="`background-color: ${side_color}; color: ${font_color}`">
                            <ul class="w-full leading-loose">
                                <li class="flex">
                                    <ViewGridIconOutline class="w-5 mr-2" />All Files
                                </li>
                                <li class="flex">
                                    <UserGroupIcon class="w-5 mr-2" />Assign with me
                                </li>
                                <li class="flex">
                                    <ClockIcon class="w-5 mr-2" />Recent
                                </li>
                                <li class="flex">
                                    <HeartIcon class="w-5 mr-2" />Favorite
                                </li>
                                <li class="flex">
                                    <TrashIcon class="w-5 mr-2" />Trash
                                </li>
                                <li class="flex">
                                    <CogIcon class="w-5 mr-2" /> Settings
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button type="submit"
                    class="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">Save</button>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { FolderIcon } from '@heroicons/vue/solid'

import {
    CogIcon,
    // HomeIcon,
    UserGroupIcon,
    TrashIcon,
    ClockIcon,
    HeartIcon,
    ViewGridIcon as ViewGridIconOutline,
} from '@heroicons/vue/outline'
export default defineComponent({
    name: "SettingsAppearance",
    components: {
        FolderIcon,
        CogIcon,
        UserGroupIcon,
        TrashIcon,
        ClockIcon,
        HeartIcon,
        ViewGridIconOutline
    },
    setup() {
        const color1 = ref('#4D6278')
        const font_color = ref('#FFFFFF')
        const side_color = ref('#4D6278')
        return {
            color1,
            font_color,
            side_color
        }
    }
})
</script>