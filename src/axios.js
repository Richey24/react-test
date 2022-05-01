import axios from 'axios'

const instance = axios.create({
    baseURL: "https://localhost:4000"
})

export default instance