/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  console.error('[createCompiler] ==========START==========')
  console.error('[createCompiler] ', '\ntemplate : ', template, '\n' , ' options: ', options)
  console.error('[createCompiler] Before Call parser')
  const ast = parse(template.trim(), options)
  console.error('[createCompiler] After Call parser')
  console.error('[createCompiler] ast : \n', ast)
  console.error('[createCompiler] Before Call optimize')
  optimize(ast, options)
  console.error('[createCompiler] optimized ast : \n', ast)
  console.error('[createCompiler] After Call optimize')
  console.error('[createCompiler] Before Call generate')
  const code = generate(ast, options)
  console.error('[createCompiler] generated code = \n', code)
  console.error('[createCompiler] After Call generate')
  console.error('[createCompiler] ==========END==========')
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
