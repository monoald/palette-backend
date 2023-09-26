const Svg2 = require("oslllo-svg2")
const Potrace = require("oslllo-potrace")

// const sv = `
// <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.72 2.291c-.127.062-.662.575-1.806 1.729-1.788 1.805-1.782 1.796-1.677 2.145.067.223.381.535.598.594.345.093.407.051 1.455-.991l.95-.944v14.352l-.95-.944c-1.054-1.046-1.124-1.094-1.455-.995-.218.065-.533.38-.598.598-.105.349-.111.34 1.677 2.145.894.902 1.689 1.675 1.766 1.717a.727.727 0 0 0 .64 0c.077-.042.872-.815 1.766-1.717 1.786-1.802 1.771-1.782 1.673-2.145-.059-.217-.371-.531-.594-.598-.331-.099-.401-.051-1.455.995l-.95.944V4.824l.95.944c1.048 1.042 1.11 1.084 1.455.991.221-.06.534-.373.594-.594.098-.363.113-.343-1.673-2.145-1.632-1.646-1.83-1.819-2.086-1.819a.833.833 0 0 0-.28.09" fill-rule="evenodd" fill="#000"/></svg>
//   `

const Svg = function (svg) {
  this.filled = false
  this.traceResolution = 600
  this.svg2 = Svg2(svg)
  this.element = this.svg2.toElement()
  this.outerHTML = this.element.outerHTML
  this.original = this.getOriginal()
  this.resized = this.getResized()
  this.scale = this.getScale()
}

Svg.prototype = {
  getResized: function () {
    var element = Svg2(this.outerHTML).svg.resize(this.getResizeDimensions()).toElement()
    var svg2 = Svg2(element.outerHTML)
    var dimensions = svg2.svg.dimensions()

    return { element, svg2, dimensions }
  },
  getResizeDimensions() {
    const width = this.traceResolution

    return {
      width: width,
      height: (width / this.original.dimensions.width) * this.original.dimensions.height,
    }
  },
  getOriginal: function () {
    var element = this.element.cloneNode(true)
    var dimensions = this.svg2.svg.dimensions()
    var attributes = this.getAttributes(element)

    return { element, dimensions, attributes }
  },
  getScale: function () {
    return this.original.dimensions.width / this.resized.dimensions.width
  },
  getFirstPathElement(element) {
    return element.getElementsByTagName("path")[0]
  },
  getAttributes(element) {
    return Object.values(element.attributes).map(function (attribute) {
      /**
       * Ignore <path></path> "d" attribute.
       */
      if (attribute && attribute.name && attribute.name !== "d") {
        return { name: attribute.name, value: attribute.value }
      }

      return false
    })
  },
  resetAttributes(element, attributes) {
    var i = element.attributes.length
    while (i >= 0) {
      var attribute = element.attributes[i]
      /**
       * Ignore <path></path> "d" attribute.
       */
      if (attribute && attribute.name !== "d") {
        element.removeAttribute(attribute.name)
      }
      i--
    }
    this.setAttributes(element, attributes)
  },
  valueIsNotBlack(value) {
    return value !== "#000" && value !== "black"
  },
  setAttributes(element, attributes) {
    attributes.forEach((attribute) => {
      if (attribute) {
        if (attribute.name === "viewBox") {
          const value = attribute.value.split(" ")
          const x = 2
          for (var i = 0; i < x; i++) {
            /**
             * Set min-x & min-y to 0
             */
            value[i] = "0"
          }
          element.setAttribute(attribute.name, value.join(" "))
        } else if (
          element.tagName.toLowerCase() === "path" 
          // element.tagName.toLowerCase() === "polyline"
        ) {
          if (
            (attribute.name === "stroke" && this.valueIsNotBlack(attribute.value)) ||
            (attribute.name === "fill" && this.valueIsNotBlack(attribute.value))
          ) {
            element.setAttribute(attribute.name, attribute.value)
          }
        } else {
          element.setAttribute(attribute.name, attribute.value)
        }
      }
    })

    if (element.tagName.toLowerCase() === "path") {
      [
        { name: "stroke", value: "none" },
        { name: "fill-rule", value: "evenodd" },
      ].forEach((attr) => {
        element.setAttribute(attr.name, attr.value)
      })

      if (!this.filled) {
        const pathColor = this.getPathStyleFillColor()
        const fill = pathColor ? pathColor : "black"
        element.setAttribute("fill", fill)
      }
    }
  },
  getPathStyleFillColor() {
    var path = this.getFirstPathElement(this.original.element)
    var style = path.getAttribute("style")
    if (!style) {
      return false
    }
    var fill = style.split("").find((e) => e.includes("fill:"))
    if (fill && !fill.includes("none")) {
      const splits = fill.split(":")

      // eslint-disable-next-line no-magic-numbers
      return splits[splits.length - 1]
    }

    return false
  },
  toOriginal: function (outerHTML) {
    var element = Svg2(outerHTML).toElement()
    this.resetAttributes(element, this.original.attributes)

    var originalPath = this.getFirstPathElement(this.original.element)
    if (originalPath) {
      var path = this.getFirstPathElement(element)
      this.resetAttributes(path, this.getAttributes(originalPath))
    }

    return element.outerHTML
  },
  hasFill(el) {
    if (Object.prototype.hasOwnProperty.call(el.attributes, "fill")) {
      if (el.attributes.fill.value !== "none") {
        this.filled = true

        return true
      }
    }

    return false
  },
  setFillBlack(el) {
    el.setAttribute("fill", "#000")
  },
  checkFillState(el) {
    var path = this.getFirstPathElement(el)
    if (path && this.hasFill(path)) {
      this.setFillBlack(path)
    } else if (this.hasFill(el)) {
      this.setFillBlack(el)
    }

    return el
  },
  process: async function () {
    var element = this.checkFillState(this.resized.element.cloneNode(true))
    if (!element.getAttribute("viewBox")) {
      element.setAttribute("viewBox", `0 0 ${this.original.dimensions.width} ${this.original.dimensions.height}`)
    }
    var pngBuffer = await Svg2(element.outerHTML).png({ transparent: false }).toBuffer()
    var traced = await Potrace(pngBuffer, { svgSize: this.scale }).trace()
    traced = this.toOriginal(traced)

    return traced
  },
}

module.exports = Svg
