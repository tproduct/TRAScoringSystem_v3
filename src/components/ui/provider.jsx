'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { customSystem } from '@components/themes/theme'

export function Provider(props) {
  return (
    <ChakraProvider value={customSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
