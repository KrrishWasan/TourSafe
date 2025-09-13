#!/usr/bin/env python3
"""
Startup script for the Safety Score API Server
Run this script to start the Flask API server for safety score calculations
"""

import os
import sys
import subprocess

def check_requirements():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_cors
        import pandas
        import numpy
        import sklearn
        import joblib
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please install requirements using: pip install -r requirements.txt")
        return False

def check_model_files():
    """Check if model files exist"""
    model_files = [
        "SIH-ML-Shlok/safety score model/best_model.pkl",
        "SIH-ML-Shlok/safety score model/best_model_label_encoders.pkl",
        "SIH-ML-Shlok/safety score model/best_model_scaler.pkl",
        "SIH-ML-Shlok/safety score model/best_model_metadata.json",
        "SIH-ML-Shlok/safety score model/final.csv"
    ]
    
    missing_files = []
    for file_path in model_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing model files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        print("\nPlease ensure all model files are in the correct location.")
        return False
    
    print("✅ All model files found")
    return True

def main():
    """Main function to start the API server"""
    print("🚀 Starting Safety Score API Server...")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check model files
    if not check_model_files():
        sys.exit(1)
    
    print("\n🌐 Starting Flask server on http://localhost:5000")
    print("📊 API endpoints:")
    print("   - POST /api/safety-score - Calculate safety scores for destinations")
    print("   - GET  /api/safety-score/<user_id> - Get user safety score")
    print("   - GET  /health - Health check")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask server
    try:
        from safety_score_api import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
