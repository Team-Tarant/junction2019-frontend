import React, { useState, useEffect } from 'react'
import { getDestinations, Destination, getVisitors, Visitors } from '../services/destinationsService'
import 'Styles/Destinations.scss'
import { Trip, getTripsForDest, joinTrip } from '../services/tripService';
import moment from 'moment'

const ExpandedDestination = ({ dest, hidden }: {dest: Destination | null, hidden: boolean}) =>
  <div className={`destination-expanded${hidden ? ' hidden' : ''}`}>
    <h2 className="destination-expanded-title">{dest ? dest.name : ''}</h2>
    <p className="destination-expanded-description">{dest ? dest.description : ''}</p>
    <TripsCard destinationId={dest ? dest.id : ''} destinationName={dest ? dest.name : ''} />
  </div>

const TripsCard = ({ destinationId, destinationName }: {destinationId: string, destinationName: string}) => {
  const [trips, setTrips] = useState<Trip[]>([])
  useEffect(() => {
    getTripsForDest(destinationId)
      .then(setTrips)
  }, [destinationId])

  return (
    <div className="trips-card">
      <ul className="trip-items">
        {trips.map(trip => {
          const isFull = trip.participants.length >= trip.capacity
          return (
            <li className={`trip-item${isFull ? ' danger' : ''}`} onClick={() => {
                joinTrip(trip.id)
                  .then(() => {
                    getTripsForDest(destinationId).then(setTrips)
                    alert('Trip booked!')
                  })
              }}>
              <p className="trip-content">{trip.driverName} is driving to {destinationName} from {trip.from} at {moment(trip.startToDestination).format('DD.MM HH:mm')}</p>
              <p className="trip-status">{isFull ? 'Car is fully booked!' : 'Slots left!'}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const CrowdEstimation = ({visitors}: {visitors: Visitors}) => {
  if (visitors.crowdedness <= 3) {
    return <span className="crowd-estimation green" /> 
  } else if (visitors.crowdedness > 3 && visitors.crowdedness <= 7) {
    return <span className="crowd-estimation yellow" /> 
  } else if (visitors.crowdedness > 7) {
    return <span className="crowd-estimation red" /> 
  }
  return (<></>)
}

const DestinationItem =
({dest, key, setExpanded, setExpandedHidden, expandedHidden, visitors}: {dest: Destination, key: number, setExpanded: any, setExpandedHidden: any, expandedHidden: boolean, visitors: Visitors | null}) =>
  <li className="destination-item" key={key} onClick={() => {
    setExpandedHidden(!expandedHidden)
    setExpanded(dest)
  }}>
    <p className="destination-title">{dest.name}</p>
    {(visitors && dest.name === 'Nuuksio') && <CrowdEstimation visitors={visitors} />}
  </li>

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [expandedDestination, setExpanded] = useState<Destination | null>(null)
  const [expandedHidden, setExpandedHidden] = useState<boolean>(true)
  const [visitors, setVisitors] = useState<Visitors | null>(null)
  useEffect(() => {
    getDestinations()
      .then(dest => setDestinations(dest))
    getVisitors()
      .then(setVisitors)
  }, [])

  return (
    <section>
      <div className="destination-list">
        <ul className="destination-ul">
          {destinations.map((item, key) =>
            <DestinationItem
              dest={item}
              key={key}
              setExpanded={setExpanded}
              setExpandedHidden={setExpandedHidden}
              expandedHidden={expandedHidden}
              visitors={visitors}
            />)}
        </ul>
      </div>
      <ExpandedDestination
        dest={expandedDestination}
        hidden={expandedHidden} />
    </section>
  )
}

export default Destinations
