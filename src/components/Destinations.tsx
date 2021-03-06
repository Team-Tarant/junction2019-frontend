import React, { useState, useEffect } from "react";
import {
  getDestinations,
  Destination,
  getVisitors,
  Visitors
} from "../services/destinationsService";
import "Styles/Destinations.scss";
import Header from "Components/Header";
import { Trip, getTripsForDest, joinTrip } from "../services/tripService";
import moment from "moment";

const ExpandedDestination = ({
  dest,
  hidden,
  setExpandedHidden
}: {
  dest: Destination | null;
  hidden: boolean;
  setExpandedHidden: any;
}) => {
  const [day, setDay] = useState(17);
  const [month, setMonth] = useState(11);
  const [visitors, setVisitors] = useState<Visitors | null>(null);
  const [tripExpanded, setTripExpanded] = useState<boolean>(false);

  useEffect(() => {
    setVisitors(null);
    let hour = 13;
    if (day !== 17 || month !== 11) {
      hour = Math.floor(15 + Math.random() * 8);
    }
    getVisitors(
      String(
        moment(`${day}-${month}-2019 ${hour}:00`, "DD-MM-YYYY HH:mm").unix()
      )
    ).then(setVisitors);
  }, [day, month]);
  return (
    <div className={`destination-expanded${hidden ? " hidden" : ""}`}>
      <p className="close" onClick={() => setExpandedHidden(true)}>
        ←
      </p>
      <h2 className="destination-expanded-title">{dest ? dest.name : ""}</h2>
      <p className="destination-expanded-description">
        {dest ? dest.description : ""}
      </p>
      <div className="row">
        <div className="col">
          <p className="date-day">Day</p>
        </div>
        <div className="col">
          <p className="date-adjust" onClick={() => setDay(day + 1)}>
            +
          </p>
          <h2 className="number">{day}</h2>
          <p className="date-adjust" onClick={() => setDay(day - 1)}>
            -
          </p>
        </div>
        <div className="col">
          <p className="date-adjust" onClick={() => setMonth(month + 1)}>
            +
          </p>
          <h2 className="number">{month}</h2>
          <p className="date-adjust" onClick={() => setMonth(month - 1)}>
            -
          </p>
        </div>
        <div className="col">
          <p className="date-month">Month</p>
        </div>
      </div>
      {visitors ? (
        <CrowdEstimation visitors={visitors} />
      ) : (
        <img src={require("Assets/loading.svg")} />
      )}
      <div className="next-button" onClick={() => setTripExpanded(true)}>
        Find trips
      </div>
      <TripList
        hidden={tripExpanded}
        dest={dest}
        setTripExpanded={setTripExpanded}
      ></TripList>
    </div>
  );
};

const TripList = ({
  dest,
  hidden,
  setTripExpanded
}: {
  dest: Destination | null;
  hidden: boolean;
  setTripExpanded: any;
}) => {
  return (
    <div className={`trip-expanded${!hidden ? " hidden" : ""}`}>
      <p className="close" onClick={() => setTripExpanded(false)}>
        ←
      </p>
      <TripsCard
        destinationId={dest ? dest.id : ""}
        destinationName={dest ? dest.name : ""}
      />
    </div>
  );
};

const TripsCard = ({
  destinationId,
  destinationName
}: {
  destinationId: string;
  destinationName: string;
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activitiesExpanded, setActivitiesExpanded] = useState<boolean>(false);
  const [dudeName, setDudeName] = useState("null");
  useEffect(() => {
    getTripsForDest(destinationId).then(setTrips);
  }, [destinationId]);

  return (
    <div className="trips-card">
      <ul className="trip-items">
        {trips.map(trip => {
          const isFull = trip.participants.length >= trip.capacity;
          return (
            <li
              className={`trip-item${isFull ? " danger" : ""}${
                trip.capacity <= trip.participants.length ? " disabled" : ""
              }${activitiesExpanded ? " hidden" : ""}`}
              onClick={() => {
                if (trip.capacity <= trip.participants.length) return;
                setDudeName(trip.driverName);
                joinTrip(trip.id).then(() => {
                  getTripsForDest(destinationId).then(setTrips);
                  setActivitiesExpanded(true);
                });
              }}
            >
              <p className="trip-content">
                {trip.driverName} is driving to {destinationName} from{" "}
                {trip.from} at {moment(trip.startToDestination).format("HH:mm")}
              </p>
              <p className="trip-status">
                {isFull
                  ? "Car is fully booked!"
                  : `Slots left: ${trip.participants.length}/${trip.capacity}`}
              </p>
            </li>
          );
        })}
      </ul>
      <div className={`create-ride ${activitiesExpanded ? " hidden" : ""}`}>
        Create a new ride
      </div>
      <ActivityList
        hidden={activitiesExpanded}
        destinationName={destinationName}
        setActivitiesExpanded={setActivitiesExpanded}
        driverName={dudeName}
      ></ActivityList>
    </div>
  );
};

const ActivityList = ({
  hidden,
  destinationName,
  driverName,
  setActivitiesExpanded
}: {
  hidden: boolean;
  destinationName: string;
  driverName: string;
  setActivitiesExpanded: any;
}) => {
  return (
    <div className={`activities-expanded${!hidden ? " hidden" : ""}`}>
      <p className="close" onClick={() => setActivitiesExpanded(false)}>
        ←
      </p>
      <h3>Great! You just joined a ride with {driverName}.</h3>
      <h2>Activities we recommend for {destinationName}:</h2>
      <div className="activity-item">
        <p className="activity-sponsored">Sponsored activity</p>
        <h4 className="activity-name">Guided bird watching tour</h4>
        <p className="activity-book">Book now</p>
      </div>
      <div className="activity-item">
        <p className="activity-sponsored">Sponsored activity</p>
        <h4 className="activity-name">Campfire and sausage tasting</h4>
        <p className="activity-book">Book now</p>
      </div>
      <div className="activity-item">
        <h4 className="activity-name">Relaxing lakeside hike</h4>
        <p className="activity-book">Read more</p>
      </div>
      <div className="activity-item">
        <h4 className="activity-name">Mountain biking route</h4>
        <p className="activity-book">Read more</p>
      </div>
    </div>
  );
};

const CrowdEstimation = ({ visitors }: { visitors: Visitors }) => {
  if (visitors.crowdedness <= 3) {
    return <span className="crowd-estimation green">likely not crowded</span>;
  } else if (visitors.crowdedness > 3 && visitors.crowdedness <= 7) {
    return <span className="crowd-estimation yellow">moderately crowded</span>;
  } else if (visitors.crowdedness > 7) {
    return <span className="crowd-estimation red" />;
  }
  return <></>;
};

const DestinationItem = ({
  dest,
  key,
  setExpanded,
  setExpandedHidden,
  expandedHidden
}: {
  dest: Destination;
  key: number;
  setExpanded: any;
  setExpandedHidden: any;
  expandedHidden: boolean;
  visitors: Visitors | null;
}) => (
  <li
    className="destination-item"
    key={key}
    onClick={() => {
      setExpandedHidden(!expandedHidden);
      setExpanded(dest);
    }}
  >
    <p className="destination-title">{dest.name}</p>
  </li>
);

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [expandedDestination, setExpanded] = useState<Destination | null>(null);
  const [expandedHidden, setExpandedHidden] = useState<boolean>(true);
  const [visitors, setVisitors] = useState<Visitors | null>(null);
  useEffect(() => {
    getDestinations().then(dest => setDestinations(dest));
    getVisitors().then(setVisitors);
  }, []);

  return (
    <section>
      <Header></Header>
      <div className="destination-list">
        <ul className="destination-ul">
          {destinations.map((item, key) => (
            <DestinationItem
              dest={item}
              key={key}
              setExpanded={setExpanded}
              setExpandedHidden={setExpandedHidden}
              expandedHidden={expandedHidden}
              visitors={visitors}
            />
          ))}
        </ul>
      </div>
      <ExpandedDestination
        dest={expandedDestination}
        setExpandedHidden={setExpandedHidden}
        hidden={expandedHidden}
      />
    </section>
  );
};

export default Destinations;
