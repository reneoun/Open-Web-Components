import './core'
import { toast } from './toast'

export * from './core'
export * from './toast'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}