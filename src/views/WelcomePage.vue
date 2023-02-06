<template>
    <div class="h-full flex">
        <!-- Narrow sidebar -->
        <SidebarComponent />

        <!-- Content area -->
        <div class="flex-1 flex flex-col overflow-hidden">

            <HeaderComponent />

            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";
import SidebarComponent from "@/components/layout/SidebarLayout.vue"
import HeaderComponent from "@/components/layout/HeaderLayout.vue"
export default defineComponent({
    name: "WelcomePage",
    components: {
        SidebarComponent,
        HeaderComponent
    }
})
</script>