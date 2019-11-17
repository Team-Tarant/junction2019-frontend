import axios from 'axios'

export interface Destination {
  id: string
  name: string
  description: string
  createdAt: String
  updatedAt: String
}

const ENTRYPOINT = 'http://localhost:4000/api'

export const getDestinations = (): Promise<Destination[]> => axios
  .get(`${ENTRYPOINT}/destinations`)
  .then(({ data }) => data)