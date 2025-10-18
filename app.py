import os
import logging
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from datetime import datetime
from decimal import Decimal
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='dist', static_url_path='')

# Configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    logger.error("DATABASE_URL environment variable is not set")
    sys.exit(1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SESSION_SECRET', 'dev-secret-key-change-in-production')
app.config['SESSION_TYPE'] = 'sqlalchemy'

# Initialize extensions
db = SQLAlchemy(app)
app.config['SESSION_SQLALCHEMY'] = db

# Enable CORS for React frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:5000'])

# Initialize Flask-Session
Session(app)

# Import routes after db initialization
from routes import register_routes

# Register all API routes
register_routes(app, db)

# Serve React app in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the React app for all non-API routes"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({'message': 'Not found'}), 404
    return serve_react_app('')

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {error}")
    db.session.rollback()
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    
    # Detect environment
    is_production = os.getenv('REPLIT_DEPLOYMENT') == '1' or os.getenv('NODE_ENV') == 'production'
    
    logger.info(f"Starting Flask app on port {port} ({'production' if is_production else 'development'} mode)")
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
        logger.info("Database tables created/verified")
    
    app.run(host='0.0.0.0', port=port, debug=not is_production)
