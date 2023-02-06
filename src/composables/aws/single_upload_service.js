import axios from 'axios';
import { s3 } from './aws'

export const singleUpload = (file, folder) => {

    const key = folder  + Date.now() + '-' + file.name.replace(/\s/g, '-')
    const params = {
        Bucket: 'lms-file-manager',
        Key: key,
        Expires: 10,
        ContentType: file.type,
    }
    console.log('type', file.type)
    console.log('key', key)
    console.log('/folder', folder)

    // const url = s3.getSignedUrl('putObject', params).replace('%2F', '/')
    const url = s3.getSignedUrl('putObject', params)

    console.log('url', url)

    return axios
      .put(url, file, {
        headers: {
          'Content-Type': file.type,
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then(result => {
        const bucketUrl = decodeURIComponent(result.request.responseURL).split(
          key
        )[0]
        result.key = key
        result.fullPath = bucketUrl + key
        console.log('result: ' + JSON.stringify(result))
        return result
      })
      .catch(err => {
        // TODO: error handling
        console.log(err)
      })
}