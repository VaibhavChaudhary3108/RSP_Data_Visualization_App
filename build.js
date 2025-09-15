#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

try {
  // Make sure vite has execute permissions
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    fs.chmodSync(vitePath, '755');
  }
  
  // Run the build command
  execSync('node node_modules/vite/bin/vite.js build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
