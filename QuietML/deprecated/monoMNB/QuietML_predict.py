from joblib import load
import sys
clf_loaded = load('./QuietML.joblib')  # Load the model


# Defining a function for the Email Spam Detection System
def detect_spam(email_text):
    # Load the trained classifier (clf) here
    # Replace the comment with your code to load the classifier model

    # Make a prediction using the loaded classifier
    prediction = clf_loaded.predict([email_text])

    if prediction == 0:
        return "This is a Ham Email!"
    else:
        return "This is a Spam Email!"


# Example of how to use the function
#sample_email = 'hello want a free prize , you gonna have fun with this prize???'
#result = detect_spam(sample_email)
#print(result)
if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("Please provide an email text to classify.")
		sys.exit(1)
    
	email_input = sys.argv[1]
	result = detect_spam(email_input)
	print(result)
