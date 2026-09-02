import './globals.css';

export const metadata = { title: 'Pulse — Next-gen Todo', description: 'A modern, fast todo workspace built with Next.js.' };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
