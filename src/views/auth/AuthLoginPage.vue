<template>
    <div class="flex min-h-full h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-12 w-auto" src="https://revdojo.com/wp-content/uploads/2022/04/logo.png" alt="RevDojo" />
            
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="rounded-md bg-red-50 p-4 mb-2 " v-if="errorMessage">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">{{errorMessage}}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form class="space-y-6" >
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1">
                            <InputEmailForm 
                                :placeholder="'Enter email address'"
                                v-model="loginForm.email" 
                                :error=" error.email && error.email.length > 0 ? error.email[0] : ''"/>
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1">
                            <InputPasswordForm
                                v-model="loginForm.password"
                                :placeholder="'Enter password'"
                                :error="error.password && error.password.length > 0 ? error.password[0] : ''"/>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>
<!-- 
                        <div class="text-sm">
                            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your
                                password?</a>
                        </div> -->
                    </div>

                    <div>
                        <ButtonSubmitForm @handleClickSubmit="handleClickLogin" :title="'Sign In'"/>
                        <!-- <router-link :to="{name: 'SSO login'}"></router-link> -->
                    </div>
                </form>

                <div class="mt-6">
                    <!-- <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300" />
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div> -->

                    <!-- <div class="mt-6 grid grid-cols-3 gap-3">
                        <div>
                            <a href="#"
                                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
                                <span class="sr-only">Sign in with Central</span>
                                <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, inject, onMounted, ref } from "vue";
import InputEmailForm from "@/components/ui/InputEmailForm.vue"
import InputPasswordForm from "@/components/ui/InputPasswordForm.vue"
import ButtonSubmitForm from "@/components/ui/ButtonSubmitForm.vue"
import { store } from "@/composables/resource_service";
import { ExclamationCircleIcon } from '@heroicons/vue/solid'
import { useRouter } from "vue-router";
import { setTitle } from "@/composables/title_service";
export default defineComponent({
    name: "AuthLoginPage",
    components: {
        InputEmailForm,
        InputPasswordForm,
        ExclamationCircleIcon,
        ButtonSubmitForm
    },  
    setup() {

        const auth = inject('auth');
        const router = useRouter();
        
        const loginForm = ref({
            email: '',
            password: ''
        })

        const error = ref({
            email: [],
            password: []
        })

        const errorMessage = ref('')

        const handleClickLogin = async () => {
            
            const {data, post, errorValue, errorStatus} = store('/auth/user/login', loginForm.value);
            await post();
            console.log(errorStatus.value)
            if(errorValue.value && errorStatus.value == 422) {
                error.value = errorValue.value.errors
                errorMessage.value = ''
                return ;
            }
            else if (errorValue.value && errorStatus.value == 401) 
            {
                error.value.email = []
                error.value.password = []
                errorMessage.value = errorValue.value.message
                return;
            }
            else if(errorStatus.value == 500){
                error.value.email = []
                error.value.password = []
                errorMessage.value = 'Some Error Occured, Please contact the administrator.'
                return
            }


            auth.user(data.value.user)
            auth.token(null, data.value.token)
            auth.remember(JSON.stringify(auth.user()));
            router.push({ name: 'All Files'})
        }   

        const handleClickSSO = () => {
            router.push({ name: 'SSO login'})
        }

        onMounted(() => {

            setTitle('Login')

            
        })

        return {
            loginForm,
            handleClickLogin,
            error,
            errorMessage,
            handleClickSSO
        }
    }
})
</script>