import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app as electronApp, net } from '../setup/electron-stub';
import { JupyterApplication } from '../../src/main/app';

// checkForUpdates is a method on the large JupyterApplication class whose
// constructor wires up the whole main process, so we exercise the method on a
// prototype-only instance and stub the two collaborators it reaches: the
// electron `net.fetch` boundary and the private _showUpdateDialog sink.
function makeApp(): {
  app: JupyterApplication;
  showUpdateDialog: ReturnType<typeof vi.fn>;
} {
  const app = Object.create(JupyterApplication.prototype) as JupyterApplication;
  const showUpdateDialog = vi.fn();
  ((app as unknown) as {
    _showUpdateDialog: unknown;
  })._showUpdateDialog = showUpdateDialog;
  return { app, showUpdateDialog };
}

describe('JupyterApplication.checkForUpdates', () => {
  beforeEach(() => {
    (net.fetch as ReturnType<typeof vi.fn>).mockReset();
  });

  it('does not read the body when the release feed responds non-ok', async () => {
    const { app, showUpdateDialog } = makeApp();
    const text = vi.fn(() => Promise.resolve('<html>not yaml</html>'));
    (net.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 503,
      text
    });

    app.checkForUpdates('always');

    await vi.waitFor(() => expect(showUpdateDialog).toHaveBeenCalled());
    expect(text).not.toHaveBeenCalled();
    expect(showUpdateDialog).toHaveBeenCalledWith('error');
    expect(showUpdateDialog).not.toHaveBeenCalledWith('updates-available');
  });
  it('checks the fork release and treats its current Chinese tag as the same version', async () => {
    const { app, showUpdateDialog } = makeApp();
    electronApp.getVersion.mockReturnValueOnce('4.6.4-1');
    (net.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: 'v4.6.4-1-cn' })
    });
    app.checkForUpdates('always');
    await vi.waitFor(() =>
      expect(showUpdateDialog).toHaveBeenCalledWith('no-updates')
    );
    expect(net.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/htyxyt/jupyterlab-desktop/releases/latest',
      expect.any(Object)
    );
  });
  it('reports a newer fork release', async () => {
    const { app, showUpdateDialog } = makeApp();
    electronApp.getVersion.mockReturnValueOnce('4.6.4-1');
    (net.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: 'v4.6.4-2-cn' })
    });
    app.checkForUpdates('always');
    await vi.waitFor(() =>
      expect(showUpdateDialog).toHaveBeenCalledWith('updates-available')
    );
  });
  it('reports malformed release tags as errors', async () => {
    const { app, showUpdateDialog } = makeApp();
    (net.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: 'not-a-version' })
    });
    app.checkForUpdates('always');
    await vi.waitFor(() =>
      expect(showUpdateDialog).toHaveBeenCalledWith('error')
    );
  });
});
