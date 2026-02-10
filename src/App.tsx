import Button from './components/Button/Button'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Gauge Design System</h1>
        <p>Component Library</p>
      </header>

      <main className="app-main">
        <section className="component-section">
          <h2>Button Component</h2>

          <div className="variant-group">
            <h3>Primary Buttons</h3>
            <div className="button-row">
              <Button tipo="Pri Default" text="Default" />
              <Button tipo="Pri Hover" text="Hover" />
              <Button tipo="Pri Focused" text="Focused" />
              <Button tipo="Pri Disabled" text="Disabled" />
            </div>
          </div>

          <div className="variant-group">
            <h3>Secondary Buttons</h3>
            <div className="button-row">
              <Button tipo="Sec Default" text="Default" />
              <Button tipo="Sec Hover" text="Hover" />
              <Button tipo="Sec Focused" text="Focused" />
              <Button tipo="Sec Disabled" text="Disabled" />
            </div>
          </div>

          <div className="variant-group">
            <h3>Tertiary Buttons</h3>
            <div className="button-row">
              <Button tipo="Ter Default" text="Default" />
              <Button tipo="Ter Hover" text="Hover" />
              <Button tipo="Ter Focused" text="Focused" />
              <Button tipo="Ter Disabled" text="Disabled" />
            </div>
          </div>

          <div className="variant-group">
            <h3>Text Buttons</h3>
            <div className="button-row">
              <Button tipo="Text btn Default" text="Default" />
              <Button tipo="Text btn Hover" text="Hover" />
              <Button tipo="Text btn Focused" text="Focused" />
              <Button tipo="Text btn Disabled" text="Disabled" />
            </div>
          </div>

          <div className="variant-group">
            <h3>With Icons</h3>
            <div className="button-row">
              <Button tipo="Pri Default" text="With Left Icon" showIconLeft />
              <Button tipo="Pri Default" text="With Right Icon" showIconRight />
              <Button tipo="Sec Default" text="Both Icons" showIconLeft showIconRight />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
