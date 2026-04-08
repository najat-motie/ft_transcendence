const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1"]);

const hasWindow = () => typeof window !== "undefined" && Boolean(window.location);

const getBrowserOrigin = () => {
  if (!hasWindow()) return "https://localhost";
  return window.location.origin;
};

const getBrowserWsOrigin = () => {
  if (!hasWindow()) return "wss://localhost";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
};

const shouldUseBrowserHost = (hostname) => {
  if (!hasWindow()) return false;
  return !LOCALHOST_HOSTS.has(window.location.hostname) && LOCALHOST_HOSTS.has(hostname);
};

export const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredBaseUrl) {
    return "/api";
  }

  try {
    const resolvedUrl = new URL(configuredBaseUrl, getBrowserOrigin());

    if (shouldUseBrowserHost(resolvedUrl.hostname)) {
      return `${getBrowserOrigin()}${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    }

    if (hasWindow() && resolvedUrl.origin === window.location.origin) {
      return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    }

    return resolvedUrl.toString();
  } catch {
    return configuredBaseUrl;
  }
};

export const getWsBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_WS_BASE_URL?.trim();

  if (!configuredBaseUrl) {
    return getBrowserWsOrigin();
  }

  try {
    const resolvedUrl = new URL(configuredBaseUrl, getBrowserOrigin());
    const protocol = resolvedUrl.protocol === "https:"
      ? "wss:"
      : resolvedUrl.protocol === "http:"
        ? "ws:"
        : resolvedUrl.protocol;

    if (shouldUseBrowserHost(resolvedUrl.hostname)) {
      return `${getBrowserWsOrigin()}${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    }

    return `${protocol}//${resolvedUrl.host}${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return configuredBaseUrl;
  }
};
