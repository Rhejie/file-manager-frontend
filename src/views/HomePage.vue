<template>
  <main>
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <!-- Replace with your content -->
      <div class="px-4 py-8 sm:px-0">
        <h1>Welcome,</h1>
        {{ user.name }}
        <br>
        <br>
        <button @click="logout">logout here</button>
      </div>
      <!-- /End replace -->
    </div>
  </main>
</template>
<script>
import { setActiveNavBar } from "@/composables/SetActiveNav";
import { defineComponent, inject, onMounted } from "vue";

export default defineComponent({
  name: "HomePage",
  computed: {
    user() {
      return JSON.parse(this.$auth.remember())
    }
  },
  setup() {
    const auth = inject('auth');
    const http = inject('http');

    const logout = () => {
      const accessToken = `Bearer ${auth.token()}`;
      http.defaults.headers.common['Authorization'] = accessToken;
      http
        .post('/central/user/logout')
        .then(({ data }) => {
          auth.logout()
          window.location.href = data;
          localStorage.removeItem('file_manager_access_token')
        });
    }

    onMounted(() => {
      setActiveNavBar('Home');
      if (auth.token()) {
        localStorage.setItem('file_manager_access_token', auth.token());
      }
    })

    return {
      logout
    }
  },
  // methods: {
  //   logout() {
  //     const accessToken = `Bearer ${this.$auth.token()}`;
  //     this.$http.defaults.headers.common['Authorization'] = accessToken;
  //     this.$http
  //       .post('/central/user/logout')
  //       .then(({ data }) => {
  //         this.$auth.logout()
  //         window.location.href = data;
  //         localStorage.removeItem('file_manager_access_token')
  //       });
  //   }
  // }
})
</script>
