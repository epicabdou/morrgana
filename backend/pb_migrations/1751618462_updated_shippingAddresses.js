/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3268994155")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = \"\"",
    "deleteRule": "@request.auth.id = user.id",
    "listRule": "@request.auth.id = user.id || @request.auth.isAdmin = true",
    "updateRule": "@request.auth.id = user.id",
    "viewRule": "@request.auth.id = user.id || @request.auth.isAdmin = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3268994155")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
