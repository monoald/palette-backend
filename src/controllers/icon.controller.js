const JSZip = require('jszip')

const IconService = require('../service/icon.service')

const service = new IconService

const createIcon = async (req, res, next) => {
  try {
    const { name, color, icons, thumbnail } = req.body
    const { userId } = req

    const newIcon = await service.create({ name, color, icons, thumbnail }, userId)
    res.status(201).json(newIcon)
  } catch (error) {
    next(error)
  }
}

const getIcons = async (req, res, next) => {
  try {
    const { page } = req.query
    const icons = await service.find(page)
    res.json(icons)
  } catch (error) {
    next(error)
  }
}

const getIcon = async (req, res, next) => {
  try {
    const { id } = req.params
    const icon = await service.findOne(id)
    res.json(icon)
  } catch(error) {
    next(error)
  }
}

const updateIcon = async (req, res, next) => {
  try {
    const { id } = req.params

    const icon = await service.update(req.body, id)
    res.json(icon)
  } catch (error) {
    next(error)
  }
}

const deleteIcon = async (req, res, next) => {
  const { id } = req.params
  const { userId } = req

  try {
    const result = await service.delete(userId, id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const downloadFonts = async (req, res, next) => {
  const { name } = req.params

  try {
    const result = await service.downloadFonts(name)

    const zip = new JSZip()
    
    zip.loadAsync(result.fonts, { base64: true, createFolders: true })
      .then(file => {
        zip.file(file)
        zip.generateAsync({ type: 'nodeBuffer' })
          .then(content => {
            res.setHeader('Content-Disposition', `attachment; filename=${result.name}.zip`);
            res.setHeader('Content-Type', 'application/zip');
            res.end(content)
          })
      })
  } catch (error) {
    next(error)
  }
}

const downloadIcons = async (req, res, next) => {
  const { name } = req.params

  try {
    const result = await service.downloadIcons(name)

    const zip = new JSZip()
    
    zip.loadAsync(result.icons, { base64: true, createFolders: true })
      .then(file => {
        zip.file(file)
        zip.generateAsync({ type: 'nodeBuffer' })
          .then(content => {
            res.setHeader('Content-Disposition', `attachment; filename=${result.name}.zip`);
            res.setHeader('Content-Type', 'application/zip');
            res.end(content)
          })
      })
  } catch (error) {
    next(error)
  }
}

module.exports = { createIcon, getIcons, getIcon, updateIcon, deleteIcon, downloadFonts, downloadIcons }
