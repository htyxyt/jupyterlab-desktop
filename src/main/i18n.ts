import { SettingType, userSettings } from './config/settings';
import english from './locales/en';
import simplifiedChinese from './locales/zh-CN';

// Register new language files here. Labels are language names in their own language.
export const locales = [
  { id: 'en', label: 'English', messages: english },
  { id: 'zh-CN', label: '简体中文', messages: simplifiedChinese }
];
function getLocale() {
  return (
    locales.find(
      locale => locale.id === userSettings.getValue(SettingType.language)
    ) || locales[0]
  );
}

export function translateText(
  key: string,
  params: Record<string, string> = {}
): string {
  const locale = getLocale();
  const value = locale.messages[key] ?? english[key] ?? key;
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? params[name] : match
  );
}
export function translateHtml(html: string): string {
  const translations = getLocale().messages;
  if (getLocale().id === 'en') return html;
  return html
    .split(
      /(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/gi
    )
    .map((part, i) => {
      if (i % 2) return part;
      return part
        .replace(/>([^<>]+)</g, (match, text: string) => {
          const trimmed = text.trim();
          return trimmed && translations[trimmed]
            ? '>' + text.replace(trimmed, translations[trimmed]) + '<'
            : match;
        })
        .replace(
          /\b(title|placeholder)=(['"])(.*?)\2/g,
          (match, attr: string, quote: string, text: string) =>
            translations[text]
              ? attr + '=' + quote + translations[text] + quote
              : match
        );
    })
    .join('');
}

export function translationObserverScript(): string {
  const locale = getLocale();
  if (locale.id === 'en') return '';
  const data = JSON.stringify(locale.messages).replace(/</g, '\\u003c');
  return `<script>document.addEventListener('DOMContentLoaded', () => {
    const dict = ${data};
    function translate(root) {
      if (root.nodeType === 3) { const value = root.nodeValue; const key = value.trim(); if (dict[key]) root.nodeValue = value.replace(key, dict[key]); return; }
      if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(root.tagName)) return;
      for (const name of ['title', 'placeholder', 'aria-label']) { const v = root.getAttribute(name); if (v && dict[v]) root.setAttribute(name, dict[v]); }
      for (const child of root.childNodes) translate(child);
    }
    translate(document.body);
    new MutationObserver(records => { for (const r of records) { if (r.type === 'characterData') translate(r.target); else for (const n of r.addedNodes) translate(n); } }).observe(document.body, { subtree: true, childList: true, characterData: true });
  });</script>`;
}
