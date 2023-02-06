import { ref } from "vue"
import { http, httpFile } from "./http_service"

export const fetchWithPaginate = (params, url) => {
    const data = ref([])
    const totalData = ref(0)
    const nextPage = ref('');
    const previousPage = ref('')
    const from = ref(0)
    const last_page = ref(0)
    const load = async () => {
        await http().get(`${url}?search=${params.search}&page=${params.page}&size=${params.pageSize}`).then(res => {
            data.value = res.data
            if(res.data.folders){
                totalData.value = res.data.folders.total
                nextPage.value = res.data.folders.next_page_url;
                previousPage.value = res.data.folders.previous_page_url;
                from.value = res.data.folders.from
                last_page.value = res.data.folders.last_page
            }
            else {
                totalData.value = res.data.total
                nextPage.value = res.data.next_page_url;
                previousPage.value = res.data.previous_page_url;
                from.value = res.data.from
                last_page.value = res.data.last_page
            }
        })
    }

    return {
        data,
        totalData,
        load,
        nextPage,
        previousPage,
        from,
        last_page

    }
}

export const fetch = (url, search) => {
    const data = ref([])
    const load = async () => {
        await http().get(`${url}?search=${search}`).then(res => {
            data.value = res.data
        });
    }

    return {
        data,
        load
    }
}

export const fetchById = (url, id) => {
    const data = ref({})
    const load = async () => {
        await http().get(`${url}/${id}`).then(res => {
            data.value = res.data
        }).catch(error => {
            console.log('Error in getting data by id --->', error)
        });
    }

    return {
        data,
        load
    }
}

export const store = (url, form) => {
    const data = ref({})
    const errorValue = ref()
    const errorStatus = ref(null)
    const post = async () => {
        await http().post(url, form).then(res => {
            data.value = res.data
        }).catch(error => {
            console.log("error in storing data -->", error)
            errorValue.value = error.response.data
            errorStatus.value = error.response.status
        })
    }

    return {
        post,
        data,
        errorValue,
        errorStatus
    }
}

export const update = (url, form, id) => {
    const data = ref({});
    const errorValue = ref()
    const post = async () => {
        await http().post(`${url}/${id}`, form).then(res => {
            data.value = res.data
        }).catch(error => {
            console.log("error in updating data -->", error)
            errorValue.value = error.response.data
        })
    }

    return {
        post,
        errorValue,
        data,
    }
}


export const destroy = async (url, id) => {
    await http().post(`${url}/${id}`).then(res => {
        console.log(res.data)
        return res
    }).catch(error => {
        console.log("error in deleting data -->", error)
    })
}

export const query = (url) => {
    const data = ref();
    const load = async () => {
            await http().get(url).then(res => {
            data.value = res.data
        });

    } 
    return {
        data,
        load
    }
}

export const download = (url, id) => {
    return httpFile().get(`${url}/${id}`);
}
