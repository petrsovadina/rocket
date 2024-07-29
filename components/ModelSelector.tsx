"use client"

import React, { useEffect, useState } from "react"
import { ModelType } from '../lib/utils'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'

interface ModelSelectorProps {
  onModelChange: (model: ModelType) => void
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  onModelChange,
}) => {
  const [availableModels, setAvailableModels] = useState<Record<ModelType, string>>({})
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/available-models')
      .then(response => response.json())
      .then(data => setAvailableModels(data))
      .catch(error => console.error('Error fetching available models:', error))
  }, [])

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model)
    onModelChange(model)
    setIsOpen(false)
  }

  return (
    <div className="mb-8 relative">
      <label htmlFor="model-select" className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
        Vyberte AI model:
      </label>
      <div className="relative">
        <Button
          id="model-select"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-md hover:bg-white dark:hover:bg-gray-800"
        >
          <span>{selectedModel ? availableModels[selectedModel] : "Vyberte model"}</span>
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            {Object.entries(availableModels).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => handleModelChange(key as ModelType)}
                className="w-full justify-start font-normal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800"
              >
                {value}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}