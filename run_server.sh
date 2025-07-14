#!/bin/bash

echo "🚀 KPI Scorecard Application Server"
echo "================================"
echo

# Check if Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed or not in PATH"
    echo "Please install Python 3.6+ from https://python.org"
    exit 1
fi

# Use python3 if available, otherwise use python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "Starting server with $PYTHON_CMD..."
echo

# Run the server
$PYTHON_CMD server.py

echo
echo "Server stopped." 