export {};

declare module 'vue-router' {
  interface RouteMeta {
    titleTag: string;
    noMenu?: boolean;
  }
}
