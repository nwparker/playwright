/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { settings } from './uiUtils';

export function applyTheme() {
  if ((document as any).playwrightThemeInitialized)
    return;
  (document as any).playwrightThemeInitialized = true;
  document!.defaultView!.addEventListener('focus', (event: any) => {
    if (event.target.document.nodeType === Node.DOCUMENT_NODE)
      document.body.classList.remove('inactive');
  }, false);
  document!.defaultView!.addEventListener('blur', event => {
    document.body.classList.add('inactive');
  }, false);
}

type Theme = 'dark-mode' | 'light-mode';

const listeners = new Set<(theme: Theme) => void>();
export function toggleTheme() {
  const oldTheme = settings.getString('theme', 'light-mode');
  let newTheme: Theme;
  if (oldTheme === 'dark-mode')
    newTheme = 'light-mode';
  else
    newTheme = 'dark-mode';

  if (oldTheme)
    document.body.classList.remove(oldTheme);
  document.body.classList.add(newTheme);
  settings.setString('theme', newTheme);
  for (const listener of listeners)
    listener(newTheme);
}

export function addThemeListener(listener: (theme: 'light-mode' | 'dark-mode') => void) {
  listeners.add(listener);
}

export function removeThemeListener(listener: (theme: Theme) => void) {
  listeners.delete(listener);
}

export function currentTheme(): Theme {
  return document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
}
