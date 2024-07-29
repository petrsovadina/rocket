import { NextApiRequest, NextApiResponse } from 'next'
import { ModelType } from '@/lib/utils'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { model } = req.body as { model: ModelType }

  // Zde byste normálně nastavili model v backendu nebo v session
  // Pro tento příklad pouze simulujeme úspěšné nastavení
  console.log(`Model set to: ${model}`)

  // V reálné aplikaci byste zde měli implementovat logiku pro nastavení modelu
  // např. uložení do databáze nebo nastavení v session

  res.status(200).json({ message: 'Model successfully set', model })
}