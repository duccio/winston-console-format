import colors from "colors/safe"
import { Format, TransformableInfo } from "logform"
import { LEVEL, MESSAGE, SPLAT } from "triple-beam"
import { inspect, InspectOptions } from "util"

export interface ConsoleFormatOptions {
  showMeta?: boolean
  metaStrip?: string[]
  inspectOptions?: InspectOptions
}

export class ConsoleFormat {
  private static readonly reSpaces = /^\s+/
  private static readonly reSpacesOrEmpty = /^(\s*)/
  private static readonly reColor = /\x1B\[\d+m/
  private static readonly defaultStrip = [LEVEL, MESSAGE, SPLAT, "level", "message", "ms", "stack"]
  private static readonly chars = {
    singleLine: "▪",
    startLine: "┏",
    line: "┃",
    endLine: "┗",
  }

  public constructor(private opts: ConsoleFormatOptions = {}) {
    if (typeof this.opts.showMeta === "undefined") {
      this.opts.showMeta = true
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private inspector(value: any, messages: string[]): void {
    const inspector = inspect(value, this.opts.inspectOptions || {})

    inspector.split("\n").forEach((line) => {
      messages.push(line)
    })
  }

  private message(info: TransformableInfo, chr: string, color: string): string {
    const message = info.message.replace(
      ConsoleFormat.reSpacesOrEmpty,
      `$1${color}${colors.dim(chr)}${colors.reset(" ")}`
    )

    return `${info.level}:${message}`
  }

  private pad(message?: string): string {
    let spaces = ""
    const matches = message && message.match(ConsoleFormat.reSpaces)
    if (matches && matches.length > 0) {
      spaces = matches[0]
    }

    return spaces
  }

  private ms(info: TransformableInfo): string {
    let ms = ""
    if (info.ms) {
      ms = colors.italic(colors.dim(` ${info.ms}`))
    }

    return ms
  }

  private stack(info: TransformableInfo): string[] {
    const messages: string[] = []

    if (info.stack) {
      const error = new Error()
      error.stack = info.stack
      this.inspector(error, messages)
    }

    return messages
  }

  private meta(info: TransformableInfo): string[] {
    const messages: string[] = []
    const stripped = { ...info }

    ConsoleFormat.defaultStrip.forEach((e) => delete stripped[e])
    this.opts.metaStrip && this.opts.metaStrip.forEach((e) => delete stripped[e])

    if (Object.keys(stripped).length > 0) {
      this.inspector(stripped, messages)
    }

    return messages
  }

  private getColor(info: TransformableInfo): string {
    let color = ""
    const colorMatch = info.level.match(ConsoleFormat.reColor)

    if (colorMatch) {
      color = colorMatch[0]
    }

    return color
  }

  private write(info: TransformableInfo, messages: string[], color: string): void {
    const pad = this.pad(info.message)

    messages.forEach((line, index, arr) => {
      const lineNumber = colors.dim(`[${(index + 1).toString().padStart(arr.length.toString().length, " ")}]`)
      let chr = ConsoleFormat.chars.line
      if (index === arr.length - 1) {
        chr = ConsoleFormat.chars.endLine
      }
      info[MESSAGE] += `\n${colors.dim(info.level)}:${pad}${color}${colors.dim(chr)}${colors.reset(" ")}`
      info[MESSAGE] += `${lineNumber} ${line}`
    })
  }

  public transform(info: TransformableInfo): TransformableInfo {
    const messages: string[] = []

    if (this.opts.showMeta) {
      messages.push(...this.stack(info))
      messages.push(...this.meta(info))
    }

    const color = this.getColor(info)

    info[MESSAGE] = this.message(info, ConsoleFormat.chars[messages.length > 0 ? "startLine" : "singleLine"], color)
    info[MESSAGE] += this.ms(info)

    this.write(info, messages, color)

    return info
  }
}

export const consoleFormat = (opts?: ConsoleFormatOptions): Format => {
  return new ConsoleFormat(opts)
}
