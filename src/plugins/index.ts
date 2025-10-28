import { type ReactNode } from 'react';
import '@/core/i18n/config';
import 'dayjs/locale/vi';
import '@/styles/index.css';
import '@/styles/customize.css';

import { withToast } from './toast';

const plugins = [withToast];

export function withPlugins(app: ReactNode) {
    return plugins.reduce((acc, plugin) => plugin(acc), app);
}
