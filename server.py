#!/usr/bin/env python3
"""
Simple HTTP Server for KPI Scorecard Application
Run this script to serve the application locally on http://localhost:8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
HOST = "localhost"

# MIME types for web application
MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
}

class KPIServerHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for KPI Scorecard application"""
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Add caching headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def guess_type(self, path):
        """Guess the type of a file based on its extension"""
        ext = Path(path).suffix.lower()
        return MIME_TYPES.get(ext, 'text/plain')
    
    def do_GET(self):
        """Handle GET requests"""
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle common missing files gracefully
        if self.path in ['/favicon.ico', '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png']:
            self.send_response(204)  # No Content
            self.end_headers()
            return
        
        # Check if file exists
        file_path = self.path.lstrip('/')
        if os.path.exists(file_path):
            super().do_GET()
        else:
            self.send_error(404, f"File not found: {self.path}")
    
    def log_message(self, format, *args):
        """Custom log message format - suppress 204 responses for icons"""
        # Don't log 204 responses for common missing files
        if "204" in format % args and any(icon in format % args for icon in ['favicon.ico', 'apple-touch-icon']):
            return
        timestamp = self.log_date_time_string()
        print(f"[{timestamp}] {format % args}")

def check_files():
    """Check if required files exist"""
    required_files = ['index.html', 'styles.css', 'data.js', 'app.js']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        print("\nPlease ensure all files are in the same directory as this server script.")
        return False
    
    return True

def find_available_port(start_port=8000):
    """Find an available port starting from start_port"""
    import socket
    
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    
    return None

class RobustTCPServer(socketserver.TCPServer):
    """TCP Server with better error handling"""
    allow_reuse_address = True
    
    def handle_error(self, request, client_address):
        """Handle errors more gracefully"""
        import traceback
        exc_type, exc_value, exc_tb = sys.exc_info()
        
        # Don't log connection reset errors - they're normal
        if exc_type.__name__ == 'ConnectionResetError':
            return
        
        # Log other errors
        print(f"Error handling request from {client_address}: {exc_value}")
        
def main():
    """Main function to start the server"""
    print("🚀 KPI Scorecard Application Server")
    print("=" * 50)
    
    # Check if required files exist
    if not check_files():
        sys.exit(1)
    
    # Find available port
    port = find_available_port(PORT)
    if not port:
        print(f"❌ Could not find an available port starting from {PORT}")
        sys.exit(1)
    
    # Create server
    try:
        with RobustTCPServer((HOST, port), KPIServerHandler) as httpd:
            url = f"http://{HOST}:{port}"
            
            print(f"✅ Server starting on {url}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🌐 Open your browser and navigate to: {url}")
            print("\nPress Ctrl+C to stop the server")
            print("=" * 50)
            
            # Try to open browser automatically
            try:
                webbrowser.open(url)
                print("🔗 Browser opened automatically")
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")
                print(f"Please manually open {url} in your browser")
            
            # Start server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 