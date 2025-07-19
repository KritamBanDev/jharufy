#!/usr/bin/env node

console.log('🔍 Testing Jharufy Project Health...\n');

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(COLORS.green, `✅ ${description}`);
  } else {
    log(COLORS.red, `❌ ${description} - MISSING`);
  }
  return exists;
}

function checkNodeModules(dir, name) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  const exists = fs.existsSync(nodeModulesPath);
  if (exists) {
    log(COLORS.green, `✅ ${name} dependencies installed`);
  } else {
    log(COLORS.red, `❌ ${name} dependencies missing`);
  }
  return exists;
}

async function main() {
  let allGood = true;

  log(COLORS.cyan, '📁 Checking Project Structure...');
  
  // Check essential files
  allGood &= checkFile('package.json', 'Root package.json');
  allGood &= checkFile('frontend/package.json', 'Frontend package.json');
  allGood &= checkFile('backend/package.json', 'Backend package.json');
  allGood &= checkFile('socket-server/package.json', 'Socket server package.json');
  
  log(COLORS.cyan, '\n📦 Checking Dependencies...');
  allGood &= checkNodeModules('.', 'Root');
  allGood &= checkNodeModules('frontend', 'Frontend');
  allGood &= checkNodeModules('backend', 'Backend');
  allGood &= checkNodeModules('socket-server', 'Socket Server');

  log(COLORS.cyan, '\n🌍 Checking Environment Files...');
  allGood &= checkFile('backend/.env', 'Backend environment');
  allGood &= checkFile('frontend/.env.development', 'Frontend development env');
  allGood &= checkFile('frontend/.env.production', 'Frontend production env');

  log(COLORS.cyan, '\n🏗️ Checking Build Artifacts...');
  allGood &= checkFile('frontend/dist/index.html', 'Frontend build');
  allGood &= checkFile('scripts/build.js', 'Build script');

  log(COLORS.cyan, '\n🧪 Checking Clean State...');
  const cleanFiles = [
    'emoji-test.html', 'flag-test.html', 'socket-test.html',
    'test-upload.js', 'auth-debug.js', 'cleanup-and-check.bat'
  ];
  
  let cleanCount = 0;
  cleanFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      cleanCount++;
    }
  });
  
  if (cleanCount === cleanFiles.length) {
    log(COLORS.green, `✅ All ${cleanFiles.length} unnecessary files removed`);
  } else {
    log(COLORS.yellow, `⚠️ ${cleanFiles.length - cleanCount} files still need cleanup`);
  }

  // Summary
  log(COLORS.cyan, '\n' + '='.repeat(50));
  if (allGood) {
    log(COLORS.green, '🎉 PROJECT HEALTH: EXCELLENT');
    log(COLORS.green, '✅ Ready for development and deployment!');
    log(COLORS.blue, '\n📋 Quick Commands:');
    log(COLORS.blue, '   npm run dev:full    # Start all services');
    log(COLORS.blue, '   npm run build       # Build project');
    log(COLORS.blue, '   npm run test        # Run tests');
  } else {
    log(COLORS.red, '⚠️ PROJECT HEALTH: NEEDS ATTENTION');
    log(COLORS.yellow, 'Some components need fixes before deployment');
  }
  log(COLORS.cyan, '='.repeat(50));
}

main().catch(console.error);
