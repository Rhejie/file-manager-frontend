<template>
  <KeepAlive>
  <router-view class="bg-gray-100"></router-view>
  </KeepAlive>
</template>

<script>
import Vue from 'vue';
import { defineComponent, onMounted } from 'vue'
import Echo from 'laravel-echo';
import { useCookies } from "vue3-cookies";

window.Pusher = require('pusher-js');

export default defineComponent({
  name: 'App',
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  created() {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: '69c8a20e6d9b8ff604f5',
      cluster: 'us2',
      forceTLS: true,
      authEndpoint: '/broadcasting/auth',
      encrypted: true,
      auth: {
        headers: {
          Authorization: `Bearer ${this.$auth.token()}`,
        },
      },
    });
  },
  mounted() {
    const accessToken = `Bearer ${this.$auth.token()}`;
    localStorage.removeItem('file_manager_access_token');
    this.$http.defaults.headers.common['Authorization'] = accessToken;

    this.init();
  },
  methods: {
    init() {
      this.centralLogoutListener()

      this.centralRefresh()
      setInterval(() => {
        if (this.$auth.check()) {
          this.centralRefresh()
        }
      },  60000 * 30);

    }, 
    centralLogoutListener() {
      let centralToken = this.cookies.get('current_central_token');
      window.Echo
      .channel(`central-logout`)
      .listen('CentralLogout', (e) => {
        if (centralToken == e.central_token) {
          this.logout()
        }
      });
    },  
    centralRefresh() {
        this.$http.post('/central/refresh', {
          central_token: this.cookies.get('current_central_token'),
        })
        .then(({ data }) => {
          if (!data) {
            this.logout()
          }
        });
    },
    logout() {
      let user = JSON.parse(this.$auth.remember())

      this.$http
      .post(`/central/user/logout/${user.central_id}`)
      .then(({ data }) => {
        this.$auth.logout()
        this.cookies.keys().forEach(cookie => this.cookies.remove(cookie))

        window.location.href = data;
      });
    }
  }
})

</script>