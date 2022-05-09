import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
export default function Posts({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  console.log(post)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {}, [])

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full border-4  object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className=" text-sm font-extralight">
            Blog Post By{' '}
            <span className="text-green-500">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            // Pass in block content straight from Sanity.io
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),

              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-400" />
      {submitted ? (
        <div className="mx-auto max-w-2xl bg-yellow-400 p-6">
          <h2 className="line-height-2 my-4 text-3xl text-white">
            Thank you for submitting your comment.
          </h2>
          <p className="text-white">
            Once it has been approved, it will appear below
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto  mb-10 flex max-w-2xl flex-col"
        >
          <h3 className="text-sm text-yellow-400">
            Enjoyed with this article?
          </h3>
          <h4 className="mb-5 text-3xl font-bold">Leave a Comment Below !</h4>
          <input type="hidden" value={post._id} {...register('_id')} />
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              className="my-1 block w-full rounded-lg border p-2 shadow outline-none ring-yellow-400 focus:ring"
              placeholder="Apple Seed"
              type="text"
              {...register('name', { required: true })}
              name="name"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              className="my-1 block w-full rounded-lg border p-2 shadow outline-none ring-yellow-400 focus:ring"
              placeholder="Email"
              type="email"
              {...register('email', { required: true })}
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              className="my-1 block w-full resize-none rounded-lg border p-2 shadow outline-none ring-yellow-400 focus:ring"
              {...register('comment', { required: true })}
              placeholder="Comment"
              rows={8}
            ></textarea>
          </label>
          <div>
            {errors.name && (
              <p className=" text-red-500">Name field required</p>
            )}
            {errors.email && (
              <p className=" text-red-500">Email field required</p>
            )}
            {errors.comment && (
              <p className=" text-red-500">Comment field required</p>
            )}
          </div>

          <input
            type="submit"
            value="Send"
            className="cursor-pointer rounded-lg bg-yellow-500 p-3 text-white hover:bg-yellow-600"
          />
        </form>
      )}
      <div className="mx-auto my-8 max-w-2xl p-4 shadow">
        <h3 className="my-2 text-center text-4xl">Comments</h3>
        <hr />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="my-2 mt-3">
              <span className="text-bold  text-yellow-500">
                {comment.name}:
              </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
      _id,
      _createdAt,
      title,
      author->{
          name,
          image
      },
      'comments':*[
          _type == "comment" &&
          post._ref == ^._id &&
          approved == true],
      description,
      mainImage,
      slug,
     body
      
  }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //after 60 sec it ll update the old cached version
  }
}
