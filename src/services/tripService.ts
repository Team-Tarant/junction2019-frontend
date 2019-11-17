import axios from 'axios'

export interface Trip {
  id: string
  destinationId: string
  driverName: string
  driverPhone: string
  from: string
  startToDestination: string
  startFromDestination: string
  capacity: number
  participants: Array<{
    name: string
    phone: string
  }>
}

const ENTRYPOINT = 'http://localhost:4000/api'

export const getTripsForDest = (destinationId: string): Promise<Trip[]> => axios
  .get(`${ENTRYPOINT}/trips/${destinationId}`)
  .then(({ data }) => data)

export const joinTrip = (tripId: string) => axios
  .post(`${ENTRYPOINT}/trips/${tripId}/join`,
  { participantName: 'Hugo', participantPhone: 'Holmqvist' })
  .then(({ data }) => data)

