'use client';

import { useEffect } from 'react';
import type { ReactElement } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export default function AdUnit(): ReactElement {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  }, []);
  return (
    <div className="w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4432854709401834"
        data-ad-slot="5759436632"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}