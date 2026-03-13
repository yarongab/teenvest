import { Html, Head, Main, NextScript } from 'next/document';
 
export default function Document() {
  return (
    <Html lang="he" dir="rtl">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="TEENVEST - המנטור הפיננסי הדיגיטלי לבני נוער. למד להשקיע, לנהל כסף ולבנות עסק דיגיטלי." />
        <meta name="theme-color" content="#0B3C5D" />
        <meta property="og:title" content="TEENVEST - המנטור הפיננסי הדיגיטלי שלך" />
        <meta property="og:description" content="למד להשקיע, לנהל כסף ולבנות עסק דיגיטלי — בשפה שלך, בקצב שלך" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.teenvest.ai" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
 








