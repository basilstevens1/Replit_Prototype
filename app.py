import os
import logging
from flask import Flask, jsonify, request, session, send_from_directory
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
app = Flask(__name__, static_folder='dist/public', static_url_path='')

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

# Enable CORS for development
CORS(app, supports_credentials=True, origins=[
    'http://localhost:5173',  # Vite dev server
    'http://localhost:5000',  # Flask server
    'https://*.replit.dev',   # Replit domains
    'https://*.replit.app'    # Replit app domains
])

# Initialize Flask-Session
Session(app)

# Import routes after db initialization
from routes import register_routes
from auth import setup_auth

# Setup authentication
setup_auth(app)

# Register all API routes
register_routes(app, db)

# Serve React app (for non-API routes)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the React app for all non-API routes"""
    # API routes are handled separately
    if path.startswith('api/'):
        return jsonify({'message': 'Not found'}), 404
    
    # Try to serve the file if it exists
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    
    # Fall back to index.html for client-side routing
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({
            'message': 'Frontend not built yet. Run "npm run build" first.',
            'backend': 'Python Flask',
            'status': 'running'
        }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({'message': 'API endpoint not found'}), 404
    return serve_react_app(request.path[1:])  # Remove leading slash

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {error}")
    db.session.rollback()
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    
    # Detect environment
    is_production = os.getenv('REPLIT_DEPLOYMENT') == '1' or os.getenv('FLASK_ENV') == 'production'
    
    logger.info(f"Starting Flask app on port {port} ({'production' if is_production else 'development'} mode)")
    
    # Create database tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created/verified")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
            sys.exit(1)
    
    app.run(host='0.0.0.0', port=port, debug=not is_production)
