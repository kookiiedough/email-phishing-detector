import flask
from flask import request, jsonify
import openai
import re
import os

app = flask.Flask(__name__)

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_email(email_content):
    # Basic checks
    suspicious_elements = []
    
    # Check for suspicious links
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', email_content)
    if links:
        suspicious_elements.append("Suspicious links detected")
    
    # Check for urgency keywords
    urgency_keywords = ['urgent', 'immediate action', 'account suspended']
    if any(keyword in email_content.lower() for keyword in urgency_keywords):
        suspicious_elements.append("Urgency language detected")
    
    # Use ChatGPT for advanced analysis
    chatgpt_analysis = use_chatgpt_api(email_content)
    
    return {
        "basic_checks": suspicious_elements,
        "ai_analysis": chatgpt_analysis
    }

def use_chatgpt_api(email_content):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert specializing in detecting phishing emails. Analyze the following email content and determine if it's likely to be a phishing attempt. Provide your reasoning."},
                {"role": "user", "content": email_content}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        return f"Error in ChatGPT API call: {str(e)}"

@app.route('/analyze', methods=['POST'])
def analyze_email_route():
    email_content = request.json['email_content']
    analysis_result = analyze_email(email_content)
    return jsonify(analysis_result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)