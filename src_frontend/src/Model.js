import axios from 'axios'
const baseUrl = '/api/persons'

const fetchPersons = (success, failed) => {
  return axios.get(baseUrl).then(response => success(response.data)).catch(error => failed(error))
}

const insertPerson = (newObject, success, failed) => {
  return axios.post(baseUrl, newObject).then(response => success(response.data)).catch(error => failed(error))
}

const updatePerson = (newObject, success, failed) => {
  return axios.put(`${baseUrl}/${newObject.id}`, newObject).then(response => success(response.data)).catch(error => failed(error))
}

const deletePerson = (obj, success, failed) => {
  return axios.delete(`${baseUrl}/${obj.id}`).then(response => success(response.data)).catch(error => failed(error))
}

export { fetchPersons, insertPerson, updatePerson, deletePerson }
