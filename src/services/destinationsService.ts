import axios from "axios";

export interface Destination {
  id: string;
  name: string;
  description: string;
  createdAt: String;
  updatedAt: String;
}

export interface Visitors {
  crowdedness: number;
  visitors: number;
}

const ENTRYPOINT = "http://localhost:4000/api";

export const getDestinations = (): Promise<Destination[]> =>
  axios.get(`${ENTRYPOINT}/destinations`).then(({ data }) => data);

export const getVisitors = (ts?: string): Promise<Visitors> => {
  return axios
    .get(
      `${ENTRYPOINT}/visitors?timestamp=${
        ts ? ts : Math.floor(Date.now() / 1000)
      }`
    )
    .then(({ data }) => data);
};
