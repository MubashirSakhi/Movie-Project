import axios from 'axios';

const apiAxios = axios.create({
  baseURL: `https://www.omdbapi.com/`
});



const serverAxios = axios.create({
  baseURL: 'http://localhost:1337/'
});
serverAxios.defaults.headers.post["Content-Type"] = "application/json";
// serverAxios.interceptors.request.use(
//   request => {
//     apiAxios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;
//     return request
//   },error => {
//     return error;
//   }
  
//)
export { apiAxios, serverAxios };