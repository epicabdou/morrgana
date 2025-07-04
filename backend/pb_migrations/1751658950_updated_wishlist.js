/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702485544")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_FM1ig7HLsT` ON `wishlist` (\n  `user`,\n  `product`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702485544")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
