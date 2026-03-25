import './core'
import './table'
import { toast } from './toast'
import './toggle'
import './search'

export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}