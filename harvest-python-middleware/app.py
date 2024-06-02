from flask import Flask, jsonify, request, abort
import os

app = Flask(__name__)

# Bearer token for authentication (retrieved from environment variable)
AUTHENTICATION_TOKEN = os.getenv('AUTHENTICATION_TOKEN')

def authenticateRequest(token):
    if token != f'Bearer {AUTHENTICATION_TOKEN}':
        abort(401, description='Unauthorized')

def createMetadata():
    return {
        'processed_by': 'harvest-python-middleware',
        'processing_status': 'success'
    }

@app.route('/process', methods=['POST'])
def processData():
    try:
        data = request.json.get('data')
        token = request.headers.get('Authorization')

        # Authenticate the request
        authenticateRequest(token)

        # Process data (placeholder for processing logic)
        processedData = data
        metadata = createMetadata()
        response = {
            'data': processedData,
            'metadata': metadata
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(401)
def unauthorizedError(error):
    return jsonify({'error': error.description}), 401

@app.errorhandler(404)
def notFoundError(error):
    return jsonify({'error': error.description}), 404

@app.errorhandler(500)
def internalError(error):
    return jsonify({'error': error.description}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
