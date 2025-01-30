'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQ {
  question: string
  answer: string
}

interface FAQDisplayProps {
  faqs: FAQ[]
}

export const FAQDisplay: React.FC<FAQDisplayProps> = ({ faqs }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="w-full space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-700/30 transition-colors"
          >
            <span className="text-gray-100 font-medium">{faq.question}</span>
            <motion.span
              animate={{ rotate: expandedIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-purple-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </motion.span>
          </button>
          <AnimatePresence>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-700/50"
              >
                <p className="p-4 text-gray-300">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
} 