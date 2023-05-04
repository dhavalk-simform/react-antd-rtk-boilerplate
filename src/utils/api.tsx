import axios from 'axios'

/*
Best practice to store access-token and refresh-token is
cookie not a local storage. 

Here I've created request interceptors to intercept
request and add token into request header from cookie.
You can update this logic as well create response interceptors based on project requiriments.

I've added custom config called withoutAuth in axios instance
withoutAuth config value will decide whether send a token in request or not.
if API need token in header in that case yu don't have to pass withoutAuth config
and it will work as expected.
EX: 
axiosInstance.get('/users')
axiosInstance.post('/posts', { title: 'foo', body: 'bar', userId: 1 })

When you don't need token in header at that time you've to pass withoutAuth true.
EX: 
axiosInstance.get('/users', { withoutAuth: true})
axiosInstance.post('/posts', { title: 'foo', body: 'bar', userId: 1 }, { withoutAuth: true })
*/

declare module 'axios' {
  export interface AxiosRequestConfig {
    withoutAuth?: boolean
  }
}

const baseURL =
  import.meta.env.VITE_API_URL || 'http://jsonplaceholder.typicode.com'

const axiosInstance = axios.create({
  baseURL,
  withoutAuth: false,
  headers: {
    'Content-Type': 'application/json'
  }
  /*
  you can pass common config here.
  */
})

axiosInstance.interceptors.request.use(
  (config) => {
    /*

    Here you can pass more logic as per requirement.
    EX: you can check if access-token is about to expiry 
    then use refresh-token to get new access-token and
    refresh-token and story in cookie then send actual
    resource request.
    
    */

    if (!config.withoutAuth) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = document!.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1]

      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/*
Here we're exporting whole axiosInstance that 
you can use lke this axiosInstance.get(),
axiosInstance.post(), etc.

if you want you can do like this as well

export {get:GET, post: POST, put: PUT, patch: PATCH, delete:DELETE} = axiosInstance
then you can use it like this GET(), POST(), etc.
*/

export default axiosInstance
