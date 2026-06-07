import axios from 'axios'
const baseUrl = '/api/notes'

let token
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.put(`${baseUrl}/${id}`, newObject, config)
    .then(response => response.data)
}

const remove = id => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.delete(`${baseUrl}/${id}`, config)
    .then(response => response.data)
}

export default { getAll, create, update, remove, setToken }