import { Metadata } from 'next';

/**
 * Returns default SEO metadata for the DSA Visualizer site.
 * Optionally override any field via the `overrides` parameter.
 */
export function getDefaultMetadata(overrides?: Partial<Metadata>): Metadata {
  const defaultMetadata: Metadata = {
    title: 'DSA Visualizer: Interactive Data Structures & Algorithms',
    description:
      'Master Data Structures & Algorithms with interactive visualizations for Arrays, Linked Lists, Trees, Graphs, and more. Learn by seeing how each operation works step-by-step.',
    keywords: ['Data Structures', 'Algorithms', 'DSA Visualizer', 'Array', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'AVL', 'Heap', 'Tutorial'],
    openGraph: {
      title: 'DSA Visualizer: Interactive Data Structures & Algorithms',
      description:
        'Interactive tutorials and live visualizations to help you understand DSA concepts with ease. Explore operations on Arrays, Trees, Graphs and more.',
      url: 'https://dsavisual.robinspt.com',
      siteName: 'DSA Visualizer',
      images: [
        {
          url: 'https://dsavisual.robinspt.com/favicon.ico',
          width: 1200,
          height: 630,
          alt: 'DSA Visualizer Open Graph Image',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@YourTwitterHandle',
      title: 'DSA Visualizer: Interactive Data Structures & Algorithms',
      description:
        'Master DSA concepts with interactive visualizations. Learn Arrays, Trees, Graphs step-by-step.',
      images: ['https://dsavisual.robinspt.com/favicon.ico'],
    },
    metadataBase: new URL('https://dsavisual.robinspt.com'),
  };
  return { ...defaultMetadata, ...overrides };
}
