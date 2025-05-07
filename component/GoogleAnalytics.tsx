'use client';

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-VC46S7LPZQ`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VC46S7LPZQ');
          `,
        }}
      />
      
      {/* Google AdSense
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4432854709401834"
        crossOrigin="anonymous"
      /> */}
    </>
  );
}