// Fail closed if upstream changes remove the fork-specific integration points.
const fs = require('fs');
const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const settings = fs.readFileSync('src/main/config/settings.ts', 'utf8');
const app = fs.readFileSync('src/main/app.ts', 'utf8');
const session = fs.readFileSync(
  'src/main/sessionwindow/sessionwindow.ts',
  'utf8'
);
const readme = fs.readFileSync('README.md', 'utf8');
const checks = [
  [
    packageInfo.repository === 'https://github.com/htyxyt/jupyterlab-desktop',
    'fork repository metadata'
  ],
  [
    /language:\s*new Setting<string>\('zh-CN'\)/.test(settings),
    'Chinese default'
  ],
  [
    /closeToTray:\s*new Setting<boolean>\(true\)/.test(settings),
    'close to tray default'
  ],
  [
    /showNewsFeed:\s*new Setting<boolean>\(false\)/.test(settings),
    'news feed default'
  ],
  [
    /checkForUpdatesAutomatically:\s*new Setting<boolean>\(false\)/.test(
      settings
    ),
    'automatic update check default'
  ],
  [
    /installUpdatesAutomatically:\s*new Setting<boolean>\(false\)/.test(
      settings
    ),
    'automatic update installation default'
  ],
  [
    app.includes(
      'api.github.com/repos/htyxyt/jupyterlab-desktop/releases/latest'
    ),
    'fork update API'
  ],
  [
    !app.includes('github.com/jupyterlab/jupyterlab-desktop/releases'),
    'upstream update URL absent'
  ],
  [
    /this\._registerListeners\(\);\s*this\._ensureTray\(\);/.test(app) &&
      session.includes('hideWindowToTray'),
    'tray integration'
  ],
  [fs.existsSync('src/main/locales/zh-CN.ts'), 'Chinese language resource'],
  [fs.existsSync('src/assets/tray-icon.png'), 'tray icon asset'],
  [readme.includes('htyxyt/jupyterlab-desktop/releases'), 'fork release links'],
  [
    fs.existsSync('test/unit/app-tray.test.ts') &&
      fs.existsSync('test/unit/i18n.test.ts'),
    'fork behavior tests'
  ]
];
for (const [ok, name] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([ok]) => !ok)) process.exitCode = 1;
