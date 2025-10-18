from datetime import datetime
from decimal import Decimal
from sqlalchemy import Column, String, Numeric, Text, Integer, Boolean, DateTime, ForeignKey, Index, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Session(Base):
    """Session storage for Flask-Session"""
    __tablename__ = 'sessions'
    
    sid = Column(String, primary_key=True)
    sess = Column(JSON, nullable=False)
    expire = Column(DateTime, nullable=False)
    
    __table_args__ = (
        Index('IDX_session_expire', 'expire'),
    )

class User(Base):
    """User model for Replit Auth"""
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True)
    first_name = Column('first_name', String)
    last_name = Column('last_name', String)
    profile_image_url = Column('profile_image_url', String)
    created_at = Column('created_at', DateTime, default=datetime.utcnow)
    updated_at = Column('updated_at', DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Donation(Base):
    """Donation records"""
    __tablename__ = 'donations'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column('user_id', String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    charity = Column(String, nullable=False)
    charity_category = Column('charity_category', String)
    donation_date = Column('donation_date', DateTime, nullable=False)
    notes = Column(Text)
    created_at = Column('created_at', DateTime, default=datetime.utcnow)

class ImpactCalculation(Base):
    """Impact calculations"""
    __tablename__ = 'impact_calculations'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column('user_id', String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    total_donated = Column('total_donated', Numeric(12, 2), nullable=False)
    lives_saved = Column('lives_saved', Numeric(8, 2), nullable=False)
    qualys_gained = Column('qualys_gained', Numeric(10, 2), nullable=False)
    calculated_at = Column('calculated_at', DateTime, default=datetime.utcnow)

class UserAchievement(Base):
    """User achievements and gamification"""
    __tablename__ = 'user_achievements'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column('user_id', String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    achievement_type = Column('achievement_type', String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    badge_icon = Column('badge_icon', String)
    badge_color = Column('badge_color', String, default='blue')
    unlocked_at = Column('unlocked_at', DateTime, default=datetime.utcnow)

class UserProgress(Base):
    """User progress and streaks"""
    __tablename__ = 'user_progress'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column('user_id', String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    current_streak = Column('current_streak', Integer, default=0)
    longest_streak = Column('longest_streak', Integer, default=0)
    last_donation_date = Column('last_donation_date', DateTime)
    total_donations = Column('total_donations', Integer, default=0)
    total_impact_score = Column('total_impact_score', Numeric(12, 2), default=Decimal('0'))
    
    # Impact-based targets (user-configurable)
    lives_saved_target = Column('lives_saved_target', Numeric(8, 2), default=Decimal('1.0'))
    qualys_gained_target = Column('qualys_gained_target', Numeric(10, 2), default=Decimal('10.0'))
    people_helped_target = Column('people_helped_target', Integer, default=100)
    total_donated_target = Column('total_donated_target', Numeric(10, 2), default=Decimal('1000.00'))
    
    # Target toggle settings
    track_lives_saved = Column('track_lives_saved', Boolean, default=True)
    track_qualys_gained = Column('track_qualys_gained', Boolean, default=True)
    track_people_helped = Column('track_people_helped', Boolean, default=True)
    track_total_donated = Column('track_total_donated', Boolean, default=True)
    onboarding_completed = Column('onboarding_completed', Boolean, default=False)
    updated_at = Column('updated_at', DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CharityEffectiveness(Base):
    """Charity effectiveness data for confidence meters"""
    __tablename__ = 'charity_effectiveness'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    charity_key = Column('charity_key', String, nullable=False, unique=True)
    charity_name = Column('charity_name', String, nullable=False)
    category = Column(String, nullable=False)
    cost_per_life_saved = Column('cost_per_life_saved', Numeric(10, 2))
    cost_per_qaly = Column('cost_per_qaly', Numeric(8, 2))
    people_helped_per_dollar = Column('people_helped_per_dollar', Numeric(6, 4))
    confidence_level = Column('confidence_level', String, nullable=False)
    evidence_quality = Column('evidence_quality', String)
    data_source = Column('data_source', String)
    notes = Column(Text)
    last_updated = Column('last_updated', DateTime, default=datetime.utcnow)
