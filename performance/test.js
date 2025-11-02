import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

// Helper function: Register user
function registerUser() {
  const credentials = {
    username: 'test_' + Date.now(),
    password: 'secret_' + Date.now(),
  };

  const res = http.post(
    'https://test-api.k6.io/user/register/',
    JSON.stringify(credentials),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, { 'register status 201': (r) => r.status === 201 || r.status === 200 });
  return credentials;
}

// Helper function: Login user and get token
function loginUser(credentials) {
  const res = http.post(
    'https://test-api.k6.io/auth/token/login/',
    JSON.stringify(credentials),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, { 'login status 200': (r) => r.status === 200 });
  return res.json().access;
}

// Helper function: CRUD operations for crocodiles
function crocodileCRUD(token) {
  // Create
  let res = http.post(
    'https://test-api.k6.io/my/crocodiles/',
    JSON.stringify({ name: 'Croc_' + Date.now(), sex: 'M', date_of_birth: '1900-10-28' }),
    { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } }
  );
  check(res, { 'create crocodile status 201': (r) => r.status === 201 });
  const id = res.json().id;

  // Read
  res = http.get(`https://test-api.k6.io/my/crocodiles/${id}/`, {
    headers: { Authorization: 'Bearer ' + token },
  });
  check(res, { 'read crocodile status 200': (r) => r.status === 200 });

  // Update
  res = http.put(
    `https://test-api.k6.io/my/crocodiles/${id}/`,
    JSON.stringify({ name: 'Updated Croc', sex: 'M', date_of_birth: '1900-10-28' }),
    { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } }
  );
  check(res, { 'update status 200': (r) => r.status === 200 });

  // Patch
  res = http.patch(
    `https://test-api.k6.io/my/crocodiles/${id}/`,
    JSON.stringify({ sex: 'F' }),
    { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } }
  );
  check(res, { 'patch status 200': (r) => r.status === 200 });

  // Delete
  res = http.del(`https://test-api.k6.io/my/crocodiles/${id}/`, null, {
    headers: { Authorization: 'Bearer ' + token },
  });
  check(res, { 'delete status 204': (r) => r.status === 204 });
}

export default function () {
  // Test 1: User Registration & Login
  const credentials = registerUser();
  const token = loginUser(credentials);
  sleep(1);

  // Test 2: Crocodile CRUD flow
  crocodileCRUD(token);
  sleep(1);

  // Test 3: Another API call (example)
  const res = http.get('https://test-api.k6.io/crocodiles/');
  check(res, { 'get all crocodiles status 200': (r) => r.status === 200 });
  sleep(1);
}

// Generate HTML report
export function handleSummary(data) {
  const customData = {
    summary: data,
    custom: {
      testName: 'Multiple API Tests',
      environment: 'QA',
      executedBy: 'Milind',
      totalVUs: data.metrics.vus_max?.values?.max,
      totalRequests: data.metrics.http_reqs?.values?.count,
      failedRequests: data.metrics.http_req_failed?.values?.count,
      avgResponseTime: data.metrics.http_req_duration?.values?.avg.toFixed(2) + ' ms',
    },
  };

  return {
    'performance-summary.html': htmlReport(customData),
  };
}
