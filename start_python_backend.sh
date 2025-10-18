#!/bin/bash
set -e

echo "==> Building React frontend..."
npm run build

echo "==> Starting Python Flask backend..."
export FLASK_APP=app.py
export FLASK_ENV=development
python3 app.py
