import type { SanityDocument } from '@sanity/client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';


import type { PortableTextBlock } from '@portabletext/types';

export interface PostType extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageSource; // Assuming this is a Sanity image object
  body: PortableTextBlock[]; // Portable Text format
}

export interface HomePageType extends SanityDocument {
  title: string;
  heroImage: SanityImageSource; // Assuming this is a Sanity image object
  introText: PortableTextBlock[];
  featuredPosts: PostType[];
}