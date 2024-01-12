
import http from "k6/http";


export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 300,
      timeUnit: '1s',
      startRate: 50,
      stages: [
        { target: 10000, duration: '30s' }, 
        { target: 10000, duration: '2m' }, 
      ],
    },
  },
};

export default function () {
  const response = http.get("http://34.128.149.125");
}
