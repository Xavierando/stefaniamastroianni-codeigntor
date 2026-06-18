import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store";
import App from "./App";

/**
 * Render a route to a static HTML string for build-time prerendering.
 *
 * Data-fetching useEffects do not run during SSR, so the output carries the
 * route's static markup plus the SEO tags (title/description/OG/JSON-LD) that the
 * <SEO> component renders inline. The prerender script lifts those tags into
 * <head>. The client bundle then mounts and takes over (CSR) as before.
 */
export function render(url: string) {
  const appHtml = renderToString(
    <Provider store={store}>
      <HelmetProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </Provider>
  );

  return { appHtml };
}
