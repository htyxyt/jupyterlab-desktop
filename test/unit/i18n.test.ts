import { afterEach, describe, expect, it } from 'vitest';
import { SettingType, userSettings } from '../../src/main/config/settings';
import {
  translateHtml,
  translateText,
  translationObserverScript
} from '../../src/main/i18n';
afterEach(() => userSettings.unsetValue(SettingType.language));
describe('desktop language selection', () => {
  it('keeps English text in English', () => {
    userSettings.setValue(SettingType.language, 'en');
    expect(translateText('Delete environment')).toBe('Delete environment');
    expect(translateText('env.confirmDelete', { name: 'test-env' })).toBe(
      'Are you sure you want to delete "test-env"?'
    );
    expect(translationObserverScript()).toBe('');
    expect(translateText('update.none')).toBe(
      'There are no updates available.'
    );
    expect(translateText('server.envPlaceholder')).toContain('NAME="Value"');
  });
  it('translates labels without changing script or values', () => {
    userSettings.setValue(SettingType.language, 'zh-CN');
    const html =
      '<button title="Show menu" value="Delete">Delete</button><script>const action = "Delete";</script>';
    expect(translateHtml(html)).toBe(
      '<button title="显示菜单" value="Delete">删除</button><script>const action = "Delete";</script>'
    );
    expect(translationObserverScript()).toContain('MutationObserver');
    expect(translateText('Language')).toBe('语言');
    expect(translateText('update.none')).toBe('当前没有可用更新。');
    expect(translateText('update.error')).toBe('检查更新时发生错误！');
    expect(translateText('update.available', { link: '发布页面' })).toContain(
      '发布页面'
    );
    expect(translateText('server.envPlaceholder')).toContain('NAME="Value"');
    expect(translateText('behavior')).toBe('行为');
    expect(translateText('Welcome')).toBe('欢迎');
    expect(translateText('env.confirmDelete', { name: 'test-env' })).toBe(
      '确定删除环境“test-env”吗？'
    );
    expect(translateText('missing.key')).toBe('missing.key');
    expect(
      translateHtml(
        '<div>Python environment not found. <a>Install using the bundled installer</a> or <a>Change the default Python environment</a></div>'
      )
    ).toContain('未找到 Python 环境。');
  });
});
