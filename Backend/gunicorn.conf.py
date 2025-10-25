# Gunicorn configuration file
bind = "0.0.0.0:8000"

# Workers settings
workers = 2
worker_class = "sync"
worker_connections = 1000

# Timeout and network settings
timeout = 120
keepalive = 2
max_requests = 1200
max_requests_jitter = 200

# Logging settings
preload_app = True
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Enable output capturing
capture_output = True
enable_stdio_inheritance = False