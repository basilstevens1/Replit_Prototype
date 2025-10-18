"""Storage layer for Impact Altruism application - handles all database operations and business logic"""
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Optional
from sqlalchemy import func, desc
from models import (
    User, Donation, ImpactCalculation, UserAchievement, 
    UserProgress, CharityEffectiveness
)

logger = logging.getLogger(__name__)

class Storage:
    def __init__(self, db):
        self.db = db
    
    # User operations
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        user = self.db.session.query(User).filter_by(id=user_id).first()
        if not user:
            return None
        return {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'profileImageUrl': user.profile_image_url
        }
    
    def upsert_user(self, user_data: Dict) -> Dict:
        """Create or update user"""
        user = self.db.session.query(User).filter_by(id=user_data['id']).first()
        
        if user:
            # Update existing user
            user.email = user_data.get('email')
            user.first_name = user_data.get('firstName')
            user.last_name = user_data.get('lastName')
            user.profile_image_url = user_data.get('profileImageUrl')
            user.updated_at = datetime.utcnow()
        else:
            # Create new user
            user = User(
                id=user_data['id'],
                email=user_data.get('email'),
                first_name=user_data.get('firstName'),
                last_name=user_data.get('lastName'),
                profile_image_url=user_data.get('profileImageUrl')
            )
            self.db.session.add(user)
        
        self.db.session.commit()
        return self.get_user(user.id)
    
    # Donation operations
    def create_donation(self, user_id: str, donation_data: Dict) -> Dict:
        """Create a new donation"""
        donation = Donation(
            user_id=user_id,
            amount=Decimal(str(donation_data['amount'])),
            charity=donation_data['charity'],
            charity_category=donation_data.get('charityCategory'),
            donation_date=donation_data['donationDate'],
            notes=donation_data.get('notes')
        )
        self.db.session.add(donation)
        self.db.session.commit()
        
        return self._donation_to_dict(donation)
    
    def get_user_donations(self, user_id: str) -> List[Dict]:
        """Get all donations for a user"""
        donations = (self.db.session.query(Donation)
                    .filter_by(user_id=user_id)
                    .order_by(desc(Donation.donation_date))
                    .all())
        
        return [self._donation_to_dict(d) for d in donations]
    
    def get_donation_by_id(self, donation_id: str) -> Optional[Dict]:
        """Get donation by ID"""
        donation = self.db.session.query(Donation).filter_by(id=donation_id).first()
        if not donation:
            return None
        return self._donation_to_dict(donation)
    
    def update_donation(self, donation_id: str, donation_data: Dict) -> Dict:
        """Update an existing donation"""
        donation = self.db.session.query(Donation).filter_by(id=donation_id).first()
        if not donation:
            raise ValueError(f"Donation {donation_id} not found")
        
        if 'amount' in donation_data:
            donation.amount = Decimal(str(donation_data['amount']))
        if 'charity' in donation_data:
            donation.charity = donation_data['charity']
        if 'charityCategory' in donation_data:
            donation.charity_category = donation_data['charityCategory']
        if 'donationDate' in donation_data:
            donation.donation_date = donation_data['donationDate']
        if 'notes' in donation_data:
            donation.notes = donation_data['notes']
        
        self.db.session.commit()
        return self._donation_to_dict(donation)
    
    def delete_donation(self, donation_id: str) -> None:
        """Delete a donation"""
        donation = self.db.session.query(Donation).filter_by(id=donation_id).first()
        if donation:
            self.db.session.delete(donation)
            self.db.session.commit()
    
    # Impact calculations
    def get_user_impact_stats(self, user_id: str) -> Dict:
        """Calculate impact statistics for a user"""
        donations = self.get_user_donations(user_id)
        
        total_donated = sum(float(d['amount']) for d in donations)
        donation_count = len(donations)
        
        total_lives_saved = Decimal('0')
        total_qualys_gained = Decimal('0')
        total_people_impacted = Decimal('0')
        weighted_confidence_score = Decimal('0')
        total_weight = Decimal('0')
        
        # Calculate impact based on charity-specific effectiveness data
        for donation in donations:
            amount = Decimal(str(donation['amount']))
            charity_key = donation['charity']
            
            effectiveness = self.get_charity_effectiveness(charity_key)
            
            if effectiveness:
                # Use charity-specific data
                if effectiveness['costPerLifeSaved']:
                    cost_per_life = Decimal(str(effectiveness['costPerLifeSaved']))
                    total_lives_saved += amount / cost_per_life
                
                if effectiveness['costPerQaly']:
                    cost_per_qaly = Decimal(str(effectiveness['costPerQaly']))
                    total_qualys_gained += amount / cost_per_qaly
                
                if effectiveness['peopleHelpedPerDollar']:
                    people_per_dollar = Decimal(str(effectiveness['peopleHelpedPerDollar']))
                    total_people_impacted += amount * people_per_dollar
                
                # Weight confidence score by donation amount
                confidence_scores = {'high': 3, 'medium': 2, 'low': 1}
                confidence_score = confidence_scores.get(effectiveness['confidenceLevel'], 2)
                weighted_confidence_score += Decimal(str(confidence_score)) * amount
                total_weight += amount
            else:
                # Fallback to general estimates
                total_lives_saved += amount / Decimal('5000')  # $5,000 per life saved
                total_qualys_gained += amount / Decimal('100')  # $100 per QALY
                total_people_impacted += amount / Decimal('50')  # $50 per person helped
                
                weighted_confidence_score += Decimal('2') * amount  # Medium confidence
                total_weight += amount
        
        # Calculate average confidence level
        avg_confidence_score = weighted_confidence_score / total_weight if total_weight > 0 else Decimal('2')
        confidence_level = 'high' if avg_confidence_score >= Decimal('2.5') else \
                          'medium' if avg_confidence_score >= Decimal('1.5') else 'low'
        
        return {
            'totalDonated': float(total_donated),
            'livesSaved': float(total_lives_saved),
            'qualysGained': float(total_qualys_gained),
            'donationCount': donation_count,
            'peopleImpacted': float(total_people_impacted),
            'confidenceLevel': confidence_level
        }
    
    # User Progress
    def get_user_progress(self, user_id: str) -> Optional[Dict]:
        """Get user progress"""
        progress = self.db.session.query(UserProgress).filter_by(user_id=user_id).first()
        if not progress:
            return None
        return self._progress_to_dict(progress)
    
    def upsert_user_progress(self, user_id: str, progress_data: Dict) -> Dict:
        """Create or update user progress"""
        progress = self.db.session.query(UserProgress).filter_by(user_id=user_id).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id)
            self.db.session.add(progress)
        
        # Update fields if provided
        for key, value in progress_data.items():
            if hasattr(progress, key):
                setattr(progress, key, value)
        
        progress.updated_at = datetime.utcnow()
        self.db.session.commit()
        
        return self._progress_to_dict(progress)
    
    def update_user_progress_after_donation(self, user_id: str, donation_amount: float) -> Dict:
        """Update user progress after a donation"""
        progress = self.db.session.query(UserProgress).filter_by(user_id=user_id).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id)
            self.db.session.add(progress)
        
        # Update donation count
        progress.total_donations = (progress.total_donations or 0) + 1
        
        # Update streak
        now = datetime.utcnow()
        if progress.last_donation_date:
            days_since_last = (now - progress.last_donation_date).days
            if days_since_last <= 1:
                progress.current_streak = (progress.current_streak or 0) + 1
            else:
                progress.current_streak = 1
        else:
            progress.current_streak = 1
        
        if (progress.current_streak or 0) > (progress.longest_streak or 0):
            progress.longest_streak = progress.current_streak
        
        progress.last_donation_date = now
        progress.updated_at = now
        
        self.db.session.commit()
        return self._progress_to_dict(progress)
    
    def update_user_target_settings(self, user_id: str, target_settings: Dict) -> Dict:
        """Update user target settings"""
        progress = self.db.session.query(UserProgress).filter_by(user_id=user_id).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id)
            self.db.session.add(progress)
        
        # Update target settings
        if 'livesSavedTarget' in target_settings:
            progress.lives_saved_target = Decimal(str(target_settings['livesSavedTarget']))
        if 'qualysGainedTarget' in target_settings:
            progress.qualys_gained_target = Decimal(str(target_settings['qualysGainedTarget']))
        if 'peopleHelpedTarget' in target_settings:
            progress.people_helped_target = target_settings['peopleHelpedTarget']
        if 'totalDonatedTarget' in target_settings:
            progress.total_donated_target = Decimal(str(target_settings['totalDonatedTarget']))
        if 'trackLivesSaved' in target_settings:
            progress.track_lives_saved = target_settings['trackLivesSaved']
        if 'trackQualysGained' in target_settings:
            progress.track_qualys_gained = target_settings['trackQualysGained']
        if 'trackPeopleHelped' in target_settings:
            progress.track_people_helped = target_settings['trackPeopleHelped']
        if 'trackTotalDonated' in target_settings:
            progress.track_total_donated = target_settings['trackTotalDonated']
        
        progress.updated_at = datetime.utcnow()
        self.db.session.commit()
        
        return self._progress_to_dict(progress)
    
    def complete_onboarding(self, user_id: str) -> None:
        """Mark onboarding as completed"""
        progress = self.db.session.query(UserProgress).filter_by(user_id=user_id).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id)
            self.db.session.add(progress)
        
        progress.onboarding_completed = True
        progress.updated_at = datetime.utcnow()
        self.db.session.commit()
    
    # Achievements
    def get_user_achievements(self, user_id: str) -> List[Dict]:
        """Get all user achievements"""
        achievements = (self.db.session.query(UserAchievement)
                       .filter_by(user_id=user_id)
                       .order_by(desc(UserAchievement.unlocked_at))
                       .all())
        
        return [self._achievement_to_dict(a) for a in achievements]
    
    def unlock_achievement(self, user_id: str, achievement_data: Dict) -> Dict:
        """Unlock a new achievement"""
        achievement = UserAchievement(
            user_id=user_id,
            achievement_type=achievement_data['achievementType'],
            title=achievement_data['title'],
            description=achievement_data.get('description'),
            badge_icon=achievement_data.get('badgeIcon', 'award'),
            badge_color=achievement_data.get('badgeColor', 'blue')
        )
        self.db.session.add(achievement)
        self.db.session.commit()
        
        return self._achievement_to_dict(achievement)
    
    def check_and_unlock_achievements(self, user_id: str) -> List[Dict]:
        """Check and unlock any new achievements"""
        new_achievements = []
        
        # Get user progress
        progress = self.get_user_progress(user_id)
        if not progress:
            return []
        
        # Get existing achievements
        existing_achievements = self.get_user_achievements(user_id)
        existing_types = {a['achievementType'] for a in existing_achievements}
        
        # Check for first donation
        if progress['totalDonations'] >= 1 and 'first_donation' not in existing_types:
            achievement = self.unlock_achievement(user_id, {
                'achievementType': 'first_donation',
                'title': 'First Step',
                'description': 'Made your first donation',
                'badgeIcon': 'heart',
                'badgeColor': 'red'
            })
            new_achievements.append(achievement)
        
        # Check for donation milestones
        milestones = [(5, 'five_donations'), (10, 'ten_donations'), (25, 'twentyfive_donations'), (50, 'fifty_donations')]
        for count, achievement_type in milestones:
            if progress['totalDonations'] >= count and achievement_type not in existing_types:
                achievement = self.unlock_achievement(user_id, {
                    'achievementType': achievement_type,
                    'title': f'{count} Donations',
                    'description': f'Made {count} donations',
                    'badgeIcon': 'trophy',
                    'badgeColor': 'gold'
                })
                new_achievements.append(achievement)
        
        # Check for streak achievements
        streak_milestones = [(3, 'streak_3'), (7, 'streak_7'), (30, 'streak_30')]
        for days, achievement_type in streak_milestones:
            if (progress['currentStreak'] or 0) >= days and achievement_type not in existing_types:
                achievement = self.unlock_achievement(user_id, {
                    'achievementType': achievement_type,
                    'title': f'{days} Day Streak',
                    'description': f'Donated for {days} consecutive days',
                    'badgeIcon': 'zap',
                    'badgeColor': 'yellow'
                })
                new_achievements.append(achievement)
        
        return new_achievements
    
    # Charity Effectiveness
    def get_charity_effectiveness(self, charity_key: str) -> Optional[Dict]:
        """Get charity effectiveness data"""
        charity = self.db.session.query(CharityEffectiveness).filter_by(charity_key=charity_key).first()
        if not charity:
            return None
        return self._charity_to_dict(charity)
    
    def get_all_charity_effectiveness(self) -> List[Dict]:
        """Get all charity effectiveness data"""
        charities = self.db.session.query(CharityEffectiveness).all()
        return [self._charity_to_dict(c) for c in charities]
    
    def upsert_charity_effectiveness(self, charity_data: Dict) -> Dict:
        """Create or update charity effectiveness data"""
        charity = self.db.session.query(CharityEffectiveness).filter_by(
            charity_key=charity_data['charityKey']
        ).first()
        
        if charity:
            # Update existing
            charity.charity_name = charity_data['charityName']
            charity.category = charity_data['category']
            charity.cost_per_life_saved = Decimal(str(charity_data['costPerLifeSaved'])) if charity_data.get('costPerLifeSaved') else None
            charity.cost_per_qaly = Decimal(str(charity_data['costPerQaly'])) if charity_data.get('costPerQaly') else None
            charity.people_helped_per_dollar = Decimal(str(charity_data['peopleHelpedPerDollar'])) if charity_data.get('peopleHelpedPerDollar') else None
            charity.confidence_level = charity_data['confidenceLevel']
            charity.evidence_quality = charity_data.get('evidenceQuality')
            charity.data_source = charity_data.get('dataSource')
            charity.notes = charity_data.get('notes')
            charity.last_updated = datetime.utcnow()
        else:
            # Create new
            charity = CharityEffectiveness(
                charity_key=charity_data['charityKey'],
                charity_name=charity_data['charityName'],
                category=charity_data['category'],
                cost_per_life_saved=Decimal(str(charity_data['costPerLifeSaved'])) if charity_data.get('costPerLifeSaved') else None,
                cost_per_qaly=Decimal(str(charity_data['costPerQaly'])) if charity_data.get('costPerQaly') else None,
                people_helped_per_dollar=Decimal(str(charity_data['peopleHelpedPerDollar'])) if charity_data.get('peopleHelpedPerDollar') else None,
                confidence_level=charity_data['confidenceLevel'],
                evidence_quality=charity_data.get('evidenceQuality'),
                data_source=charity_data.get('dataSource'),
                notes=charity_data.get('notes')
            )
            self.db.session.add(charity)
        
        self.db.session.commit()
        return self._charity_to_dict(charity)
    
    # Helper methods to convert DB models to dicts
    def _donation_to_dict(self, donation: Donation) -> Dict:
        """Convert donation model to dict"""
        return {
            'id': donation.id,
            'userId': donation.user_id,
            'amount': str(donation.amount),
            'charity': donation.charity,
            'charityCategory': donation.charity_category,
            'donationDate': donation.donation_date.isoformat(),
            'notes': donation.notes,
            'createdAt': donation.created_at.isoformat() if donation.created_at else None
        }
    
    def _progress_to_dict(self, progress: UserProgress) -> Dict:
        """Convert progress model to dict"""
        return {
            'id': progress.id,
            'userId': progress.user_id,
            'currentStreak': progress.current_streak,
            'longestStreak': progress.longest_streak,
            'lastDonationDate': progress.last_donation_date.isoformat() if progress.last_donation_date else None,
            'totalDonations': progress.total_donations,
            'totalImpactScore': str(progress.total_impact_score),
            'livesSavedTarget': str(progress.lives_saved_target),
            'qualysGainedTarget': str(progress.qualys_gained_target),
            'peopleHelpedTarget': progress.people_helped_target,
            'totalDonatedTarget': str(progress.total_donated_target),
            'trackLivesSaved': progress.track_lives_saved,
            'trackQualysGained': progress.track_qualys_gained,
            'trackPeopleHelped': progress.track_people_helped,
            'trackTotalDonated': progress.track_total_donated,
            'onboardingCompleted': progress.onboarding_completed,
            'updatedAt': progress.updated_at.isoformat() if progress.updated_at else None
        }
    
    def _achievement_to_dict(self, achievement: UserAchievement) -> Dict:
        """Convert achievement model to dict"""
        return {
            'id': achievement.id,
            'userId': achievement.user_id,
            'achievementType': achievement.achievement_type,
            'title': achievement.title,
            'description': achievement.description,
            'badgeIcon': achievement.badge_icon,
            'badgeColor': achievement.badge_color,
            'unlockedAt': achievement.unlocked_at.isoformat() if achievement.unlocked_at else None
        }
    
    def _charity_to_dict(self, charity: CharityEffectiveness) -> Dict:
        """Convert charity model to dict"""
        return {
            'id': charity.id,
            'charityKey': charity.charity_key,
            'charityName': charity.charity_name,
            'category': charity.category,
            'costPerLifeSaved': str(charity.cost_per_life_saved) if charity.cost_per_life_saved else None,
            'costPerQaly': str(charity.cost_per_qaly) if charity.cost_per_qaly else None,
            'peopleHelpedPerDollar': str(charity.people_helped_per_dollar) if charity.people_helped_per_dollar else None,
            'confidenceLevel': charity.confidence_level,
            'evidenceQuality': charity.evidence_quality,
            'dataSource': charity.data_source,
            'notes': charity.notes,
            'lastUpdated': charity.last_updated.isoformat() if charity.last_updated else None
        }
