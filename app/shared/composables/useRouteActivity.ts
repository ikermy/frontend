import { computed } from "vue";
import type { RouteLocationNormalized } from "vue-router";

export interface RouteMatchOptions {
  exact?: boolean;
  startsWith?: boolean;
  includes?: boolean;
  customMatcher?: (currentPath: string, targetPath: string) => boolean;
}

export function useRouteActivity() {
  const route = useRoute();

  /**
   * Check if a route is currently active
   */
  const isRouteActive = (
    targetPath: string,
    options: RouteMatchOptions = {}
  ): boolean => {
    const {
      exact = false,
      startsWith = false,
      includes = false,
      customMatcher,
    } = options;

    const currentPath = route.path;

    if (customMatcher) {
      return customMatcher(currentPath, targetPath);
    }

    if (exact) {
      return currentPath === targetPath;
    }

    if (startsWith) {
      return currentPath.startsWith(targetPath);
    }

    if (includes) {
      return currentPath.includes(targetPath);
    }

    // Default behavior - exact match
    return currentPath === targetPath;
  };

  /**
   * Check if any of the provided paths is active
   */
  const isAnyRouteActive = (
    paths: string[],
    options: RouteMatchOptions = {}
  ): boolean => {
    return paths.some(path => isRouteActive(path, options));
  };

  /**
   * Get the currently active route path
   */
  const getCurrentPath = (): string => {
    return route.path;
  };

  /**
   * Get the currently active route name
   */
  const getCurrentRouteName = (): string | undefined => {
    return route.name as string | undefined;
  };

  /**
   * Check if current route matches a pattern
   */
  const matchesPattern = (pattern: RegExp): boolean => {
    return pattern.test(route.path);
  };

  /**
   * Check if current route is in a specific group
   */
  const isInRouteGroup = (groupPrefix: string): boolean => {
    return route.path.startsWith(`/${groupPrefix}`);
  };

  /**
   * Get route parameters
   */
  const getRouteParams = () => {
    return route.params;
  };

  /**
   * Get route query parameters
   */
  const getRouteQuery = () => {
    return route.query;
  };

  /**
   * Check if route has specific parameter
   */
  const hasRouteParam = (paramName: string): boolean => {
    return paramName in route.params;
  };

  /**
   * Check if route has specific query parameter
   */
  const hasQueryParam = (paramName: string): boolean => {
    return paramName in route.query;
  };

  /**
   * Get route parameter value
   */
  const getRouteParam = (paramName: string): string | string[] | undefined => {
    return route.params[paramName];
  };

  /**
   * Get query parameter value
   */
  const getQueryParam = (paramName: string): string | string[] | undefined => {
    const value = route.query[paramName];
    if (value === null || value === undefined) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value.filter(v => v !== null) as string[];
    }
    return value as string;
  };

  /**
   * Check if current route is a child of parent route
   */
  const isChildRoute = (parentPath: string): boolean => {
    return route.path.startsWith(parentPath) && route.path !== parentPath;
  };

  /**
   * Get route depth (number of path segments)
   */
  const getRouteDepth = (): number => {
    return route.path.split("/").filter(segment => segment.length > 0).length;
  };

  /**
   * Check if route is at root level
   */
  const isRootRoute = (): boolean => {
    return route.path === "/" || getRouteDepth() === 0;
  };

  /**
   * Get active route info
   */
  const getActiveRouteInfo = () => {
    return {
      path: route.path,
      name: route.name,
      params: route.params,
      query: route.query,
      meta: route.meta,
      depth: getRouteDepth(),
      isRoot: isRootRoute(),
    };
  };

  /**
   * Create a reactive computed for route activity
   */
  const createRouteActivityComputed = (
    targetPath: string,
    options: RouteMatchOptions = {}
  ) => {
    return computed(() => isRouteActive(targetPath, options));
  };

  /**
   * Create a reactive computed for multiple route activity
   */
  const createMultiRouteActivityComputed = (
    paths: string[],
    options: RouteMatchOptions = {}
  ) => {
    return computed(() => isAnyRouteActive(paths, options));
  };

  return {
    route: readonly(route),
    isRouteActive,
    isAnyRouteActive,
    getCurrentPath,
    getCurrentRouteName,
    matchesPattern,
    isInRouteGroup,
    getRouteParams,
    getRouteQuery,
    hasRouteParam,
    hasQueryParam,
    getRouteParam,
    getQueryParam,
    isChildRoute,
    getRouteDepth,
    isRootRoute,
    getActiveRouteInfo,
    createRouteActivityComputed,
    createMultiRouteActivityComputed,
  };
}
