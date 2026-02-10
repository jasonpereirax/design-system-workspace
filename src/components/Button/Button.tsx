import React from 'react'
import styles from './Button.module.css'

const imgAdd = "https://www.figma.com/api/mcp/asset/dc942d8a-aa9b-4c30-a289-43f0112c5fca"
const imgAdd1 = "https://www.figma.com/api/mcp/asset/3a585fde-c14b-49c8-9997-d8c3ccbde95c"
const imgRemove = "https://www.figma.com/api/mcp/asset/55373837-8d39-463e-aee7-281425b03e3d"
const imgRemove1 = "https://www.figma.com/api/mcp/asset/a6339e7c-5714-4642-bdb9-e987fef278ab"
const imgAdd2 = "https://www.figma.com/api/mcp/asset/92ce87ee-e7e7-4ea9-87ad-bd08847bd0ca"

function AddIcon({ className }: { className?: string }) {
  return (
    <div className={className || styles.icon} data-name="add">
      <div
        className={styles.iconMask}
        style={{
          maskImage: `url('${imgAdd}')`,
          WebkitMaskImage: `url('${imgAdd}')`
        }}
      >
        <img alt="" src={imgAdd1} />
      </div>
    </div>
  )
}

function RemoveIcon({ className }: { className?: string }) {
  return (
    <div className={className || styles.icon} data-name="remove">
      <div
        className={styles.iconMaskRemove}
        style={{
          maskImage: `url('${imgAdd}')`,
          WebkitMaskImage: `url('${imgAdd}')`
        }}
      >
        <img alt="" src={imgRemove} />
      </div>
    </div>
  )
}

export type ButtonProps = {
  className?: string
  iconLeft?: React.ReactNode | null
  iconRight?: React.ReactNode | null
  showIconLeft?: boolean
  showIconRight?: boolean
  text?: string
  tipo?:
    | "Pri Default"
    | "Pri Hover"
    | "Pri Focused"
    | "Pri Disabled"
    | "Sec Default"
    | "Sec Hover"
    | "Sec Focused"
    | "Sec Disabled"
    | "Ter Hover"
    | "Ter Focused"
    | "Ter Disabled"
    | "Ter Default"
    | "Text btn Default"
    | "Text btn Hover"
    | "Text btn Focused"
    | "Text btn Disabled"
  onClick?: () => void
}

export default function Button({
  className,
  iconLeft = null,
  iconRight = null,
  showIconLeft = false,
  showIconRight = false,
  text = "Button",
  tipo = "Pri Default",
  onClick
}: ButtonProps) {
  // Button variant checks
  const isPriDefault = tipo === "Pri Default"
  const isPriDisabled = tipo === "Pri Disabled"
  const isPriDisabledOrPriFocusedOrPriHover = ["Pri Disabled", "Pri Focused", "Pri Hover"].includes(tipo)
  const isPriFocused = tipo === "Pri Focused"
  const isPriHover = tipo === "Pri Hover"

  const isSecDefault = tipo === "Sec Default"
  const isSecDisabled = tipo === "Sec Disabled"
  const isSecFocused = tipo === "Sec Focused"
  const isSecFocusedOrSecDefault = ["Sec Focused", "Sec Default"].includes(tipo)
  const isSecHover = tipo === "Sec Hover"

  const isTerDefault = tipo === "Ter Default"
  const isTerDisabled = tipo === "Ter Disabled"
  const isTerDisabledOrTerFocusedOrTerDefault = ["Ter Disabled", "Ter Focused", "Ter Default"].includes(tipo)
  const isTerFocused = tipo === "Ter Focused"
  const isTerHover = tipo === "Ter Hover"

  const isTextBtnDefault = tipo === "Text btn Default"
  const isTextBtnDisabledOrTerDisabledOrTerFocusedOrTerDefaultOrSec = ["Text btn Disabled", "Ter Disabled", "Ter Focused", "Ter Default", "Sec Disabled"].includes(tipo)
  const isTextBtnDisabledOrTextBtnFocusedOrTextBtnHoverOrTextBtnDefault = ["Text btn Disabled", "Text btn Focused", "Text btn Hover", "Text btn Default", "Ter Disabled", "Ter Focused", "Ter Hover", "Ter Default", "Sec Disabled", "Sec Focused", "Sec Hover", "Sec Default", "Pri Disabled", "Pri Focused", "Pri Hover"].includes(tipo)
  const isTextBtnFocused = tipo === "Text btn Focused"
  const isTextBtnFocusedOrTextBtnDefaultOrSecFocusedOrSecDefault = ["Text btn Focused", "Text btn Default", "Sec Focused", "Sec Default"].includes(tipo)
  const isTextBtnHover = tipo === "Text btn Hover"
  const isTextBtnHoverOrSecHover = ["Text btn Hover", "Sec Hover"].includes(tipo)

  // Determine button classes
  const buttonClasses = [
    styles.button,
    className
  ].filter(Boolean).join(' ')

  const getVariantClass = () => {
    if (isPriHover) return styles.priHover
    if (isPriFocused || isPriDefault) return styles.priDefault
    if (isPriDisabled) return styles.priDisabled
    if (isSecHover) return styles.secHover
    if (isSecFocusedOrSecDefault) return styles.secDefault
    if (isSecDisabled) return styles.secDisabled
    if (isTerHover) return styles.terHover
    if (isTerDisabledOrTerFocusedOrTerDefault) return styles.terDefault
    return styles.textBtn
  }

  const getTextColorClass = () => {
    if (isTextBtnDisabledOrTerDisabledOrTerFocusedOrTerDefaultOrSec) return styles.textGray
    if (isTextBtnFocusedOrTextBtnDefaultOrSecFocusedOrSecDefault) return styles.textRed
    if (isPriDisabledOrPriFocusedOrPriHover) return styles.textWhite
    if (isTextBtnHoverOrSecHover) return styles.textDarkRed
    if (isTerHover) return styles.textDarkGray
    return styles.textWhite
  }

  return (
    <button
      className={`${buttonClasses} ${getVariantClass()}`}
      onClick={onClick}
      disabled={isPriDisabled || isSecDisabled || isTerDisabled || tipo === "Text btn Disabled"}
    >
      {/* Icon Left */}
      {isTextBtnDisabledOrTextBtnFocusedOrTextBtnHoverOrTextBtnDefault && showIconLeft && (
        iconLeft || <RemoveIcon />
      )}

      {isPriDefault && showIconLeft && (
        iconLeft || <RemoveIcon />
      )}

      {/* Text */}
      <span className={getTextColorClass()}>
        {text}
      </span>

      {/* Icon Right */}
      {isTextBtnDisabledOrTerDisabledOrTerFocusedOrTerDefaultOrSec && showIconRight && (
        iconRight || <AddIcon />
      )}

      {isTextBtnFocusedOrTextBtnDefaultOrSecFocusedOrSecDefault && showIconRight && (
        iconRight || <AddIcon />
      )}

      {isPriDisabledOrPriFocusedOrPriHover && showIconRight && (
        iconRight || <AddIcon />
      )}

      {isTextBtnHoverOrSecHover && showIconRight && (
        iconRight || <AddIcon />
      )}

      {isTerHover && showIconRight && (
        iconRight || <AddIcon />
      )}

      {isPriDefault && showIconRight && (
        iconRight || <AddIcon />
      )}
    </button>
  )
}
