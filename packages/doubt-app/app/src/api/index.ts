import axios from 'axios';
import { auth } from "../services/firebase";

export default () => {
  const inst = axios.create({
    baseURL: 'http://localhost:4000/v1/qa',
  });
  inst.interceptors.request.use(async config => {
    return new Promise((resolve, reject) => {
      auth().onAuthStateChanged(user => {
        if (!user) resolve(config)
        user?.getIdToken().then(token => {
          config.headers.authorization = `Bearer ${token}`
          return resolve(config)
        })
      })
    })
  }, (error) => {
    return Promise.reject(error)
  });
  return inst;
};