// [slug].tsx

import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import Image from 'next/image'

import { client } from '../../sanity/client'

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <Image
          alt={value.alt || ' '}
          loading="lazy"
          src={urlFor(value).url()}
          width={320}
          height={240}
        />
      )
    },
  },
}

const Post = ({ post }) => {
  const {
    // title = 'Missing title',
    name = 'Missing name',
    categories,
    authorImage,
    body = [],
  } = post
  return (
    <article className="p-3">
      <header className="flex justify-between">
        {categories && (
          <ul>
            Posted in
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        )}
        {authorImage && (
          <div className="flex items-center gap-3 ">
            <span>By {name} </span>
            <Image
              src={urlFor(authorImage).url()}
              width={50}
              height={50}
              alt={`${name}'s picture`}
              className="rounded-full"
            />
          </div>
        )}
      </header>

      {/* <h1 className="p-5 text-center text-3xl">{title}</h1> */}
      <div className="m-5">
        <PortableText value={body} components={ptComponents} />
      </div>
    </article>
  )
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  body
}`
export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  }
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = '' } = context.params
  const post = await client.fetch(query, { slug })
  return {
    props: {
      post,
    },
  }
}
export default Post
