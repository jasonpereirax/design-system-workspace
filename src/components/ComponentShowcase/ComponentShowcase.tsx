import { useState } from 'react'
import styles from './ComponentShowcase.module.css'

export type VariantExample = {
  name: string
  description: string
  usage: string
  component: React.ReactNode
  code: string
}

export type ComponentShowcaseProps = {
  title: string
  description: string
  variants: VariantExample[]
}

export default function ComponentShowcase({ title, description, variants }: ComponentShowcaseProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, variantName: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(variantName)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className={styles.showcase}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.variants}>
        {variants.map((variant) => (
          <div key={variant.name} className={styles.variant}>
            <div className={styles.variantHeader}>
              <h3 className={styles.variantName}>{variant.name}</h3>
              <span className={styles.variantUsage}>{variant.usage}</span>
            </div>

            <p className={styles.variantDescription}>{variant.description}</p>

            <div className={styles.preview}>
              <div className={styles.previewLabel}>Preview</div>
              <div className={styles.previewContent}>
                {variant.component}
              </div>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLabel}>Code Example</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(variant.code, variant.name)}
                >
                  {copiedCode === variant.name ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre className={styles.code}>
                <code>{variant.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
