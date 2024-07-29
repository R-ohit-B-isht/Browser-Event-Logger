from flask import Flask, request, jsonify
import json
import os
from pathlib import Path

app = Flask(__name__)

# Get the user's home directory and set the log file path
home_dir = str(Path.home())
log_file_path = os.path.join(home_dir, 'browser_log.json')
code_file_path = os.path.join(home_dir, 'browser_log.txt')

# Initialize log file if it doesn't exist
if not os.path.exists(log_file_path):
    with open(log_file_path, 'w') as f:
        f.write('{"recording": []}')

if not os.path.exists(code_file_path):
    with open(code_file_path, 'w') as f:
        f.write("")

def read_log():
    try:
        with open(log_file_path, 'r') as f:
            content = f.read()
            return json.loads(content) if content else {}
    except json.JSONDecodeError:
        return {}

def write_log(data):
    with open(log_file_path, 'w') as f:
        json.dump(data, f, indent=2)

def read_code():
    try:
        with open(code_file_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return ""

def write_code(data):
    with open(code_file_path, 'w') as f:
        f.write(data)


@app.route('/get', methods=['POST'])
def get():
    keys = request.json.get('keys')
    log = read_log()
    
    if isinstance(keys, list):
        result = {key: log.get(key) for key in keys if key in log}
        return jsonify(result)
    elif isinstance(keys, str):
        return jsonify({keys: log.get(keys)})
    else:
        return jsonify(log)

@app.route('/set', methods=['POST'])
def set():
    props = request.json.get('props')
    log = read_log()
    log.update(props)
    write_log(log)
    return '', 200

@app.route('/set_code', methods=['POST'])
def set_code():
    code = request.json.get('props')
    if code is None:
        return jsonify({"error": "No code provided"}), 400
    
    if not isinstance(code, dict):
        return jsonify({"error": "Code must be a dictionary"}), 400
    
    for key, value in code.items():
        # Remove leading and trailing whitespace, and ensure proper line endings
        cleaned_value = "\n".join(line.strip() for line in value.strip().split("\n"))
        write_code(cleaned_value)
    
    return '', 200

@app.route('/remove', methods=['POST'])
def remove():
    keys = request.json.get('keys')
    log = read_log()
    if isinstance(keys, list):
        for key in keys:
            log.pop(key, None)
    elif isinstance(keys, str):
        log.pop(keys, None)
    write_log(log)
    return '', 200

if __name__ == '__main__':
    app.run(port=3421)