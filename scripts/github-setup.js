#!/usr/bin/env node

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function main() {
  log(COLORS.bright, '🔗 GITHUB SETUP INSTRUCTIONS\n');
  
  log(COLORS.yellow, '📋 NEXT STEPS TO PUSH TO GITHUB:');
  
  log(COLORS.cyan, '\n1️⃣ CREATE GITHUB REPOSITORY:');
  log(COLORS.blue, '   • Go to: https://github.com/new');
  log(COLORS.blue, '   • Repository name: jharufy');
  log(COLORS.blue, '   • Description: Language Learning Social Platform');
  log(COLORS.blue, '   • Visibility: Public (recommended)');
  log(COLORS.blue, '   • DO NOT initialize with README (we have one)');
  log(COLORS.blue, '   • Click "Create repository"');
  
  log(COLORS.cyan, '\n2️⃣ ADD REMOTE AND PUSH:');
  log(COLORS.green, '   Run these commands after creating the GitHub repo:');
  log(COLORS.blue, '   git remote add origin https://github.com/YOUR-USERNAME/jharufy.git');
  log(COLORS.blue, '   git push -u origin main');
  
  log(COLORS.cyan, '\n3️⃣ AFTER PUSHING TO GITHUB:');
  log(COLORS.blue, '   • Your code will be available at: https://github.com/YOUR-USERNAME/jharufy');
  log(COLORS.blue, '   • You can then deploy to Vercel directly from GitHub');
  log(COLORS.blue, '   • Vercel will auto-deploy on every push to main branch');
  
  log(COLORS.yellow, '\n⚠️  REPLACE "YOUR-USERNAME" with your actual GitHub username!');
  
  log(COLORS.green, '\n✨ READY TO PUSH! Create the GitHub repo first, then run the git commands.');
}

main();
