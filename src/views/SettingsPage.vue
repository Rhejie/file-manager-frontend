<template>
    <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white mt-4 shadow overflow-hidden h-screen">
                <div class="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                    <aside class="py-6 lg:col-span-3">
                        <nav class="space-y-1">
                            <a v-for="item in subNavigation" :key="item.name" :href="item.href"
                                :class="[item.current ? 'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700' : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900', 'group border-l-4 px-3 py-2 flex items-center text-sm font-medium']"
                                :aria-current="item.current ? 'page' : undefined">
                                <component :is="item.icon"
                                    :class="[item.current ? 'text-teal-500 group-hover:text-teal-500' : 'text-gray-400 group-hover:text-gray-500', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                                    aria-hidden="true" />
                                <span class="truncate">
                                    {{ item.name }}
                                </span>
                            </a>
                        </nav>
                    </aside>
                    <div class="divide-y divide-gray-200 lg:col-span-9  overflow-y-auto h-screen">
                        <router-view></router-view>
                    </div>
                    <!--  -->
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import { setActiveNavBar } from "@/composables/SetActiveNav";
import {
    TemplateIcon,
    BellIcon,
    CogIcon,
    CreditCardIcon,
    KeyIcon,
    ViewGridAddIcon,
} from "@heroicons/vue/outline";
// import { TemplateIcon } from "@heroicons/vue/outline";
import { defineComponent, onMounted } from "vue";
// import MainSettings from "@/components/settings/MainSettings.vue";

export default defineComponent({
    name: "SettingsPage",
    components: {
        // MainSettings
    },
    setup() {

        const subNavigation = [
            { name: 'Appearance', href: '#', icon: TemplateIcon, current: true },
            { name: 'Account', href: '#', icon: CogIcon, current: false },
            { name: 'Password', href: '#', icon: KeyIcon, current: false },
            { name: 'Notifications', href: '#', icon: BellIcon, current: false },
            { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
            { name: 'Integrations', href: '#', icon: ViewGridAddIcon, current: false },
        ]

        onMounted(() => {

            setActiveNavBar('Settings');
        })

        return {
            subNavigation
        }
    }
})
</script>
