from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import json
import logging
import os
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variables to store loaded model and data
model = None
label_encoders = None
scaler = None
metadata = None
crime_data = None

def load_model_and_data():
    """Load the safety score model and crime data"""
    global model, label_encoders, scaler, metadata, crime_data
    
    try:
        # Load model and preprocessors
        model = joblib.load("SIH-ML-Shlok/safety score model/best_model.pkl")
        label_encoders = joblib.load("SIH-ML-Shlok/safety score model/best_model_label_encoders.pkl")
        scaler = joblib.load("SIH-ML-Shlok/safety score model/best_model_scaler.pkl")
        
        with open("SIH-ML-Shlok/safety score model/best_model_metadata.json", 'r') as f:
            metadata = json.load(f)
        
        # Load crime data
        crime_data = pd.read_csv("SIH-ML-Shlok/safety score model/final.csv")
        
        # Clean the data
        required_cols = ['City', 'State', 'Zone', 'Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score', 'Google review rating', 'Name', 'Type', 'Best Time to visit']
        
        # Ensure categorical columns are strings
        for col in ['City', 'State', 'Zone', 'Name', 'Type', 'Best Time to visit']:
            crime_data[col] = crime_data[col].astype(str).str.strip()
        
        # Ensure numerical columns are floats
        for col in ['Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score', 'Google review rating']:
            invalid_rows = crime_data[crime_data[col].astype(str).str.contains('[^0-9.]', na=False)]
            if not invalid_rows.empty:
                median_value = pd.to_numeric(crime_data[col], errors='coerce').median()
                crime_data.loc[crime_data[col].astype(str).str.contains('[^0-9.]', na=False), col] = median_value
            crime_data[col] = pd.to_numeric(crime_data[col], errors='coerce')
        
        # Drop rows with missing required columns
        crime_data = crime_data.dropna(subset=required_cols)
        
        logger.info("Model and data loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model or data: {str(e)}")
        return False

def get_location_data(city, name, crime_data):
    """Fetch location data from crime dataset"""
    try:
        df_city = crime_data[crime_data['City'].str.lower() == str(city).lower()]
        if df_city.empty:
            default_data = {
                'State': 'Unknown',
                'Zone': 'Unknown',
                'Murder': crime_data['Murder'].median(),
                'Rape': crime_data['Rape'].median(),
                'Theft': crime_data['Theft'].median(),
                'Robbery': crime_data['Robbery'].median(),
                'Composite_Crime_Score': crime_data['Composite_Crime_Score'].median(),
                'Google review rating': np.nan,
                'Type': None,
                'Best Time to visit': None
            }
            logger.warning(f"No city match for {city}. Using overall medians for crime stats.")
            return default_data

        # 1) Exact City+Name match
        if name:
            df_exact = df_city[df_city['Name'].str.lower().str.strip() == str(name).lower().strip()]
            if not df_exact.empty:
                row = df_exact.iloc[0]
                data = row[['State', 'Zone', 'Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score', 'Google review rating', 'Type', 'Best Time to visit']].to_dict()
                logger.info(f"Exact City+Name match found for {city} - {name}")
                return data

        # 2) Partial Name contains within the city
        if name:
            df_partial = df_city[df_city['Name'].str.lower().str.contains(str(name).lower().strip(), na=False)]
            if not df_partial.empty:
                row = df_partial.iloc[0]
                data = row[['State', 'Zone', 'Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score', 'Google review rating', 'Type', 'Best Time to visit']].to_dict()
                logger.info(f"Partial Name match in {city} for {name}")
                return data

        # 3) Fallback: use first city row for crime stats
        row = df_city.iloc[0]
        data = {
            'State': row['State'],
            'Zone': row['Zone'],
            'Murder': row['Murder'],
            'Rape': row['Rape'],
            'Theft': row['Theft'],
            'Robbery': row['Robbery'],
            'Composite_Crime_Score': row['Composite_Crime_Score'],
            'Google review rating': np.nan,
            'Type': None,
            'Best Time to visit': None
        }
        logger.info(f"City-only fallback for {city}")
        return data
        
    except Exception as e:
        logger.error(f"Error fetching location data for {city}, {name}: {str(e)}")
        raise

def build_runtime_risk_features(input_data, risk_meta):
    """Build risk features for runtime prediction"""
    try:
        time_key = str(input_data.get('Best Time to visit', '')).strip()
        type_key = str(input_data.get('Type', '')).strip()
        name_text = str(input_data.get('Name', '')).lower()

        unseen_penalty = risk_meta.get('unseen_penalty', 10.0)
        time_to_risk = risk_meta.get('time_to_risk', {})
        type_to_risk = risk_meta.get('type_to_risk', {})
        risky_terms = risk_meta.get('keyword_risky_terms', [])

        time_risk = float(time_to_risk.get(time_key, unseen_penalty if time_key.lower() == 'night' else 0.0))
        type_risk = float(type_to_risk.get(type_key, 0.0))
        keyword_risk = unseen_penalty if any(term in name_text for term in risky_terms) else 0.0

        return time_risk, type_risk, keyword_risk
    except Exception as e:
        logger.error(f"Error building runtime risk features: {str(e)}")
        return 0.0, 0.0, 0.0

def preprocess_input(input_data, label_encoders, scaler, metadata):
    """Preprocess input data for prediction"""
    try:
        df_input = pd.DataFrame([input_data])

        # Inject risk features using training-time mappings
        risk_meta = metadata.get('risk_mappings', {})
        time_risk, type_risk, keyword_risk = build_runtime_risk_features(input_data, risk_meta)
        df_input['Time_Risk'] = time_risk
        df_input['Type_Risk'] = type_risk
        df_input['Keyword_Risk'] = keyword_risk
        
        # Encode categorical features
        categorical_cols = ['Zone', 'State', 'City', 'Type', 'Best Time to visit']
        for col in categorical_cols:
            if col in label_encoders:
                try:
                    df_input[col] = df_input[col].astype(str)
                    df_input[col] = label_encoders[col].transform(df_input[col])
                except ValueError as e:
                    logger.warning(f"Encoding error for {col}: {str(e)}. Defaulting to first known class.")
                    df_input[col] = label_encoders[col].classes_[0]

        # Scale numerical features
        numerical_cols = [
            'Google review rating', 'Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score',
            'Time_Risk', 'Type_Risk', 'Keyword_Risk'
        ]
        df_input[numerical_cols] = scaler.transform(df_input[numerical_cols])

        # Select features
        features = metadata['features_used']
        X = df_input[features]
        return X
    except Exception as e:
        logger.error(f"Error preprocessing input: {str(e)}")
        raise

def classify_safety(score):
    """Classify safety level based on score"""
    if score >= 75:
        return "Safe", "This location is generally safe for tourists. Enjoy your visit with standard precautions!"
    elif score >= 55:
        return "Moderately Safe", "This location is moderately safe. Exercise caution, especially during specific times or areas."
    else:
        return "Unsafe", "This location has safety concerns. Avoid visiting unless necessary, and take strict precautions."

def predict_safety_score(input_data, model, label_encoders, scaler, metadata, crime_data):
    """Predict safety score for a single location"""
    try:
        X = preprocess_input(input_data, label_encoders, scaler, metadata)
        raw_score = float(model.predict(X)[0])

        # Proportional, crime-aware attenuation
        risk_meta = metadata.get('risk_mappings', {})
        time_str = str(input_data.get('Best Time to visit', '')).lower()
        type_str = str(input_data.get('Type', '')).lower()
        name_str = str(input_data.get('Name', '')).lower()

        is_night = 'night' in time_str
        risky_tokens = ['slum', 'red light', 'ghetto']
        is_slum_like = any(tok in type_str for tok in risky_tokens) or any(tok in name_str for tok in risky_tokens)

        # Crime factor from dataset distribution
        crime_min = float(crime_data['Composite_Crime_Score'].min())
        crime_max = float(crime_data['Composite_Crime_Score'].max())
        comp = float(input_data.get('Composite_Crime_Score', crime_min))
        crime_factor = 0.0 if crime_max == crime_min else (comp - crime_min) / (crime_max - crime_min)
        crime_factor = max(0.0, min(1.0, crime_factor))

        # Multiplicative attenuation capped at 60%
        base_att = 0.0
        if is_night:
            base_att += 0.20  # 20% at night
        if is_slum_like:
            base_att += 0.25  # 25% for slum-like context
        # Scale attenuation with crime factor (0.5x to 1.0x)
        att = min(0.60, base_att * (0.5 + 0.5 * crime_factor))

        # Small absolute penalty for severe contexts
        abs_penalty = 0.0
        if is_night:
            abs_penalty += 5.0
        if is_slum_like:
            abs_penalty += 7.5

        adjusted = raw_score * (1.0 - att) - abs_penalty
        # Keep within bounds and avoid hard zero unless extremely low
        predicted_score = round(max(5.0, min(adjusted, 100.0)), 2)
        classification, message = classify_safety(predicted_score)
        
        logger.info(f"Predicted raw: {raw_score}, att: {att:.2f}, abs_penalty: {abs_penalty:.2f}, final: {predicted_score}")
        return predicted_score, classification, message
    except Exception as e:
        logger.error(f"Error predicting safety score: {str(e)}")
        raise

@app.route('/api/safety-score', methods=['POST'])
def calculate_safety_scores():
    """Calculate safety scores for multiple destinations"""
    try:
        if not model or not crime_data is not None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.get_json()
        destinations = data.get('destinations', [])
        
        if not destinations:
            return jsonify({'error': 'No destinations provided'}), 400
        
        results = []
        total_score = 0
        
        for dest in destinations:
            # Map React component fields to model fields
            input_data = {
                'City': dest.get('city', ''),
                'Name': dest.get('location', ''),
                'Type': dest.get('type', ''),
                'Best Time to visit': dest.get('time', ''),
                'Google review rating': 4.0  # Default rating
            }
            
            # Fetch location-specific data
            fetched = get_location_data(input_data['City'], input_data['Name'], crime_data)
            
            # Merge data
            for k in ['State', 'Zone', 'Murder', 'Rape', 'Theft', 'Robbery', 'Composite_Crime_Score']:
                input_data[k] = fetched[k]
            
            # Use fetched rating if available
            if not pd.isna(fetched.get('Google review rating', np.nan)):
                input_data['Google review rating'] = fetched['Google review rating']
            
            # Use fetched Type/Time if user left blank
            if (not input_data.get('Type')) and fetched.get('Type'):
                input_data['Type'] = fetched['Type']
            if (not input_data.get('Best Time to visit')) and fetched.get('Best Time to visit'):
                input_data['Best Time to visit'] = fetched['Best Time to visit']
            
            # Predict safety score
            score, classification, message = predict_safety_score(input_data, model, label_encoders, scaler, metadata, crime_data)
            
            results.append({
                'city': dest.get('city', ''),
                'location': dest.get('location', ''),
                'type': dest.get('type', ''),
                'time': dest.get('time', ''),
                'safety_score': score,
                'classification': classification,
                'message': message,
                'state': fetched.get('State', 'Unknown'),
                'zone': fetched.get('Zone', 'Unknown')
            })
            
            total_score += score
        
        # Calculate overall safety score
        overall_score = round(total_score / len(destinations), 2)
        overall_classification, overall_message = classify_safety(overall_score)
        
        return jsonify({
            'overall_safety_score': overall_score,
            'overall_classification': overall_classification,
            'overall_message': overall_message,
            'destinations': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error calculating safety scores: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/safety-score/<user_id>', methods=['GET'])
def get_user_safety_score(user_id):
    """Get safety score for a specific user"""
    try:
        # This would typically fetch from a database
        # For now, return a default response
        return jsonify({
            'user_id': user_id,
            'safety_score': 85,
            'classification': 'Safe',
            'message': 'User safety score retrieved successfully',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error getting user safety score: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'data_loaded': crime_data is not None,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Load model and data on startup
    if load_model_and_data():
        logger.info("Starting safety score API server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("Failed to load model or data. Exiting...")
