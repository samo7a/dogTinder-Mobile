
import axios from 'axios';

let Axios = axios.create({
  //baseURL: 'https://wo0of.herokuapp.com',
  baseURL: 'http://192.168.0.9:5000/',
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  Axios.interceptors.request.use(function(config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default Axios;