import os
import pytest
from flask import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def testProcessDataSuccess(client):
    test_data = {'data': {'key': 'value'}}
    response = client.post('/process', json=test_data, headers={'Authorization': f'Bearer {os.getenv("AUTHENTICATION_TOKEN")}'})
    assert response.status_code == 200
    assert response.json['data'] == test_data['data']
    assert response.json['metadata']['processed_by'] == 'harvest-python-middleware'
    assert response.json['metadata']['processing_status'] == 'success'

def testInternaServerError(client, mocker):
    mocker.patch('app.authenticateRequest', side_effect=Exception('Mocked exception'))
    response = client.post('/process', json={'data': {'key': 'value'}}, headers={'Authorization': f'Bearer {os.getenv("AUTHENTICATION_TOKEN")}'})
    assert response.status_code == 500
    assert response.json['error'] == 'Mocked exception'
