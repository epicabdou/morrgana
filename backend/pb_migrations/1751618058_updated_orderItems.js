/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = @collection.orderItems.order.user || @request.auth.isAdmin = true",
    "viewRule": "@request.auth.id = @collection.orderItems.order.user || @request.auth.isAdmin = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = @collection.orderItems.order.user",
    "viewRule": "@request.auth.id = @collection.orderItems.order.user"
  }, collection)

  return app.save(collection)
})
