#!/bin/bash
# Quick Deploy Script for Ubuntu Server
# Run this script on fresh Ubuntu Server

set -e  # Exit on error

echo "=========================================="
echo "Student Project - Ubuntu Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please don't run as root. Use sudo when needed.${NC}"
   exit 1
fi

echo -e "${GREEN}Step 1: Update System${NC}"
sudo apt update
sudo apt upgrade -y

echo -e "${GREEN}Step 2: Install Dependencies${NC}"
sudo apt install -y curl git vim ufw ca-certificates gnupg lsb-release

echo -e "${GREEN}Step 3: Setup Firewall${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 8000/tcp
echo -e "${YELLOW}Firewall configured${NC}"

echo -e "${GREEN}Step 4: Install Docker${NC}"
# Remove old versions
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

echo -e "${YELLOW}Docker installed. You may need to logout and login again.${NC}"

echo -e "${GREEN}Step 5: Install Docker Compose${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo -e "${GREEN}Step 6: Install Nginx${NC}"
sudo apt install -y nginx

echo -e "${GREEN}Step 7: Install Certbot (SSL)${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo ""
echo -e "${GREEN}=========================================="
echo "Installation Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Logout and login again (for Docker permissions)"
echo "2. Clone your repository to /var/www/student-project"
echo "3. Configure .env files"
echo "4. Run: cd /var/www/student-project && docker-compose up -d"
echo "5. Setup Nginx reverse proxy"
echo "6. Configure SSL with certbot"
echo ""
echo "See UBUNTU_DEPLOYMENT.md for detailed instructions"
