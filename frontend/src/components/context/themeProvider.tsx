'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export const ThemeProvider = (props: ThemeProviderProps): React.JSX.Element => {
  return <NextThemesProvider {...props} />;
};
