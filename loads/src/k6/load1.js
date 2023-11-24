import http from 'k6/http';
import { authenticate } from './getToken.js';
import {sleep} from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const IAM_HOST='identity-provider-base';
const REALM = 'beans';
// const CLIENT_ID = 'ui-edge-service-client';
const CLIENT_ID = 'gw-edge-service-client';



const CLIENT_SECRET = 'rocking-secret';
const USERNAME = 'reader-user';
const PASSWORD = 'test';

export function setup() {
    // Use either password authentication flow
    const passwordAuthResp = authenticate(
        IAM_HOST,
        REALM,
        CLIENT_ID,
        CLIENT_SECRET,
        //SCOPES,
        {
            username: USERNAME,
            password: PASSWORD,
        }
    );

    return passwordAuthResp;

}

export const options = {
    // Key configurations for Stress in this section
    stages: [
        // { duration: '1m', target: 600 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
        // { duration: '3m', target: 1600 }, // stay at higher 200 users for 30 minutes
        // { duration: '3m', target: 600 }, // stay at higher 200 users for 30 minutes
        { duration: '1m', target: 1 }, // stay at higher 200 users for 30 minutes
        { duration: '1m', target: 1 }, // stay at higher 200 users for 30 minutes
        { duration: '1m', target: 1 }, // stay at higher 200 users for 30 minutes
        // { duration: '3m', target: 1600 }, // stay at higher 200 users for 30 minutes
        // { duration: '5m', target: 0 }, // ramp-down to 0 users
    ],
    // thresholds: { http_req_duration: ['avg<100', 'p(95)<200'] },
};
export default function (data) {
    // Then, use the access_token to access a protected resource (user profile)
    // NOTE: access_token from client credentials flow cannot be used to access the user profile
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access_token}`, // or `Bearer ${clientAuthResp.access_token}`
        },
    };
    // const urlRes = 'http://localhost:8083/api/1/resource/';
    const urlRes = 'http://localhost:8083/reqbin/echo/get/json';
    const res = http.get(urlRes, params);
    sleep(1);
    // Do something with the response
    // For example, this should print the user profile
    //  console.info(params);
    // console.info(res);
}
export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}
