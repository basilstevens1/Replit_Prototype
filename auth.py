import os
import logging
from functools import wraps
from flask import session, redirect, url_for, request, jsonify
from authlib.integrations.flask_client import OAuth
from authlib.common.errors import AuthlibBaseError

logger = logging.getLogger(__name__)

# Initialize OAuth
oauth = OAuth()

def setup_auth(app):
    """Setup Replit Auth with OpenID Connect"""
    
    # Get configuration from environment
    issuer_url = os.getenv('ISSUER_URL', 'https://replit.com/oidc')
    client_id = os.getenv('REPL_ID')
    replit_domains = os.getenv('REPLIT_DOMAINS', '').split(',')
    
    if not client_id:
        logger.warning("REPL_ID not set - authentication will not work")
        return
    
    if not replit_domains[0]:
        logger.warning("REPLIT_DOMAINS not set - authentication may not work correctly")
    
    # Configure OAuth client
    oauth.init_app(app)
    
    oauth.register(
        name='replit',
        client_id=client_id,
        server_metadata_url=f'{issuer_url}/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile offline_access',
            'code_challenge_method': 'S256'
        }
    )
    
    logger.info(f"Replit Auth configured with issuer: {issuer_url}")

def get_current_user():
    """Get the current authenticated user from session"""
    return session.get('user')

def is_authenticated():
    """Check if user is authenticated"""
    user = get_current_user()
    return user is not None and 'sub' in user.get('claims', {})

def require_auth(f):
    """Decorator to require authentication for a route"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_authenticated():
            return jsonify({'message': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def setup_auth_routes(app, db):
    """Setup authentication routes"""
    from models import User
    
    @app.route('/api/login')
    def login():
        """Initiate OIDC login flow"""
        # Get the redirect URL based on the domain
        domain = request.host
        redirect_uri = f'https://{domain}/api/callback'
        
        # For local development
        if 'localhost' in domain:
            redirect_uri = 'http://localhost:5000/api/callback'
        
        return oauth.replit.authorize_redirect(redirect_uri)
    
    @app.route('/api/callback')
    def callback():
        """Handle OIDC callback"""
        try:
            token = oauth.replit.authorize_access_token()
            
            # Get user info from claims
            claims = token.get('userinfo') or {}
            if not claims:
                # Try to get claims from ID token
                id_token = token.get('id_token')
                if id_token:
                    import jwt
                    claims = jwt.decode(id_token, options={"verify_signature": False})
            
            # Store user info in session
            session['user'] = {
                'claims': claims,
                'access_token': token.get('access_token'),
                'refresh_token': token.get('refresh_token'),
                'expires_at': claims.get('exp')
            }
            
            # Upsert user to database
            user_id = claims.get('sub')
            if user_id:
                existing_user = db.session.query(User).filter_by(id=user_id).first()
                if existing_user:
                    # Update existing user
                    existing_user.email = claims.get('email')
                    existing_user.first_name = claims.get('first_name')
                    existing_user.last_name = claims.get('last_name')
                    existing_user.profile_image_url = claims.get('profile_image_url')
                else:
                    # Create new user
                    new_user = User(
                        id=user_id,
                        email=claims.get('email'),
                        first_name=claims.get('first_name'),
                        last_name=claims.get('last_name'),
                        profile_image_url=claims.get('profile_image_url')
                    )
                    db.session.add(new_user)
                
                db.session.commit()
            
            return redirect('/')
        
        except AuthlibBaseError as e:
            logger.error(f"Auth error: {e}")
            return redirect('/api/login')
    
    @app.route('/api/logout')
    def logout():
        """Logout and clear session"""
        session.clear()
        
        # Redirect to Replit logout
        issuer_url = os.getenv('ISSUER_URL', 'https://replit.com/oidc')
        client_id = os.getenv('REPL_ID')
        post_logout_redirect = f'{request.scheme}://{request.host}'
        
        logout_url = f'{issuer_url}/logout?client_id={client_id}&post_logout_redirect_uri={post_logout_redirect}'
        
        return redirect(logout_url)
    
    @app.route('/api/auth/user')
    @require_auth
    def get_auth_user():
        """Get current authenticated user"""
        user = get_current_user()
        claims = user.get('claims', {})
        user_id = claims.get('sub')
        
        if not user_id:
            return jsonify({'message': 'User not found'}), 404
        
        db_user = db.session.query(User).filter_by(id=user_id).first()
        
        if not db_user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': db_user.id,
            'email': db_user.email,
            'firstName': db_user.first_name,
            'lastName': db_user.last_name,
            'profileImageUrl': db_user.profile_image_url
        })
