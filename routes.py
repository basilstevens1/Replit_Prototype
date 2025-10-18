"""API routes for Impact Altruism application"""
import logging
from flask import request, jsonify
from datetime import datetime
from decimal import Decimal, InvalidOperation
from auth import require_auth, get_current_user, setup_auth_routes
from storage import Storage

logger = logging.getLogger(__name__)

def register_routes(app, db):
    """Register all API routes"""
    
    # Initialize storage layer
    storage = Storage(db)
    
    # Setup authentication routes
    setup_auth_routes(app, db)
    
    # Donation routes
    @app.route('/api/donations', methods=['GET'])
    @require_auth
    def get_donations():
        """Get all donations for authenticated user"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            donations = storage.get_user_donations(user_id)
            return jsonify(donations)
        
        except Exception as e:
            logger.error(f"Error fetching donations: {e}")
            return jsonify({'message': 'Failed to fetch donations'}), 500
    
    @app.route('/api/donations', methods=['POST'])
    @require_auth
    def create_donation():
        """Create a new donation"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            data = request.get_json()
            
            # Validate required fields
            if not data.get('amount') or not data.get('charity') or not data.get('donationDate'):
                return jsonify({'message': 'Missing required fields'}), 400
            
            # Parse donation date
            if isinstance(data['donationDate'], str):
                try:
                    data['donationDate'] = datetime.fromisoformat(data['donationDate'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'message': 'Invalid date format'}), 400
            
            # Create donation
            donation = storage.create_donation(user_id, data)
            
            # Update user progress
            donation_amount = float(data['amount'])
            progress = storage.update_user_progress_after_donation(user_id, donation_amount)
            
            # Check for new achievements
            new_achievements = storage.check_and_unlock_achievements(user_id)
            
            return jsonify({
                'donation': donation,
                'progress': progress,
                'newAchievements': new_achievements
            }), 201
        
        except Exception as e:
            logger.error(f"Error creating donation: {e}")
            return jsonify({'message': 'Failed to create donation'}), 500
    
    @app.route('/api/donations/<donation_id>', methods=['PUT'])
    @require_auth
    def update_donation(donation_id):
        """Update a donation"""
        try:
            data = request.get_json()
            
            # Parse donation date if present
            if 'donationDate' in data and isinstance(data['donationDate'], str):
                try:
                    data['donationDate'] = datetime.fromisoformat(data['donationDate'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'message': 'Invalid date format'}), 400
            
            donation = storage.update_donation(donation_id, data)
            return jsonify(donation)
        
        except ValueError as e:
            return jsonify({'message': str(e)}), 404
        except Exception as e:
            logger.error(f"Error updating donation: {e}")
            return jsonify({'message': 'Failed to update donation'}), 500
    
    @app.route('/api/donations/<donation_id>', methods=['DELETE'])
    @require_auth
    def delete_donation(donation_id):
        """Delete a donation"""
        try:
            storage.delete_donation(donation_id)
            return '', 204
        
        except Exception as e:
            logger.error(f"Error deleting donation: {e}")
            return jsonify({'message': 'Failed to delete donation'}), 500
    
    # Impact stats route
    @app.route('/api/impact', methods=['GET'])
    @require_auth
    def get_impact():
        """Get impact statistics for authenticated user"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            impact_stats = storage.get_user_impact_stats(user_id)
            return jsonify(impact_stats)
        
        except Exception as e:
            logger.error(f"Error fetching impact stats: {e}")
            return jsonify({'message': 'Failed to fetch impact stats'}), 500
    
    # User Progress routes
    @app.route('/api/progress', methods=['GET'])
    @require_auth
    def get_progress():
        """Get user progress"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            progress = storage.get_user_progress(user_id)
            
            # Initialize progress for new users
            if not progress:
                progress = storage.upsert_user_progress(user_id, {})
            
            return jsonify(progress)
        
        except Exception as e:
            logger.error(f"Error fetching user progress: {e}")
            return jsonify({'message': 'Failed to fetch user progress'}), 500
    
    @app.route('/api/progress/targets', methods=['PUT'])
    @require_auth
    def update_targets():
        """Update user target settings"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            data = request.get_json()
            progress = storage.update_user_target_settings(user_id, data)
            
            return jsonify(progress)
        
        except Exception as e:
            logger.error(f"Error updating target settings: {e}")
            return jsonify({'message': 'Failed to update target settings'}), 500
    
    # Achievements routes
    @app.route('/api/achievements', methods=['GET'])
    @require_auth
    def get_achievements():
        """Get user achievements"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            achievements = storage.get_user_achievements(user_id)
            return jsonify(achievements)
        
        except Exception as e:
            logger.error(f"Error fetching achievements: {e}")
            return jsonify({'message': 'Failed to fetch achievements'}), 500
    
    @app.route('/api/achievements/check', methods=['POST'])
    @require_auth
    def check_achievements():
        """Check for new achievements"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            new_achievements = storage.check_and_unlock_achievements(user_id)
            return jsonify(new_achievements)
        
        except Exception as e:
            logger.error(f"Error checking achievements: {e}")
            return jsonify({'message': 'Failed to check achievements'}), 500
    
    # Onboarding route
    @app.route('/api/onboarding/complete', methods=['POST'])
    @require_auth
    def complete_onboarding():
        """Mark onboarding as completed"""
        try:
            user = get_current_user()
            user_id = user.get('claims', {}).get('sub')
            
            if not user_id:
                return jsonify({'message': 'User ID not found'}), 401
            
            storage.complete_onboarding(user_id)
            return jsonify({'success': True})
        
        except Exception as e:
            logger.error(f"Error completing onboarding: {e}")
            return jsonify({'message': 'Failed to complete onboarding'}), 500
    
    # Charity Effectiveness routes
    @app.route('/api/charities', methods=['GET'])
    def get_charities():
        """Get all charity effectiveness data"""
        try:
            charities = storage.get_all_charity_effectiveness()
            return jsonify(charities)
        
        except Exception as e:
            logger.error(f"Error fetching charity data: {e}")
            return jsonify({'message': 'Failed to fetch charity data'}), 500
    
    @app.route('/api/charities/<charity_key>', methods=['GET'])
    def get_charity(charity_key):
        """Get specific charity effectiveness data"""
        try:
            charity = storage.get_charity_effectiveness(charity_key)
            
            if not charity:
                return jsonify({'message': 'Charity not found'}), 404
            
            return jsonify(charity)
        
        except Exception as e:
            logger.error(f"Error fetching charity: {e}")
            return jsonify({'message': 'Failed to fetch charity'}), 500
    
    # Initialize charity data route
    @app.route('/api/init-charity-data', methods=['POST'])
    def init_charity_data():
        """Initialize charity effectiveness data"""
        try:
            charity_data = [
                {
                    'charityKey': 'givewell',
                    'charityName': 'GiveWell',
                    'category': 'Global Health',
                    'costPerLifeSaved': '5000',
                    'costPerQaly': '100',
                    'peopleHelpedPerDollar': '0.02',
                    'confidenceLevel': 'high',
                    'evidenceQuality': 'randomized_trial',
                    'dataSource': 'givewell',
                    'notes': 'Based on GiveWell top charity analysis with strong RCT evidence'
                },
                {
                    'charityKey': 'charity-water',
                    'charityName': 'charity: water',
                    'category': 'Water & Sanitation',
                    'costPerLifeSaved': '7500',
                    'costPerQaly': '150',
                    'peopleHelpedPerDollar': '0.015',
                    'confidenceLevel': 'medium',
                    'evidenceQuality': 'observational',
                    'dataSource': 'charity_evaluator',
                    'notes': 'Clean water access impact estimates based on WHO studies'
                },
                {
                    'charityKey': 'malala-fund',
                    'charityName': 'Malala Fund',
                    'category': 'Education',
                    'costPerLifeSaved': '12000',
                    'costPerQaly': '200',
                    'peopleHelpedPerDollar': '0.012',
                    'confidenceLevel': 'medium',
                    'evidenceQuality': 'observational',
                    'dataSource': 'proxy',
                    'notes': 'Education impact estimates based on long-term outcome studies'
                },
                {
                    'charityKey': 'partners-in-health',
                    'charityName': 'Partners In Health',
                    'category': 'Healthcare',
                    'costPerLifeSaved': '4500',
                    'costPerQaly': '90',
                    'peopleHelpedPerDollar': '0.025',
                    'confidenceLevel': 'high',
                    'evidenceQuality': 'randomized_trial',
                    'dataSource': 'givewell',
                    'notes': 'Strong evidence for healthcare interventions in developing countries'
                },
                {
                    'charityKey': 'against-malaria',
                    'charityName': 'Against Malaria Foundation',
                    'category': 'Disease Prevention',
                    'costPerLifeSaved': '4000',
                    'costPerQaly': '80',
                    'peopleHelpedPerDollar': '0.03',
                    'confidenceLevel': 'high',
                    'evidenceQuality': 'randomized_trial',
                    'dataSource': 'givewell',
                    'notes': 'Top-rated by GiveWell with excellent cost-effectiveness for bed nets'
                }
            ]
            
            for charity in charity_data:
                storage.upsert_charity_effectiveness(charity)
            
            return jsonify({
                'message': 'Charity effectiveness data initialized successfully',
                'count': len(charity_data)
            })
        
        except Exception as e:
            logger.error(f"Error initializing charity data: {e}")
            return jsonify({'message': 'Failed to initialize charity data'}), 500
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({'status': 'ok', 'message': 'Python Flask backend is running'})
