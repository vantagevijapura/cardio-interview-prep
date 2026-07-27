import { onRequest as __api_coach_js_onRequest } from "/Users/nv/Library/CloudStorage/Dropbox/DevProjects/cardio-interview-prep/functions/api/coach.js"

export const routes = [
    {
      routePath: "/api/coach",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_coach_js_onRequest],
    },
  ]