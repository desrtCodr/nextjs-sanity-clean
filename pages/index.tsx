import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import Image from 'next/image'
import Link from 'next/link'

import { client } from '../sanity/client'

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

const Index = ({ posts }) => {
  return (
    <div>
      <header className="border bg-gray-500">
        <h1 className="text-2xl">Welcome to a blog!</h1>
      </header>
      {posts.length > 0 &&
        posts.map(
          ({ _id, title = '', slug, publishedAt = '', mainImage }) =>
            slug && (
              <li key={_id}>
                <Link
                  className="flex items-center gap-3"
                  href="/post/[slug]"
                  as={`/post/${slug.current}`}
                >
                  <Image
                    src={urlFor(mainImage).url()}
                    alt={title}
                    width={200}
                    height={200}
                  />
                  <p>
                    {title}
                    <span className="text-sm text-gray-500">
                      {' '}
                      - {new Date(publishedAt).toDateString()}
                    </span>
                  </p>
                </Link>
              </li>
            )
        )}
    </div>
  )
}

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post"]
    `)
  return {
    props: {
      posts,
    },
  }
}

export default Index
