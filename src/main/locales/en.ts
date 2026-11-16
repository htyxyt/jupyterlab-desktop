// Default English messages for stable translation keys.
const messages: Record<string, string> = {
  'tray.show': 'Show windows',
  'tray.quit': 'Quit',
  'menu.resetMode': 'Reset to session default',
  'menu.closeSession': 'Close Session',
  'menu.newWindow': 'New Window',
  'menu.checkUpdates': 'Check for updates…',
  'menu.devTools': 'Open Developer Tools',
  'menu.about': 'About',
  'env.confirmDelete': 'Are you sure you want to delete "{name}"?',
  'update.none': 'There are no updates available.',
  'update.error': 'Error occurred while checking for updates!',
  'update.available':
    'There is a new version available. Download the latest version from {link}.',
  'update.releases': 'the Releases page',
  'server.workingDirectoryPlaceholder':
    '/working/directory (leave empty for user home)',
  'server.argsPlaceholder':
    'Enter additional server launch args separated by space',
  'server.envPlaceholder':
    'Enter additional environment variables in NAME="Value" format in separate lines'
};
export default messages;
