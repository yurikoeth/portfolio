import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4">
      <Navbar />
     
      <section className="mt-20">
        <h1 className="text-3xl text-black dark:text-white font-bold mb-2">Tesean Mangin</h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-6">Software Engineer</h2>
       
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          I am a <span className="italic">software engineer, problem solver,
          mentor, security researcher, minimalist,</span> and eternal optimist.
        </p>
       
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          I love to both build and break things. I am motivated by challenging projects
          with self-guided research and dynamic problem solving. My true passion is
          exploring vunerablilities and how to make systems more secure and user friendly.
          As well as building web and phone applications for users engage and have smoother
          online experiences.
        </p>
       
        <p className="text-gray-600 dark:text-gray-300 mb-20">
          This is my personal space, where I share my work and projects.
        </p>
      </section>

      <section className="mb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-black dark:text-white font-bold">Projects</h2>
          <Link href="/projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            See all projects
          </Link>
        </div>
       
        {/* Add project cards here */}
      </section>
    </main>
  )
}