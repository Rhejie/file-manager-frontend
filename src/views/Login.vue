<template>
    <div
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden flex flex-col items-center justify-center">
        <img class="mx-auto h-12 w-auto animate-bounce" src="https://revdojo.com/wp-content/uploads/2022/04/logo.png"
            alt="RevDojo" />
        <h2 class="text-center text-sm font-semibold">Loading.. Please wait..</h2>
    </div>
</template>
<script>
import { defineComponent, inject, onMounted,} from "vue";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";

export default defineComponent({
    name: "LoginPage",
    setup() {
        const auth = inject('auth');
        const http = inject('http');
        const route = useRoute();
        const { cookies } = useCookies();

        const getSamlLogin = (clientid) => {
            http
                .post('/sso-post-login', { clientid })
                .then(({ data }) => {
                    cookies.set('default_auth_token', data.token)
                    cookies.set('default_auth_user', data.user.id)
                    cookies.set('current_central_token',data.current_central_token)
                    auth.user(data.user)
                    auth.token(null, data.token)
                    auth.remember(JSON.stringify(auth.user()));
                    window.location.href = '/';
                })
                .catch((error) => {
                    console.log(error)
                }); 
        }

        const getSamlLink = () => {
            http.get('/sso-login').then((response) => {
                window.location.href = response.data;
            }).catch(error => {
                console.log(error)
            })
        }

        onMounted(() => {
            const clientid = route.query.clientid
            if (clientid !== undefined) {
                getSamlLogin(clientid)
            }
            else {
                getSamlLink()
            }
        })
    }
})
</script>