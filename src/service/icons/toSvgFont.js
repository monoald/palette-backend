const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { SVGPathData } = require('svg-pathdata')

const { Matrix } = require('./svg/Matrix')
const strokeToFill = require('./svg/strokeToFill')
const svgShapesToPath = require('./svg/svgshapes2svgpath')

async function toSvgFont(icons, name, color, fontSize = 300) {

  const normalizedSvgs = []

  for (let i = 0; i < icons.length; i++) {
    normalizedSvgs.push( await normalizeSvg(icons[i], color))
  }

  const glyphs = normalizedSvgs.map(svg => {
    return getGlyph(svg, name, 300)
  })

  const svgFont = `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font id="${name}" horiz-adv-x="${fontSize}">
      <font-face font-family="${name}"
        units-per-em="${fontSize}" ascent="${fontSize}"
        descent="0" />
      <missing-glyph horiz-adv-x="0" />
      ${glyphs.join('\n      ')}
    </font>
  </defs>
</svg>
`
  return {
    normalized: normalizedSvgs,
    font: svgFont
  }
}

async function normalizeSvg(svg, color) {
  if (svg.content.includes('stroke') && !(svg.content.includes('stroke="none"') || svg.content.includes('stroke=\'none\''))) {
    svg.content = await strokeToFill(svg.content, svg.color, color)
  }
  return svg
}

function getGlyph(svg, name, fontSize) {
  const dom = new JSDOM(svg.content)
  const parent = dom.window.document.querySelector('svg')

  const el = {
    attributes: {},
    tagName: parent.tagName,
    isSelfClosing: isSelfClosedTag(parent),
  }

  for (let i = 0; i < parent.attributes.length; i++) {
    el.attributes[parent.attributes[i].name] = parent.attributes[i].value
  }

  let glyph = {
    name: svg.name,
    unicode: svg.unicode,
    paths: []
  }
  glyph = { ...glyph, ...reduceSvg(parent, name, glyph) }

  for (let i = 0; i < parent.children.length; i++) {
  const current = parent.children[i]

    const currentEl = {
      attributes: {},
      tagName: current.tagName,
      isSelfClosing: isSelfClosedTag(current),
    }

    for (let i = 0; i < current.attributes.length; i++) {
      currentEl.attributes[current.attributes[i].name] = current.attributes[i].value
    }

    glyph = { ...glyph, ...reduceSvg(current, name, glyph) }
  }

  const svgFont = getSvgFont(glyph, fontSize)

  return svgFont
}

function isSelfClosedTag(element) {
  const outerHTML = element.outerHTML.toLowerCase()

  return outerHTML.endsWith('/>')
}


function reduceSvg(element, name, glyph) {
  const transformStack = [new Matrix()]

  const applyTransform = (d) => {
    return new SVGPathData(d).matrix(
      ...transformStack[transformStack.length - 1].toArray()
    )
  }

  let values
  let color 
  if (element.tagName !== 'svg') {
    color = element.attributes.fill
      ? element.attributes.fill.value
      : element.attributes.stroke.value
  }
  if (element.tagName === 'svg') {
    if ('viewBox' in element.attributes) {
      values = element.attributes.viewBox.value.split(/\s*,*\s|\s,*\s*|,/)

      const dX = parseFloat(values[0])
      const dY = parseFloat(values[1])
      const width = parseFloat(values[2])
      const height = parseFloat(values[3])

      glyph.width =
        'width' in element.attributes
          ? parseFloat(element.attributes.width.value)
          : width
      glyph.height =
        'height' in element.attributes
          ? parseFloat(element.attributes.height.value)
          : height

      transformStack[transformStack.length - 1]
        .translate(-dX, -dY)
        .scale(glyph.width / width, glyph.height / height)
    } else {
      if ('width' in element.attributes) {
        glyph.width = parseFloat(element.attributes.width.value)
      } else {
        console.log(
          `Glyph "${name}" has no width attribute, using current glyph horizontal bounds.`
        )
        glyph.defaultWidth = true
      }
      if ('height' in element.attributes) {
        glyph.height = parseFloat(element.attributes.height.value)
      } else {
        console.log(
          `Glyph "${name}" has no height attribute, using current glyph vertical bounds.`
        )
        glyph.defaultHeight = true
      }
    }
  } else if ('clipPath' === element.tagName) {
    console.log(
      `Found a clipPath element in the icon "${name}" the result may be different than expected.`
    )
  } else if ('rect' === element.tagName && 'none' !== color) {
    glyph.paths.push(
      applyTransform(svgShapesToPath.rectToPath(element.attributes))
    )
  } else if ('line' === element.tagName && 'none' !== color) {
    console.log(
      `Found a line element in the icon "${name}" the result could be different than expected.`
    )
    glyph.paths.push(
      applyTransform(svgShapesToPath.lineToPath(element.attributes))
    )
  } else if ('polyline' === element.tagName && 'none' !== color) {
    console.log(
      `Found a polyline element in the icon "${name}" the result could be different than expected.`
    )
    glyph.paths.push(
      applyTransform(svgShapesToPath.polylineToPath(element.attributes))
    )
  } else if ('polygon' === element.tagName && 'none' !== color) {
    glyph.paths.push(
      applyTransform(svgShapesToPath.polygonToPath(element.attributes))
    )
  } else if (
    ['circle', 'ellipse'].includes(element.tagName) &&
    'none' !== color
  ) {
    glyph.paths.push(
      applyTransform(svgShapesToPath.circleToPath(element.attributes))
    )
  } else if (
    'path' === element.tagName &&
    element.attributes.d.value &&
    'none' !== color
  ) {
    glyph.paths.push(applyTransform(element.attributes.d.value))
  }

  return glyph
}

function getSvgFont(glyph, fontSize) {
  const ratio = fontSize / glyph.height
  glyph.width *= ratio
  glyph.height *= ratio

  const glyphPath = new SVGPathData('')
  const yOffset = glyph.height

  const glyphPathTransform = new Matrix().transform(
    1,
    0,
    0,
    -1,
    0,
    yOffset
  )
  if (1 !== ratio) {
    glyphPathTransform.scale(ratio, ratio)
  }

  glyph.paths.forEach((path) => {
    glyphPath.commands.push(
      ...path.toAbs().matrix(...glyphPathTransform.toArray()).commands
    )
  })

  const bounds = glyphPath.getBounds()

  glyphPath.translate(
    (glyph.width - (bounds.maxX - bounds.minX)) / 2 - bounds.minX
  )
  glyphPath.translate(
    0,
    (fontSize - (bounds.maxY - bounds.minY)) / 2 -
      bounds.minY
  )

  const d = glyphPath.round(10000000000000).encode();

  const svgFont = `<glyph
        glyph-name="${glyph.name}"
        unicode="&#x${glyph.unicode};"
        horiz-adv-x="${glyph.width}"
        d="${d}"
      />
  `

  return svgFont
}

module.exports = toSvgFont