const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function setAttributes(paths, color) {
  const colorSvg = color === '#' ? '#ffffff' : color

  for (let i = 0; i < paths.length; i++) {
    const attributes = paths[i].attributes

    if (attributes.fill && attributes.fill.value !== 'none') {
      attributes.fill.value = colorSvg
    }

    if (attributes.stroke && attributes.stroke.value !== 'none') {
      attributes.stroke.value = colorSvg
    }
  }
}

function changeIconColor(icon, color) {
  const dom = new JSDOM(icon)
  
  const svgs = dom.window.document.getElementsByTagName('svg')
  setAttributes(svgs, color)
  
  const paths = dom.window.document.getElementsByTagName('path')
  setAttributes(paths, color)

  const clipPaths = dom.window.document.getElementsByTagName('clipPath')
  setAttributes(clipPaths, color)

  const rects = dom.window.document.getElementsByTagName('rect')
  setAttributes(rects, color)

  const lines = dom.window.document.getElementsByTagName('line')
  setAttributes(lines, color)

  const polylines = dom.window.document.getElementsByTagName('polyline')
  setAttributes(polylines, color)

  const polygons = dom.window.document.getElementsByTagName('polygon')
  setAttributes(polygons, color)

  const circles = dom.window.document.getElementsByTagName('circle')
  setAttributes(circles, color)

  const ellipses = dom.window.document.getElementsByTagName('ellipse')
  setAttributes(ellipses, color)

  return svgs[0].outerHTML
}

module.exports = changeIconColor