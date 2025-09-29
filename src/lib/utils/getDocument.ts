import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

/**
 * Fetches a document from a Payload CMS collection by slug.
 * 
 * @param {Collection} collection - The collection to fetch from
 * @param {string} slug - The slug of the document to fetch
 * @param {number} depth - The depth of relationships to populate
 * @returns {Promise<any>} The document or undefined if not found
 */
async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

/**
 * Returns a cached version of the document fetch function.
 * Uses Next.js unstable_cache for server-side caching with appropriate cache tags.
 * 
 * @param {Collection} collection - The collection to fetch from
 * @param {string} slug - The slug of the document to fetch
 * @returns {Promise<any>} The cached document
 * 
 * ## When to use:
 * 
 * 1. **Page Data**:
 *    - For fetching content for specific pages by slug
 *    - In generateMetadata functions to get SEO data
 * 
 * 2. **Dynamic Routes**:
 *    - In [slug] route handlers to fetch the corresponding content
 *    - For blog posts, product pages, or other content-driven pages
 * 
 * 3. **Performance Optimization**:
 *    - To cache frequently accessed documents
 *    - When the same document is needed in multiple components
 * 
 * 4. **Server Components**:
 *    - For data fetching in Server Components
 *    - When rendering content from the CMS
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // In a dynamic [slug] page.tsx
 * import { getCachedDocument } from '@/lib/utils/getDocument';
 * 
 * export default async function Page({ params }: { params: { slug: string } }) {
 *   const post = await getCachedDocument('posts', params.slug);
 *   
 *   if (!post) {
 *     notFound();
 *   }
 *   
 *   return (
 *     <article>
 *       <h1>{post.title}</h1>
 *       <div dangerouslySetInnerHTML={{ __html: post.content }} />
 *     </article>
 *   );
 * }
 * ```
 */
export const getCachedDocument = (collection: Collection, slug: string) =>
  unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })
