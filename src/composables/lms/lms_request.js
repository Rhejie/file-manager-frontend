import { accessToken } from "../local_storage";

export const searchUnits = (user_central_id, search) => {
    return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            let url = new URL(process.env.VUE_APP_LMS_URL+'/v3/file-manager/search');
            url.searchParams.set('central_id', user_central_id)
            url.searchParams.set('keyword', search)
            url.searchParams.set('tokenFM', accessToken())

            request.open('GET', url);

            request.responseType = 'json';

            request.send();

            request.onload = function () {

                if(request.status != 200) {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    })
                }

                resolve(request.response)
            }


            request.onerror = function() { 
                alert(`Request failed`);
            };
        })
}