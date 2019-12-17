// Type definitions for @loadable/component 5.10
// Project: https://github.com/smooth-code/loadable-components
// Definitions by: Martynas Kadiša <https://github.com/martynaskadisa>
//                 Daniel Playfair Cal <https://github.com/hedgepigdaniel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import * as React from 'react';

export interface DefaultImportedComponent<Props> {
    default: React.ComponentType<Props>;
}

export type DefaultComponent<Props> =
    React.ComponentType<Props> |
    DefaultImportedComponent<Props>;

/**
 * Synchronous function that returns the component from the
 * imported module.
 *
 * The default works with default exports, both CommonJS or ESM
 */
export type ComponentResolver<Props, Module=DefaultComponent<Props>> = (
    module: Module,
    props: Props
) => React.ComponentType<Props>;

/**
 * Guard is able to implement delays, timeouts etc on the client side only.
 * Receives the import promise and returns the guard promise.
 * The resulting loadable component does not render until the guard promise
 * resolves, and considers the import to have failed if the guard promise rejects
 *
 * Default: `() => Promise.resolve()`
 */
type ImportGuard<Module, Props> = (
    importPromise: Promise<Module>,
    props: Props
  ) => Promise<void>;

export interface Options<Props, Module=DefaultComponent<Props>> {
    cacheKey?(props: Props): any;
    fallback?: JSX.Element;
    ssr?: boolean;
    resolveComponent?: ComponentResolver<Props, Module>;
    guard?: ImportGuard<Module, Props>;
}

export interface LoadableReadyOptions {
    namespace?: string;
}

export interface LoadableComponentMethods<Props> {
    preload(props?: Props): void;
    load(props?: Props): Promise<React.ComponentType<Props>>;
}

export type LoadableComponent<Props> =
    React.ComponentType<Props & { fallback?: JSX.Element }> &
    LoadableComponentMethods<Props>;

export type LoadableLibrary<Module> = React.ComponentType<{
    fallback?: JSX.Element;
    children?: (module: Module) => React.ReactNode;
    ref?: React.Ref<Module>;
}> &
    Module &
    LoadableComponentMethods<object>;

declare function lib<Props, Module=DefaultComponent<Props>>(
    loadFn: (props: Props) => Promise<Module>,
    options?: Options<Props, Module>
): LoadableLibrary<Props>;

declare function loadableFunc<Props, Module=DefaultComponent<Props>>(
    loadFn: (props: Props) => Promise<Module>,
    options?: Options<Props, Module>
): LoadableComponent<Props>;

declare const loadable: typeof loadableFunc & { lib: typeof lib };

export default loadable;

export namespace lazy {
    function lib<Module>(
        loadFn: (props: object) => Promise<Module>
    ): LoadableLibrary<Module>;
}

export function lazy<Props>(
    loadFn: (props: Props) => Promise<DefaultComponent<Props>>
): LoadableComponent<Props>;

export function loadableReady(
    done?: () => any, options?: LoadableReadyOptions
): Promise<void>;
