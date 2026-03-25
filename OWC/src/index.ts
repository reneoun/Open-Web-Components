import './core'
import './table'
import { toast } from './toast'

export * from './core'
export * from './toast'
export * from './table'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}