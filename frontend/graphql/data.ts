import fg from "fast-glob"
import * as fs from "fs"
import * as path from "path"
import yaml from "js-yaml"
import GeoPattern from "geopattern"

const postFiles = fg.sync(["content/posts/**/index.yml"], { absolute: true })
const authorFiles = fg.sync(["content/users/**/index.yml"], {
  absolute: true,
})
const resourceFiles = fg.sync(["content/resources/**/index.yml"], {
  absolute: true,
})

export const posts = postFiles.map((filePath) => {
  const post = yaml.safeLoad(fs.readFileSync(filePath))
  const folder = path.parse(filePath)

  // This can't be a fully dynamic require, since the optimize image plugin (webpack, to be specific)
  // can't handle it for some reason. See https://github.com/cyrilwanner/next-optimized-images/issues/16#issuecomment-416066832
  post.image = require(`../content/posts/${path.basename(folder.dir)}/${
    post.banner
  }`)

  post.hostname = new URL(post.url).hostname
  post.createdAt = new Date(post.createdAt).toISOString()

  return post
})

export const users = authorFiles.map((filePath) => {
  const user = yaml.safeLoad(fs.readFileSync(filePath))
  const folder = path.parse(filePath)

  user.id = path.basename(folder.dir)

  // This can't be a fully dynamic require, since the optimize image plugin (webpack, to be specific)
  // can't handle it for some reason. See https://github.com/cyrilwanner/next-optimized-images/issues/16#issuecomment-416066832
  user.avatar = require(`../content/users/${user.id}/${user.avatar}`)

  user.createdAt = new Date(user.createdAt).toISOString()

  return user
})

export const resources = resourceFiles.map((filePath) => {
  const resource = yaml.safeLoad(fs.readFileSync(filePath))
  const folder = path.parse(filePath)

  resource.id = path.basename(folder.dir)

  if (resource.image) {
    // This can't be a fully dynamic require, since the optimize image plugin (webpack, to be specific)
    // can't handle it for some reason. See https://github.com/cyrilwanner/next-optimized-images/issues/16#issuecomment-416066832
    resource.image = require(`../content/resources/${path.basename(
      folder.dir
    )}/${resource.banner}`)
  } else {
    const pattern = GeoPattern.generate(resource.title)
    resource.image = pattern.toDataUri()
  }

  resource.hostname = new URL(resource.url).hostname
  resource.createdAt = new Date(resource.createdAt).toISOString()

  return resource
})
