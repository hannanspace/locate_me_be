import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'locations.index': { paramsTuple?: []; params?: {} }
    'locations.create': { paramsTuple?: []; params?: {} }
    'locations.store': { paramsTuple?: []; params?: {} }
    'locations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'locations.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'locations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'locations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'locations.index': { paramsTuple?: []; params?: {} }
    'locations.create': { paramsTuple?: []; params?: {} }
    'locations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'locations.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'locations.index': { paramsTuple?: []; params?: {} }
    'locations.create': { paramsTuple?: []; params?: {} }
    'locations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'locations.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'locations.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'locations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'locations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'locations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}