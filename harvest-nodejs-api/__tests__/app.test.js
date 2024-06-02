const request = require('supertest');
const express = require('express');
const NodeCache = require('node-cache');

// Mocked dependencies
jest.mock('axios');
const axios = require('axios');

// Application setup
const app = express();
const cache = new NodeCache({ stdTTL: 100 });

const WORDPRESS_BACKEND_API_URL = 'http://mock-wordpress-backend';
const PYTHON_MIDDLEWARE_SERVICE_URL = 'http://mock-python-middleware';
const AUTHENTICATION_TOKEN = 'mock-token';

const authenticateRequest = (req, res, next) => {
  const token = req.headers.authorization;
  if (`Bearer ${AUTHENTICATION_TOKEN}` !== token) {
    return res.status(401).json({ error: 'Unauthorized access - Invalid token' });
  }
  next();
};

const fetchWordpressData = async (endpoint, queryParams) => {
  const response = await axios.get(`${WORDPRESS_BACKEND_API_URL}${endpoint}`, { params: queryParams });
  return response.data;
};

const processMiddlewareData = async (data, token) => {
  const response = await axios.post(PYTHON_MIDDLEWARE_SERVICE_URL, { data }, {
    headers: {
      'Authorization': token
    }
  });
  return response.data;
};

const handleErrorResponse = (error, res) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      return res.status(401).json({ error: 'Unauthorized access - Invalid token' });
    }
    if (status === 404) {
      return res.status(404).json({ error: 'No data found' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  console.error('Error fetching or processing data:', error.message);
  res.status(500).json({ error: 'Error fetching or processing data' });
};

app.get('/api/:dataType/:itemId?', authenticateRequest, async (req, res) => {
  const { dataType, itemId } = req.params;
  const queryParams = req.query;
  const cacheKey = `${dataType}${itemId ? `_${itemId}` : ''}`;

  // Check the cache for data
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    let endpoint = dataType;
    if (itemId) {
      endpoint += `/${itemId}`;
    }

    // Fetch data from WordPress API
    const wordpressData = await fetchWordpressData(endpoint, queryParams);
    const token = req.headers.authorization;
    const processedData = await processMiddlewareData(wordpressData, token);

    // Cache data
    cache.set(cacheKey, processedData);
    res.json(processedData);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

// Test suite
describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.flushAll();
  });

  const testDataType = 'pages'; // dynamic data type for testing

  it('should return 401 for invalid token', async () => {
    const response = await request(app)
      .get(`/api/${testDataType}`)
      .set('Authorization', 'Bearer invalid-token');
      
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized access - Invalid token');
  });

  it('should fetch data from WordPress API and process it through middleware', async () => {
    const mockWordpressData = { id: 1, name: 'Test' };
    const mockProcessedData = { id: 1, name: 'Test', processed: true };

    axios.get.mockResolvedValue({ data: mockWordpressData });
    axios.post.mockResolvedValue({ data: mockProcessedData });

    const response = await request(app)
      .get(`/api/${testDataType}`)
      .set('Authorization', `Bearer ${AUTHENTICATION_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProcessedData);
  });

  it('should return cached data if available', async () => {
    const cacheKey = testDataType;
    const cachedData = { id: 1, name: 'Cached Test' };

    cache.set(cacheKey, cachedData);

    const response = await request(app)
      .get(`/api/${testDataType}`)
      .set('Authorization', `Bearer ${AUTHENTICATION_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(cachedData);
  });
});

// Start the server only if this file is run directly (not in tests)
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Node.js backend is running on port 3000');
  });
}

module.exports = app;
