import './core'
import './table'
import './note'
import './dialog'
import { toast } from './toast'
import './toggle'
import './search'

export * from './glass'
export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'
export * from './note'
export * from './dialog'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}
