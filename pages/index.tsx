import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import { Post } from '../typings'
import { sanityClient, urlFor } from './../sanity'

interface Props {
  posts: [Post]
}
export default function Home({ posts }: Props) {
  return (
    <div className=" mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner></Banner>
      {/* Posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border">
              {/* Protection same thing below code 
                  {post.mainImage && (
              <img src={urlFor(post.mainImage).url()!} alt="" />
            )}
            */}
              <img
                className="h-60 w-full object-cover transition-transform duration-200 ease-in group-hover:scale-105"
                src={urlFor(post.mainImage).url()!}
                alt=""
              />
              <div className="flex items-center justify-between bg-white p-5">
                <div>
                  <p className="text-xl font-bold">{post.title}</p>
                  <p className="text-sm">Author: {post.author.name}</p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author->{
      name,
      image
    },
    mainImage,
    slug
  }`
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
