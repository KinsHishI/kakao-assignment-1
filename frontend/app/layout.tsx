import './globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'Next.js and FastAPI Todo migration project',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
