/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  console.error('[initMixin] START')
  console.error('[initMixin] Define `_init`')
  Vue.prototype._init = function (options?: Object) {
    console.error('[Vue._init] START')
    const vm: Component = this
    // a uid
    console.error('[Vue._init] increase uid')
    vm._uid = uid++
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-init:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    console.error('[Vue._init] set _isVue true')
    vm._isVue = true
    // merge options
    console.error('[Vue._init] Merge Options')
    if (options && options._isComponent) {
      console.error('[Vue._init] has Options && isComponent true')
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      console.error('[Vue._init] Call initInternalComponent')
      initInternalComponent(vm, options)
    } else {
      console.error('[Vue._init] empty options || isComponent false')
      console.error('[Vue._init] Call mergeOptions')
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Vue._init] Call initProxy when not production')
      initProxy(vm)
    } else {
      console.error('[Vue._init] Define _renderProxy when production')
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    console.error('[Vue._init] START initLifecycle')
    initLifecycle(vm)
    console.error('[Vue._init] END initLifecycle')
    console.error('[Vue._init] START initEvents')
    initEvents(vm)
    console.error('[Vue._init] END initEvents')
    console.error('[Vue._init] START initRender')
    initRender(vm)
    console.error('[Vue._init] END initRender')
    console.error('[Vue._init] START callHook beforeCreate')
    callHook(vm, 'beforeCreate')
    console.error('[Vue._init] END callHook beforeCreate')
    console.error('[Vue._init] START initInjections')
    initInjections(vm) // resolve injections before data/props
    console.error('[Vue._init] END initInjections')
    console.error('[Vue._init] START initState')
    initState(vm)
    console.error('[Vue._init] END initState')
    console.error('[Vue._init] START initProvide')
    initProvide(vm) // resolve provide after data/props
    console.error('[Vue._init] END initProvide')
    console.error('[Vue._init] START callHook created')
    callHook(vm, 'created')
    console.error('[Vue._init] END callHook created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      console.error('[Vue._init] BEFORE format component name')
      vm._name = formatComponentName(vm, false)
      console.error('[Vue._init] AFTER format component name')
      mark(endTag)
      measure(`${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      console.error('[Vue._init] BEFORE call $mount ', vm.$options.el)
      vm.$mount(vm.$options.el)
      console.error('[Vue._init] AFTER call $mount')
    }
    console.error('[Vue._init] END')
  }
  console.error('[initMixin] END')
}

function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  console.error('[initInternalComponent] START when it is component')
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent
  opts.propsData = options.propsData
  opts._parentVnode = options._parentVnode
  opts._parentListeners = options._parentListeners
  opts._renderChildren = options._renderChildren
  opts._componentTag = options._componentTag
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
  console.error('[initInternalComponent] END')
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  console.error('[resolveConstructorOptions] START')
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
    console.error('[resolveConstructorOptions] END')
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  console.error('[resolveModifiedOptions] START')
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  console.error('[resolveModifiedOptions] END')
  return modified
}

function dedupe (latest, extended, sealed) {
  console.error('[dedupe] START')
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    console.error('[dedupe] END return array latest')
    return res
  } else {
    console.error('[dedupe] END return not array latest')
    return latest
  }
}
