from flask import Flask
from flask_cors import CORS

app = Flask(__name__, template_folder="../frontend", static_folder="../frontend")
app.config['TEMPLATES_AUTO_RELOAD'] = True # Reload if template (frontend) files have changed
cors = CORS(app) # Enable Cross-Origin resource sharing

from app import routes
