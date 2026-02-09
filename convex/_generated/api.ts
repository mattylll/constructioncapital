/* eslint-disable @typescript-eslint/no-explicit-any */
// Stub file — replaced automatically when `npx convex dev` runs.

export const api: any = new Proxy(
  {},
  {
    get: () =>
      new Proxy(
        {},
        {
          get: () => "",
        }
      ),
  }
);

export const internal: any = api;
