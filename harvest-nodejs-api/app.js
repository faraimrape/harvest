const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 100 });

// Read environment variables
const WORDPRESS_BACKEND_API_URL = process.env.WORDPRESS_BACKEND_API_URL;
const PYTHON_MIDDLEWARE_SERVICE_URL = process.env.PYTHON_MIDDLEWARE_SERVICE_URL;
const AUTHENTICATION_TOKEN = process.env.AUTHENTICATION_TOKEN;

const authenticateRequest = (req, res, next) => {
  const token = req.headers.authorization;
  if (`Bearer ${AUTHENTICATION_TOKEN}` !== token) {
    return res.status(401).json({ error: 'Unauthorized access - Invalid token' });
  }
  next()
}

const fetchWordpressData = async (endpoint, queryParams) => {
  const response = await axios.get(`${WORDPRESS_BACKEND_API_URL}${endpoint}`, { params: queryParams });
  return response.data;
}

const processMiddlewareData = async (data, token) => {
  const response = await axios.post(PYTHON_MIDDLEWARE_SERVICE_URL, { data }, {
    headers: {
      'Authorization': token
    }
  })
  return response.data;
}

app.get('/api/:dataType/:itemId?', authenticateRequest, async (req, res) => {
  const { dataType, itemId } = req.params;
  const queryParams = req.query;
  const cacheKey = `${dataType}${itemId ? `_${itemId}` : ''}`

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

    // cache data
    cache.set(cacheKey, processedData);
    res.json(processedData);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

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

app.listen(3000, () => {
  console.log('Node.js backend is running on port 3000');
});
