import axios from 'axios';
import {API_URL} from './urls';

export default {
  getAll(status, debtorAddress, offset, limit){
    let url = `${API_URL}/Debts`;

    return axios.get(url, {params: {status, debtorAddress, offset, limit}}).then(resp => resp.data);
  },
  post(debtOrder){
    let url = `${API_URL}/Debts`;

    return axios.post(url, debtOrder);
  },
  put(id, debtOrder){
    let url = `${API_URL}/Debts/${id}`;

    return axios.put(url, debtOrder);
  }
}