let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'localhost') {
    backendHost = 'http://54.180.116.63:8080';
}

// 54.180.116.63:8080

// http: 현지;
// //52.79.227.173:8080

export const API_BASE_URL = `${backendHost}`;
