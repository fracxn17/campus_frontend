import sys
import os

# Ensure the root of backend is in the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app
from mangum import Mangum

handler = Mangum(app)
