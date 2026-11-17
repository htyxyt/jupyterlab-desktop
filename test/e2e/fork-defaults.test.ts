import { expect, test } from '@playwright/test';
import { cleanup, launchApp, pageByTitle } from './helpers';

test.skip(
  process.platform !== 'win32',
  'Windows tray behavior is tested on the Windows runner'
);

test('默认中文、隐藏新闻，语言可切换，关闭窗口后保留会话', async () => {
  const { app, userDataDir, jupyterDir } = await launchApp({
    language: 'zh-CN'
  });
  try {
    const welcome = await pageByTitle(app, /欢迎|welcome/i);
    await welcome.waitForLoadState('domcontentloaded');
    await expect(welcome.locator('body')).toHaveClass(/news-list-hidden/);
    await expect(welcome.locator('#new-session-link')).toContainText(
      '新建会话'
    );

    await app.evaluate(({ app: electronApp }) => {
      const path = process.getBuiltinModule('path');
      const root = electronApp.getAppPath();
      const require = process
        .getBuiltinModule('module')
        .createRequire(path.join(root, 'package.json'));
      const config = require(path.join(
        root,
        'build/out/main/config/settings.js'
      ));
      const Dialog = require(path.join(
        root,
        'build/out/main/settingsdialog/settingsdialog.js'
      )).SettingsDialog;
      const defaults = new config.UserSettings(false);
      if (defaults.getValue(config.SettingType.language) !== 'zh-CN') {
        throw new Error('Default language is not Chinese');
      }
      const options: Record<string, unknown> = { isDarkTheme: false };
      for (const key of Object.values(config.SettingType) as string[]) {
        options[key] = config.userSettings.getValue(key);
      }
      const dialog = new Dialog(options, {});
      dialog.load();
    });
    let dialog;
    await expect
      .poll(
        async () => {
          for (const page of app.windows()) {
            if (
              await page
                .locator('#language')
                .count()
                .catch(() => 0)
            ) {
              dialog = page;
              return true;
            }
          }
          return false;
        },
        { timeout: 15000 }
      )
      .toBe(true);
    if (!dialog) throw new Error('Settings dialog did not open');
    await dialog.waitForLoadState('load');
    const language = dialog.locator('#language');
    await expect(language).toHaveValue('zh-CN');
    await language.selectOption('en');
    await expect(language).toHaveValue('en');
    await language.selectOption('zh-CN');
    await expect(language).toHaveValue('zh-CN');
    await dialog.close();

    const result = await app.evaluate(({ BrowserWindow }) => {
      const window = BrowserWindow.getAllWindows().find(
        w => !w.isDestroyed() && w.getTitle() === '欢迎'
      );
      if (!window) throw new Error('Session window not found');
      window.close();
      return { destroyed: window.isDestroyed(), visible: window.isVisible() };
    });
    expect(result).toEqual({ destroyed: false, visible: false });
  } finally {
    await app.close();
    cleanup(userDataDir, jupyterDir);
  }
});
