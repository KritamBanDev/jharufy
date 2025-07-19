#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function runCommand(command, args, cwd, description) {
  return new Promise((resolve, reject) => {
    log(COLORS.cyan, `\n🚀 ${description}...`);
    
    const child = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(COLORS.green, `✅ ${description} completed successfully`);
        resolve();
      } else {
        log(COLORS.red, `❌ ${description} failed with exit code ${code}`);
        reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
      }
    });

    child.on('error', (error) => {
      log(COLORS.red, `❌ ${description} error: ${error.message}`);
      reject(error);
    });
  });
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  try {
    log(COLORS.bright, '🔧 Starting Jharufy Build Process...\n');

    // Build frontend
    await runCommand('npm', ['run', 'build'], 
      path.join(rootDir, 'frontend'), 
      'Building Frontend'
    );

    // Test backend
    await runCommand('npm', ['run', 'lint'], 
      path.join(rootDir, 'backend'), 
      'Linting Backend'
    );

    // Test frontend
    await runCommand('npm', ['run', 'lint'], 
      path.join(rootDir, 'frontend'), 
      'Linting Frontend'
    );

    log(COLORS.green, '\n🎉 All builds completed successfully!');
    log(COLORS.yellow, '\n📝 Next Steps:');
    log(COLORS.blue, '   • Run: npm run dev (to start development)');
    log(COLORS.blue, '   • Run: npm test (to run tests)');
    log(COLORS.blue, '   • Deploy to Vercel/Railway for production');

  } catch (error) {
    log(COLORS.red, `\n💥 Build failed: ${error.message}`);
    process.exit(1);
  }
}

main();
