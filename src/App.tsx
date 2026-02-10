import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import ComponentShowcase from './components/ComponentShowcase/ComponentShowcase'
import { buttonVariants, buttonDescription } from './data/buttonData'
import './App.css'

function App() {
  const [activeSection] = useState('button')

  return (
    <div className="app">
      <Sidebar activeSection={activeSection} />

      <main className="main-content">
        <div className="content-wrapper">
          <header className="page-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Components</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Button</span>
            </div>
          </header>

          <ComponentShowcase
            title="Button"
            description={buttonDescription}
            variants={buttonVariants}
          />

          <section className="guidelines">
            <h2 className="guidelines-title">Best Practices</h2>
            <div className="guidelines-grid">
              <div className="guideline-card">
                <div className="guideline-icon">✓</div>
                <h3>Use appropriate hierarchy</h3>
                <p>Only use one primary button per section to maintain clear focus.</p>
              </div>
              <div className="guideline-card">
                <div className="guideline-icon">✓</div>
                <h3>Provide clear labels</h3>
                <p>Use action-oriented text that clearly describes what will happen when clicked.</p>
              </div>
              <div className="guideline-card">
                <div className="guideline-icon">✓</div>
                <h3>Consider icons carefully</h3>
                <p>Only add icons when they enhance understanding or recognition.</p>
              </div>
              <div className="guideline-card">
                <div className="guideline-icon">✓</div>
                <h3>Respect disabled states</h3>
                <p>Use disabled buttons to show unavailable actions, but provide context about why.</p>
              </div>
            </div>
          </section>

          <section className="api-section">
            <h2 className="api-title">Component API</h2>
            <div className="api-table">
              <table>
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>tipo</code></td>
                    <td><code>ButtonType</code></td>
                    <td><code>"Pri Default"</code></td>
                    <td>Defines the button variant and state</td>
                  </tr>
                  <tr>
                    <td><code>text</code></td>
                    <td><code>string</code></td>
                    <td><code>"Button"</code></td>
                    <td>The button label text</td>
                  </tr>
                  <tr>
                    <td><code>showIconLeft</code></td>
                    <td><code>boolean</code></td>
                    <td><code>false</code></td>
                    <td>Show icon on the left side</td>
                  </tr>
                  <tr>
                    <td><code>showIconRight</code></td>
                    <td><code>boolean</code></td>
                    <td><code>false</code></td>
                    <td>Show icon on the right side</td>
                  </tr>
                  <tr>
                    <td><code>iconLeft</code></td>
                    <td><code>ReactNode</code></td>
                    <td><code>null</code></td>
                    <td>Custom icon component for left side</td>
                  </tr>
                  <tr>
                    <td><code>iconRight</code></td>
                    <td><code>ReactNode</code></td>
                    <td><code>null</code></td>
                    <td>Custom icon component for right side</td>
                  </tr>
                  <tr>
                    <td><code>onClick</code></td>
                    <td><code>() =&gt; void</code></td>
                    <td><code>undefined</code></td>
                    <td>Click event handler</td>
                  </tr>
                  <tr>
                    <td><code>className</code></td>
                    <td><code>string</code></td>
                    <td><code>undefined</code></td>
                    <td>Additional CSS classes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <footer className="page-footer">
            <p>Built with the Gauge Design System • <a href="https://github.com/jasonpereirax/gauge-design-system" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
