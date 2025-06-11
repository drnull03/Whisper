from flask import Flask, request, jsonify
from joblib import load

# Initialize Flask app
app = Flask(__name__)

# Load the spam detection model
clf_loaded = load('./QuietML.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the email text from the incoming request
    email_text = request.json.get('email_text')

    if not email_text:
        return jsonify({'error': 'No email_text provided'}), 400

    # Make the prediction using the spam detector model
    prediction = clf_loaded.predict([email_text])
    probabilities = clf_loaded.predict_proba([email_text])
    # Return the result as JSON
    result = "Spam" if prediction == 1 else "Ham"
    if prediction==1:
        probabilities=probabilities[0][1]
    else:
        probabilities=probabilities[0][0]

    return jsonify({'prediction': result,'probability': probabilities})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
