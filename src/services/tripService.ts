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

const ENTRYPOINT = 'https://hidden-crag-93128.herokuapp.com/api'

export const getTripsForDest = (destinationId: string): Promise<Trip[]> => axios
  .get(`${ENTRYPOINT}/trips/${destinationId}`)
  .then(({ data }) => data)

export const joinTrip = (tripId: string) => axios
  .post(`${ENTRYPOINT}/trips/${tripId}/join`,
  { participantName: 'Teppo', participantPhone: '+358500400' })
  .then(({ data }) => data)

