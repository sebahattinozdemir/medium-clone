function Banner() {
  return (
    <div className="flex items-center justify-between border-y border-black bg-yellow-400 lg:py-0">
      <div className="space-y-5 px-10">
        <h1 className="heig max-w-lg font-serif  text-6xl  font-bold">
          <span className="underline">Medium</span>
          <span> is a place to write, read, and connect</span>
        </h1>
        <h2>
          It is easy and free to post your thinking on any topic and connect
          with millions of readers.
        </h2>
      </div>
      <div>
        <img
          className="hidden h-32 md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>
    </div>
  )
}

export default Banner
