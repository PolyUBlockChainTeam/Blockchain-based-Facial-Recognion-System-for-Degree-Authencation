# 3rd parth dependencies
from flask import Flask
from flask_cors import CORS
import sys
import os

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the relative path and normalize it
relative_path = os.path.join(current_dir, "../../..")
normalized_path = os.path.normpath(relative_path)

# Add the normalized path to sys.path
sys.path.append(normalized_path)

# Output the normalized path to check if it's correct
print(normalized_path)


# project dependencies
from deepface import DeepFace
from deepface.api.src.modules.core.routes import blueprint
from deepface.commons.logger import Logger

logger = Logger()


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(blueprint)
    logger.info(f"Welcome to DeepFace API v{DeepFace.__version__}!")
    return app
