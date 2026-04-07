import './core'
import './table'
import './note'
import './dialog'
import { toast } from './toast'
import './toggle'
import './search'
import './tooltip'
import './dropdown'
import './tabs'
import './input'
import './skeleton'
import { OProgress } from './progress'
import './progress'

export * from './glass'
export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'
export * from './note'
export * from './dialog'
export * from './tooltip'
export * from './dropdown'
export * from './tabs'
export * from './input'
export * from './skeleton'
export * from './progress'

// Expose globals for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
  ;(window as any).OProgress = OProgress
}
