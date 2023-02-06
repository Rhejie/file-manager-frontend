import axios from 'axios'
import { http } from './http_service'

export const store = async (file, options = {}) => {
  var instance = axios.create();
  delete instance.defaults.headers.common["Authorization"];

  const response = await http().post(
    options.signedStorageUrl
      ? options.signedStorageUrl
      : "/vapor/signed-storage-url",
    {
      bucket: options.bucket || "",
      content_type: options.contentType || file.type,
      expires: options.expires || "",
      visibility: options.visibility || "",
      ...options.data,
    },
    {
      baseURL: options.baseURL || null,
      headers: options.headers || {},
      ...options.options,
    }
  );

  let headers = response.data.headers;


  if ("Host" in headers) {
    delete headers.Host;
    delete headers.Authorization;
  }

  if (typeof options.progress === "undefined") {
    options.progress = () => {};
  }

  const cancelToken = options.cancelToken || "";

   await instance.put(response.data.url, file, {
    cancelToken: cancelToken,
    headers: headers,
    onUploadProgress: (progressEvent) => {
      options.progress(progressEvent.loaded / progressEvent.total);
    },
  });

  response.data.extension = file.name.split(".").pop();

  return response.data;
};