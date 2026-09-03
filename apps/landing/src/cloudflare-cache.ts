import type { WebsiteCacheContext } from "./github-cache";

export function getWebsiteCacheContext(): WebsiteCacheContext {
  return {
    cache: null,
    waitUntil: () => {},
  };
}
