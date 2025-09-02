import * as I from './i18n.js';
import * as E from './ibg-env.js';
if (!window.I18N) window.I18N = (I && (I.default || I)) || {};
if (!window.IBG_ENV) window.IBG_ENV = (E && (E.default || E)) || {};
