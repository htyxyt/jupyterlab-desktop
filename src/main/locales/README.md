# Desktop interface translations

Language resources live in `src/main/locales/`. `en.ts` contains English messages for stable keys and `zh-CN.ts` contains Simplified Chinese. Register a new resource and its native-language label in the `locales` array in `src/main/i18n.ts`; it will then appear in the settings dialog. Restarting applies a changed setting.

For new code, add the same stable key to the English and translated resources, then call `translateText('key')`. For dynamic values use named placeholders, e.g. `translateText('env.confirmDelete', { name })`; untranslated keys fall back to English, then to the key itself. Values supplied for placeholders are treated as text; escape them before inserting into HTML.

Existing desktop HTML templates still contain English source strings as lookup keys. `translateHtml` and the dialog/welcome observer provide compatibility for these strings and dynamically inserted labels. Move them to explicit stable keys as each view is revised; editing an English source string without updating those legacy entries can break translation. Do not translate code, user content, paths, or JupyterLab's separate web UI using this mechanism.
