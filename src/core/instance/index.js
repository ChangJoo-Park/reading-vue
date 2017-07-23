import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
console.error('[index] START')
function Vue (options) {
  console.error('[index#Vue] START')
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  console.error('[index#Vue] BEFORE call _init')
  this._init(options)
  console.error('[index#Vue] AFTER call _init')
  console.error('[index#Vue] END')
}

console.error('[index] BEFORE call initMixin')
initMixin(Vue)
console.error('[index] AFTER call initMixin')
console.error('[index] BEFORE call stateMixin')
stateMixin(Vue)
console.error('[index] AFTER call stateMixin')
console.error('[index] BEFORE call eventsMixin')
eventsMixin(Vue)
console.error('[index] AFTER call eventsMixin')
console.error('[index] BEFORE call lifecycleMixin')
lifecycleMixin(Vue)
console.error('[index] AFTER call lifecycleMixin')
console.error('[index] BEFORE call renderMixin')
renderMixin(Vue)
console.error('[index] AFTER call renderMixin')
console.error('[index] END')
export default Vue
