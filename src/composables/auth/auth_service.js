import { http } from "../http_service"
// import { accessToken, setToken } from "../local_storage";
import store from '../../store/index';
import { ref } from "vue";
import { accessToken, setToken } from "../local_storage";


export const checkUser = (token) => {

    const status = ref(null)
    let tokenData = token

    if (token) {
        localStorage.setItem('central_token', token)
    }
    else {
        tokenData = localStorage.getItem('central_token')
    }

    const load = async () => {
        await http()
            .get(`auth/central/central-profile?token=${tokenData}&
                a=${process.env.VUE_APP_SECRET_KEY}`)
            .then(res => {
                if (res.data.status) {
                    store.commit('setCentralProfile', res.data.profile)
                    store.commit('setCentralToken', token)
                    console.log(res.data)
                    if (accessToken() != res.data.file_manager_token) {
                        setToken(res.data.file_manager_token)
                    }
                    status.value = res.data.status
                    window.location.href = process.env.VUE_APP_URL;
                }
                else {
                    status.value = res.data.status
                    window.location.href = process.env.VUE_APP_CENTAL_STAGING_URL;
                }


            }).catch(error => {
                localStorage.removeItem('file_manager_access_token')
                console.log('Error in login Central --->', error)
                window.location.href = process.env.VUE_APP_CENTAL_STAGING_URL;
            })
    }

    return {
        load,
        status
    }
}

export const loginUser = (profile) => {
    console.log(profile, 'profile')
    const login = async () => {
        await http().post('auth/user/login', {
            email: profile.email,
            // central_id: profile.central.central_id
        }).then(res => {
            if (accessToken() != res.data) {
                setToken(res.data)
            }
        }).catch(error => {
            console.log('Error in login in file manager --> ', error);
            window.location.href = process.env.VUE_APP_CENTAL_STAGING_URL;
        })
    }

    return {
        login
    }

}

export const checkIsLoggedInUserProfile = () => {
    const userProfile = ref({});

    const profile = async () => {
        await http().get(`auth/user-data/profile?token=${localStorage.getItem('central_token')}`).then(res => {
            userProfile.value = res.data

        }).catch(error => {
            console.log('Error in getting file Manager profile -->', error);
            window.location.href = process.env.VUE_APP_CENTAL_STAGING_URL;
        })
    }

    return {
        profile
    }

}