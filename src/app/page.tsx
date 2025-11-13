import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../src/sanity/client"; 
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { HomePageType } from "../types/pagesTypes";
import { PortableText } from "@portabletext/react";

const HOMEPAGE_QUERY = `*[
  _type == "homePage"
][0]{title, heroImage, introText,featuredPosts[]->{_id, title, slug, publishedAt}}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const homePage = await client.fetch<HomePageType>(HOMEPAGE_QUERY, {}, options);
   const heroImageUrl = homePage.heroImage
    ? urlFor(homePage.heroImage)?.width(550).height(310).url()
    : null;
  
  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">{homePage.title}</h1>
      {heroImageUrl && (
        <Image
          src={heroImageUrl}
          alt={homePage.title}
          className="aspect-video rounded-xl mb-8"
          width={550}
          height={310}
        />
      )}
      <div className="prose">
        {Array.isArray(homePage.introText) && <PortableText value={homePage.introText} />}
      </div>
      <div className="border-t my-4">
        <h1 className="text-3xl font-semibold mb-4">Featured Posts</h1>
        <ul className="space-y-4">
          {homePage.featuredPosts?.map((post) => (
            <li key={post._id} className="border-b pb-4">
              <Link href={`/posts/${post.slug.current}`}>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>      
      
      <br/>
      <Link href="/posts" className="text-blue-500 hover:underline">
        View all posts
      </Link>
    </main>
  );
}

const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;
