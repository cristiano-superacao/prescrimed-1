#!/usr/bin/env node
// Deploy to Hostgator via FTP using basic-ftp
// Usage:
// 1) npm install basic-ftp --no-save
// 2) set env vars HOSTGATOR_HOST, HOSTGATOR_USER, HOSTGATOR_PASS, HOSTGATOR_PATH
// 3) node scripts/deploy_hostgator.mjs

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localDir = path.resolve(__dirname, '..', 'Template');
const host = process.env.HOSTGATOR_HOST || process.env.FTP_HOST;
const user = process.env.HOSTGATOR_USER || process.env.FTP_USER;
const password = process.env.HOSTGATOR_PASS || process.env.FTP_PASS;
const remotePath = process.env.HOSTGATOR_PATH || process.env.FTP_PATH || '/public_html';
const secure = (process.env.HOSTGATOR_SECURE || 'false').toLowerCase() === 'true';

// CLI args: --dry-run, --sync, --remote-list <file>
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SYNC = args.includes('--sync');
const remoteListIndex = args.indexOf('--remote-list');
const remoteListFile = remoteListIndex !== -1 ? args[remoteListIndex + 1] : null;

if (!host || !user || !password) {
  if (!DRY_RUN) {
    console.error('Missing FTP credentials. Set HOSTGATOR_HOST, HOSTGATOR_USER and HOSTGATOR_PASS, or run with --dry-run.');
    process.exit(1);
  } else {
    console.log('Running in dry-run mode (no FTP credentials required).');
  }
}

async function run() {
  // Helper: list all local files under localDir (relative paths)
  const walkLocal = (dir) => {
    const results = [];
    const list = fs.readdirSync(dir);
    for (const name of list) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkLocal(full).forEach((p) => results.push(path.relative(localDir, path.join(full, p))));
      } else {
        results.push(path.relative(localDir, full).replace(/\\/g, '/'));
      }
    }
    return results;
  };

  const localFiles = walkLocal(localDir);

  // If dry-run: optionally read remote list from file; else assume empty remote set
  let remoteFiles = [];
  if (DRY_RUN && remoteListFile) {
    try {
      const txt = fs.readFileSync(path.resolve(remoteListFile), 'utf8');
      remoteFiles = txt.split(/\r?\n/).filter(Boolean).map((s) => s.replace(/^\//, ''));
    } catch (err) {
      console.warn('Could not read remote list file:', remoteListFile);
      remoteFiles = [];
    }
  }

  // Print plan
  console.log('Local files to upload (count):', localFiles.length);
  if (localFiles.length <= 50) localFiles.forEach((f) => console.log('  UPLOAD:', f));
  else console.log('  (listing suppressed; many files)');

  if (SYNC) {
    const toDelete = remoteFiles.filter((rf) => !localFiles.includes(rf));
    console.log('Files that would be deleted on remote (count):', toDelete.length);
    toDelete.slice(0, 50).forEach((f) => console.log('  DELETE:', f));
    if (toDelete.length > 50) console.log('  (more deletions omitted)');
  }

  if (DRY_RUN) {
    console.log('\nDry-run complete. No network operations were performed.');
    return;
  }

  let ftpModule;
  try {
    ftpModule = await import('basic-ftp');
  } catch (err) {
    console.error('Failed to load dependency "basic-ftp". Run: npm install basic-ftp --no-save');
    process.exit(1);
  }
  const ftp = ftpModule.default || ftpModule;
  const client = new ftp.Client(0);
  client.ftp.verbose = !!process.env.DEBUG_FTP;
  try {
    console.log(`Connecting to ${host} (secure=${secure})...`);
    await client.access({ host, user, password, secure });
    console.log('Connected. Ensuring remote directory:', remotePath);
    await client.ensureDir(remotePath);
    await client.cd(remotePath);

    console.log('Uploading Template =>', remotePath);
    // uploadFromDir will recursively upload localDir contents into current remoteDir
    await client.uploadFromDir(localDir);

    if (SYNC) {
      // list remote files and delete extras
      const listRemoteRecursive = async (dir = '.') => {
        const entries = await client.list(dir);
        let files = [];
        for (const e of entries) {
          const remoteRel = path.posix.join(dir === '.' ? '' : dir, e.name).replace(/^\//, '');
          if (e.isDirectory) {
            const child = await listRemoteRecursive(remoteRel);
            files = files.concat(child);
          } else {
            files.push(remoteRel.replace(/^\.\//, ''));
          }
        }
        return files;
      };

      const remoteList = await listRemoteRecursive('.');
      const toRemove = remoteList.filter((r) => !localFiles.includes(r));
      console.log('Remote files to remove (count):', toRemove.length);
      for (const f of toRemove) {
        try {
          console.log('Removing remote:', f);
          await client.remove(f);
        } catch (err) {
          console.warn('Failed to remove', f, err.message || err);
        }
      }
    }

    console.log('Upload complete. You may verify with: curl -I https://<your-domain>/assets/index-*.js');
  } catch (err) {
    console.error('Deploy failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    client.close();
  }
}

run();
