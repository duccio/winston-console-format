import colors from "colors/safe"
import { TransformableInfo } from "logform"
import { LEVEL, MESSAGE } from "triple-beam"
import util from "util"
import { format } from "winston"

import { consoleFormat } from "../src"

describe("consoleFormat", () => {
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home"
  }
  const out = consoleFormat().transform(info)

  it("should not be a boolean", () => {
    expect(typeof info !== "boolean").toBe(true)
  })

  it("should not change info", () => {
    expect(out).toMatchObject(info)
  })

  it("should contain single-line decoration with dimmed color", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${colors.dim("▪")}${colors.reset(" ")}`)
  })

  it("should contain info message", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(info.message)
  })
})

describe("consoleFormat (with meta, showMeta: true)", () => {
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    meta: { key: "value" }
  }
  const out = consoleFormat().transform(info)

  it("should contain multi-line decoration with dimmed color", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${colors.dim("┏")}${colors.reset(" ")}`)
  })

  it("should contain info message", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(info.message)
  })

  it("should contain meta object", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(util.inspect(info.meta))
  })
})

describe("consoleFormat (with meta, metaStrip: ['meta'])", () => {
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    meta: { key: "value" }
  }
  const out = consoleFormat({ metaStrip: ["meta"] }).transform(info)

  it("should not contain meta object", () => {
    expect((out as TransformableInfo)[MESSAGE]).not.toContain(util.inspect(info.meta))
  })
})

describe("consoleFormat (with meta, showMeta: false)", () => {
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    meta: { key: "value" }
  }
  const out = consoleFormat({ showMeta: false }).transform(info)

  it("should contain single-line decoration with dimmed color", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${colors.dim("▪")}${colors.reset(" ")}`)
  })

  it("should contain info message", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(info.message)
  })

  it("should not contain meta object", () => {
    expect((out as TransformableInfo)[MESSAGE]).not.toContain(util.inspect(info.meta))
  })
})

describe("consoleFormat (with error, showMeta: true)", () => {
  const error = new Error()
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    stack: error.stack
  }
  const out = consoleFormat().transform(info)

  it("should contain multi-line decoration with dimmed color", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${colors.dim("┏")}${colors.reset(" ")}`)
  })

  it("should contain info message", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(info.message)
  })

  it("should contain error stack", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(util.inspect(error).split("\n")[1])
  })
})

describe("consoleFormat (with ms)", () => {
  const info = {
    level: "info",
    message: "127.0.0.1 - there's no place like home"
  }
  const out = format.combine(format.ms(), consoleFormat()).transform(info)

  it("should contain ms", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(colors.italic(colors.dim(" +0ms")))
  })
})

describe("consoleFormat (with pad levels)", () => {
  const info = {
    [LEVEL]: "info",
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    meta: { key: "value" }
  }
  const out = format.combine(format.padLevels(), consoleFormat()).transform(info)

  it("should contain padding in first line", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${info.level}:    ${colors.dim("┏")}`)
  })

  it("should contain padding in last line", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(`${colors.dim(info.level)}:    ${colors.dim("┗")}`)
  })
})

describe("consoleFormat (with colorize)", () => {
  const info = {
    [LEVEL]: "info",
    level: "info",
    message: "127.0.0.1 - there's no place like home",
    meta: { key: "value" }
  }
  const out = format.combine(format.colorize(), consoleFormat()).transform(info)

  it("should contain color in first line", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(info.level)
  })

  it("should contain color in last line", () => {
    expect((out as TransformableInfo)[MESSAGE]).toContain(colors.dim(info.level))
  })
})
