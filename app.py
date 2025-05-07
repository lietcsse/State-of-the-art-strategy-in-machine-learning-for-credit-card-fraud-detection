from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
import joblib
import numpy as np
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime
import time
import json

# Import the fraud detection functions
from fraud_detection import load_model, analyze_new_dataset

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure file upload settings
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max

# Default paths for model and scaler
MODEL_PATH = 'Random Forest_model.pkl'  # Change this to your saved model name
SCALER_PATH = 'scaler.pkl'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_time_period(hour):
    """Convert hour to time period for frontend display."""
    if 0 <= hour < 4:
        return "12am-4am"
    elif 4 <= hour < 8:
        return "4am-8am"
    elif 8 <= hour < 12:
        return "8am-12pm"
    elif 12 <= hour < 16:
        return "12pm-4pm"
    elif 16 <= hour < 20:
        return "4pm-8pm"
    else:
        return "8pm-12am"

def format_amount_range(amount):
    """Convert amount to range for frontend display."""
    if amount < 100:
        return "$0-$100"
    elif 100 <= amount < 500:
        return "$100-$500"
    elif 500 <= amount < 1000:
        return "$500-$1000"
    else:
        return ">$1000"

def generate_analysis_data(results_df):
    """Generate analysis data in the format expected by frontend."""
    
    total_transactions = len(results_df)
    
    # Calculate both predicted and actual fraud statistics if 'Class' column exists
    predicted_fraudulent = int(results_df['Predicted_Fraud'].sum())
    predicted_legitimate = total_transactions - predicted_fraudulent
    predicted_fraud_percentage = round((predicted_fraudulent / total_transactions) * 100, 2) if total_transactions > 0 else 0
    
    # Add actual fraud statistics if 'Class' column exists
    actual_statistics = {}
    if 'Class' in results_df.columns:
        actual_fraudulent = int(results_df['Class'].sum())
        actual_legitimate = total_transactions - actual_fraudulent
        actual_fraud_percentage = round((actual_fraudulent / total_transactions) * 100, 2)
        actual_statistics = {
            "actualFraudulentTransactions": actual_fraudulent,
            "actualLegitimateTransactions": actual_legitimate,
            "actualFraudPercentage": actual_fraud_percentage
        }
    
    # Calculate average and max amount if 'Amount' column exists
    if 'Amount' in results_df.columns:
        average_amount = round(results_df['Amount'].mean(), 2)
        max_amount = round(results_df['Amount'].max(), 2)
    else:
        average_amount = 0
        max_amount = 0
    
    # Generate fraud by time data
    if 'Time' in results_df.columns:
        # Assuming Time is in seconds from midnight
        results_df['Hour'] = (results_df['Time'] / 3600) % 24
        results_df['TimePeriod'] = results_df['Hour'].apply(format_time_period)
        
        fraud_by_time = results_df[results_df['Predicted_Fraud'] == 1].groupby('TimePeriod').size().reset_index()
        fraud_by_time.columns = ['name', 'count']
        
        # Ensure all time periods are present
        all_periods = ["12am-4am", "4am-8am", "8am-12pm", "12pm-4pm", "4pm-8pm", "8pm-12am"]
        fraud_by_time_dict = dict(zip(fraud_by_time['name'], fraud_by_time['count']))
        fraud_by_time_data = [{"name": period, "count": fraud_by_time_dict.get(period, 0)} for period in all_periods]
    else:
        # Mock time data if Time column doesn't exist
        fraud_by_time_data = [
            {"name": "12am-4am", "count": predicted_fraudulent // 6},
            {"name": "4am-8am", "count": predicted_fraudulent // 6},
            {"name": "8am-12pm", "count": predicted_fraudulent // 6},
            {"name": "12pm-4pm", "count": predicted_fraudulent // 6},
            {"name": "4pm-8pm", "count": predicted_fraudulent // 6},
            {"name": "8pm-12am", "count": predicted_fraudulent // 6}
        ]
    
    # Generate fraud by amount data
    if 'Amount' in results_df.columns:
        results_df['AmountRange'] = results_df['Amount'].apply(format_amount_range)
        fraud_by_amount = results_df[results_df['Predicted_Fraud'] == 1].groupby('AmountRange').size().reset_index()
        fraud_by_amount.columns = ['name', 'value']
        
        # Ensure all amount ranges are present
        all_ranges = ["$0-$100", "$100-$500", "$500-$1000", ">$1000"]
        fraud_by_amount_dict = dict(zip(fraud_by_amount['name'], fraud_by_amount['value']))
        fraud_by_amount_data = [{"name": range_, "value": fraud_by_amount_dict.get(range_, 0)} for range_ in all_ranges]
    else:
        # Mock amount data if Amount column doesn't exist
        fraud_by_amount_data = [
            {"name": "$0-$100", "value": predicted_fraudulent // 4},
            {"name": "$100-$500", "value": predicted_fraudulent // 4},
            {"name": "$500-$1000", "value": predicted_fraudulent // 4},
            {"name": ">$1000", "value": predicted_fraudulent // 4}
        ]
    
    # Generate recent fraudulent transactions
    fraud_transactions = results_df[results_df['Predicted_Fraud'] == 1]
    
    recent_fraudulent_transactions = []
    if len(fraud_transactions) > 0:
        # Sort by probability to get the most likely fraudulent transactions
        sorted_fraud = fraud_transactions.sort_values('Fraud_Probability', ascending=False)
        
        # Take top 5 or fewer transactions
        for i, (_, row) in enumerate(sorted_fraud.head(5).iterrows()):
            transaction = {
                "id": f"ft{i+1}",
                "amount": float(row.get('Amount', 100)),
                "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # Use current date if not available
                "description": row.get('Merchant_Category', 'Transaction') if 'Merchant_Category' in row else 'Unknown Merchant'
            }
            recent_fraudulent_transactions.append(transaction)
    
    # If no fraud transactions, create empty list
    if not recent_fraudulent_transactions:
        recent_fraudulent_transactions = []

    # Update the analysis_data dictionary to include both predicted and actual statistics
    analysis_data = {
        "totalTransactions": total_transactions,
        "predictedFraudulentTransactions": predicted_fraudulent,
        "predictedLegitimateTransactions": predicted_legitimate,
        "predictedFraudPercentage": predicted_fraud_percentage,
        **actual_statistics,  # Include actual statistics if available
        "averageAmount": average_amount,
        "maxAmount": max_amount,
        "fraudByTimeData": fraud_by_time_data,
        "fraudByAmountData": fraud_by_amount_data,
        "recentFraudulentTransactions": recent_fraudulent_transactions
    }
    
    return analysis_data

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running."""
    return jsonify({"status": "online", "message": "Fraud detection API is operational"})

@app.route('/api/analyze', methods=['POST'])
def analyze_transactions():
    """Endpoint to analyze uploaded CSV transaction data."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        # Save uploaded file to temp directory
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Check if model and scaler exist
            if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
                return jsonify({
                    "error": "Model files not found. Please train the model first.",
                    "details": f"Looking for {MODEL_PATH} and {SCALER_PATH}"
                }), 500
            
            # Load model and scaler
            model, scaler = load_model(MODEL_PATH, SCALER_PATH)
            
            # Process the uploaded file
            results_df = analyze_new_dataset(filepath, model, scaler)
            
            # Generate analysis data for frontend
            analysis_data = generate_analysis_data(results_df)
            
            # Clean up the temp file
            os.remove(filepath)
            
            return jsonify({
                "success": True,
                "message": "File analyzed successfully",
                "data": analysis_data
            })
            
        except Exception as e:
            # Clean up temp file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
                
            return jsonify({
                "error": "Error analyzing file",
                "details": str(e)
            }), 500
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/train', methods=['POST'])
def train_model():
    """Endpoint to train a new fraud detection model."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        # Save uploaded file to temp directory
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Import main function to train model from fraud_detection.py
            from fraud_detection import load_csv_data, explore_data, preprocess_data, handle_imbalance, train_and_evaluate_models, analyze_feature_importance, tune_best_model, visualize_model_comparison, save_best_model
            
            # Load the data from CSV
            df = load_csv_data(filepath)
            
            # Explore the data
            df = explore_data(df)
            
            # Preprocess the data
            X_train, X_test, y_train, y_test, scaler = preprocess_data(df)
            
            # Handle imbalanced data
            X_train_resampled, y_train_resampled = handle_imbalance(X_train, y_train)
            
            # Train and evaluate models
            results = train_and_evaluate_models(X_train_resampled, X_test, y_train_resampled, y_test)
            
            # Find the best model based on AUC
            best_model_name = max(results, key=lambda x: results[x]['auc'])
            best_auc = results[best_model_name]['auc']
            
            # Analyze feature importance for tree-based models
            if best_model_name in ['Random Forest', 'XGBoost', 'Decision Tree']:
                feature_importances = analyze_feature_importance(X_train, results[best_model_name]['model'], best_model_name)
            
            # Tune the best model
            best_tuned_model = tune_best_model(X_train_resampled, y_train_resampled, best_model_name)
            
            # Visualize model comparison
            visualize_model_comparison(results, y_test)
            
            # Save the best model
            save_best_model(best_tuned_model, scaler, best_model_name)
            
            # Clean up the temp file
            os.remove(filepath)
            
            return jsonify({
                "success": True,
                "message": "Model trained successfully",
                "model_name": best_model_name,
                "auc_score": float(best_auc)
            })
            
        except Exception as e:
            # Clean up temp file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
                
            return jsonify({
                "error": "Error training model",
                "details": str(e)
            }), 500
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/models', methods=['GET'])
def list_models():
    """List available trained models."""
    models = []
    
    # Look for .pkl files that might be models
    for file in os.listdir('.'):
        if file.endswith('_model.pkl'):
            model_name = file.replace('_model.pkl', '')
            models.append({
                "name": model_name,
                "file": file,
                "created": os.path.getctime(file)
            })
    
    return jsonify({"models": models})

@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve the frontend static files or show API running message."""
    try:
        return send_from_directory('../frontend/dist', 'index.html')
    except:
        return "Fraud Detection Backend API is running"

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    """Serve static files from the frontend build."""
    return send_from_directory('../frontend/dist', path)

if __name__ == '__main__':
    # Check for model files
    if not os.path.exists(MODEL_PATH):
        print(f"Warning: Model file {MODEL_PATH} not found. Please train a model first.")
    
    if not os.path.exists(SCALER_PATH):
        print(f"Warning: Scaler file {SCALER_PATH} not found. Please train a model first.")
        
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)