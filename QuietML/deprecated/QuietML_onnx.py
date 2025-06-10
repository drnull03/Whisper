from joblib import load
import skl2onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType



model = load('./QuietML.joblib')


# Get the number of features from the TF-IDF vectorizer (you may have 1000+ features depending on the vocabulary)
num_features = len(model.named_steps['vectorizer'].get_feature_names_out())  # Adjust based on your pipeline

# Specify the input type (based on the number of features in your TF-IDF vectorizer)
initial_type = [('input', FloatTensorType([None, num_features]))]  # None = batch size, num_features = length of vector

# Convert the model to ONNX format
onnx_model = convert_sklearn(model, initial_types=initial_type)

# Save the ONNX model to a file
with open("QuietML.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print("ONNX model saved as 'spam_detector.onnx'")
