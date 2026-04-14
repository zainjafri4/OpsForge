'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
  const topics = [
    { icon: '🐧', title: 'Linux & Shell', slug: 'linux-shell' },
    { icon: '🌐', title: 'Networking', slug: 'networking' },
    { icon: '☁️', title: 'AWS Core', slug: 'aws-core' },
    { icon: '⚡', title: 'AWS Advanced', slug: 'aws-advanced' },
    { icon: '🐳', title: 'Docker', slug: 'docker' },
    { icon: '☸️', title: 'Kubernetes', slug: 'kubernetes' },
    { icon: '🔄', title: 'CI/CD', slug: 'cicd' },
    { icon: '🏗️', title: 'Terraform', slug: 'iac' },
    { icon: '📡', title: 'Observability', slug: 'observability' },
    { icon: '🔧', title: 'SRE', slug: 'sre' },
    { icon: '🔒', title: 'Security', slug: 'security' },
    { icon: '💰', title: 'FinOps', slug: 'finops' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OpsForge
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Forge Your Cloud, DevOps & SRE Interview Skills
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          Master 300+ real interview questions covering AWS, Kubernetes, Terraform, CI/CD, Security, and more
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/test">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Take a Test Now
              </Button>
            </motion.div>
          </Link>
          <Link href="/topics">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Browse Topics
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-4 text-sm text-gray-500 dark:text-gray-500"
        >
          No signup required! <Link href="/register" className="text-indigo-600 hover:underline">Create an account</Link> to track your progress.
        </motion.p>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
        >
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">300+</span>{' '}
            Questions
          </div>
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span> Topics
          </div>
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>{' '}
            Difficulty Levels
          </div>
          <div>
            <span className="font-bold text-green-600 dark:text-green-400">Free</span>{' '}
            to Practice
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🧪', title: 'Practice Tests', desc: 'Take randomized 20-question tests instantly. No signup required - just pick a difficulty and start practicing.', link: '/test' },
            { icon: '📚', title: 'Topic Focus', desc: 'Choose specific topics like Kubernetes, AWS, or Terraform. Master one area at a time for targeted preparation.', link: '/topics' },
            { icon: '📊', title: 'Instant Review', desc: 'Get detailed explanations for every answer. Learn from mistakes and solidify your understanding.', link: '/test' },
          ].map((feature, index) => (
            <Link key={feature.title} href={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Topics Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-4"
        >
          Topics Covered
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-12"
        >
          Click any topic to start a focused practice test
        </motion.p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <Link key={topic.title} href={`/test?topic=${topic.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-6 text-center hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer">
                  <div className="text-4xl mb-2">{topic.icon}</div>
                  <h4 className="font-semibold">{topic.title}</h4>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link href="/topics">
            <Button variant="outline" size="lg">
              View All Topics Details
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built by{' '}
            <a
              href="https://linkedin.com/in/zainjafri4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Zain Raza Jafri
            </a>
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://github.com/zainjafri4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/zainjafri4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
