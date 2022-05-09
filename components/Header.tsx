import Link from 'next/link'

function Header() {
  return (
    <header className="sticky top-0 z-20 mx-auto flex max-w-7xl items-center justify-between bg-white p-5">
      <div className="flex">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt="medium"
          />
        </Link>
        <ul className="ml-5 hidden items-center justify-center space-x-5  md:flex">
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Contact</li>
          <li className="cursor-pointer rounded-full bg-green-600 px-5 py-2 text-white">
            Follow
          </li>
        </ul>
      </div>
      <div className="flex space-x-5">
        <button className="text-green-500">Sign In</button>
        <button className="rounded-full border-2  border-green-500 py-2 px-4 text-green-500">
          Get Started
        </button>
      </div>
    </header>
  )
}

export default Header
