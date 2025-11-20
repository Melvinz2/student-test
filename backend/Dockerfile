# Laravel Backend Dockerfile (Production)
FROM php:8.2-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite \
    sqlite-dev \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

# Install dependencies
RUN if [ -f composer.lock ]; then \
        composer install --no-dev --optimize-autoloader --no-interaction; \
    else \
        composer install --no-dev --optimize-autoloader --no-interaction --no-scripts; \
    fi

# Copy existing application directory
COPY . /var/www/html

# Copy nginx configuration
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create storage and cache directories
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && mkdir -p bootstrap/cache \
    && mkdir -p /var/log/supervisor \
    && mkdir -p /var/run

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/log/supervisor

# Generate application key (will be overridden by env)
RUN php artisan config:cache \
    && php artisan route:cache

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
