import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingType, userSettings } from '../../src/main/config/settings';

const mocks = vi.hoisted(() => ({
  tray: {
    setToolTip: vi.fn(),
    setContextMenu: vi.fn(),
    on: vi.fn(),
    destroy: vi.fn()
  },
  create: vi.fn(),
  resize: vi.fn(),
  menu: vi.fn()
}));
vi.mock('electron', async importOriginal => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    Tray: mocks.create,
    Menu: { buildFromTemplate: mocks.menu },
    nativeImage: { createFromPath: () => ({ resize: mocks.resize }) }
  };
});
import { JupyterApplication } from '../../src/main/app';

function makeApplication(): any {
  const application = Object.create(JupyterApplication.prototype);
  application._isQuitting = false;
  application._sessionWindowManager = { windows: [] };
  return application;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.create.mockImplementation(function () {
    return mocks.tray;
  });
  mocks.resize.mockReturnValue({});
  mocks.menu.mockReturnValue({});
});
afterEach(() => userSettings.unsetValue(SettingType.closeToTray));

describe('tray icon', () => {
  it('creates one tray even when closing to tray is disabled', () => {
    userSettings.setValue(SettingType.closeToTray, false);
    const application = makeApplication();
    expect(application._ensureTray()).toBe(true);
    expect(application._ensureTray()).toBe(true);
    expect(mocks.create).toHaveBeenCalledTimes(1);
    const window = { hide: vi.fn() };
    expect(application.hideWindowToTray(window)).toBe(false);
    expect(window.hide).not.toHaveBeenCalled();
  });
  it('hides only when enabled and tray creation succeeded', () => {
    userSettings.setValue(SettingType.closeToTray, true);
    const application = makeApplication();
    const window = { hide: vi.fn() };
    expect(application.hideWindowToTray(window)).toBe(true);
    expect(window.hide).toHaveBeenCalledOnce();
    application._isQuitting = true;
    expect(application.hideWindowToTray(window)).toBe(false);
  });
  it('does not hide the window when the tray cannot be created', () => {
    userSettings.setValue(SettingType.closeToTray, true);
    mocks.create.mockImplementation(() => {
      throw new Error('tray unavailable');
    });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const window = { hide: vi.fn() };
    expect(makeApplication().hideWindowToTray(window)).toBe(false);
    expect(window.hide).not.toHaveBeenCalled();
    log.mockRestore();
  });
});
