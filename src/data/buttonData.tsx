import Button from '../components/Button/Button'
import { VariantExample } from '../components/ComponentShowcase/ComponentShowcase'

export const buttonVariants: VariantExample[] = [
  {
    name: 'Primary Button',
    usage: 'Main Actions',
    description: 'Use primary buttons for the main call-to-action on a page. There should only be one primary button per section to maintain clear hierarchy.',
    component: (
      <>
        <Button tipo="Pri Default" text="Default" />
        <Button tipo="Pri Hover" text="Hover" />
        <Button tipo="Pri Focused" text="Focused" />
        <Button tipo="Pri Disabled" text="Disabled" />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Default state
<Button tipo="Pri Default" text="Click me" />

// With onClick handler
<Button
  tipo="Pri Default"
  text="Submit"
  onClick={() => console.log('Clicked!')}
/>

// Disabled state
<Button tipo="Pri Disabled" text="Disabled" />`
  },
  {
    name: 'Primary Button with Icons',
    usage: 'Enhanced Actions',
    description: 'Add icons to primary buttons to provide visual context and improve recognition. Icons can be placed on the left, right, or both sides.',
    component: (
      <>
        <Button tipo="Pri Default" text="Left Icon" showIconLeft />
        <Button tipo="Pri Default" text="Right Icon" showIconRight />
        <Button tipo="Pri Default" text="Both Icons" showIconLeft showIconRight />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Icon on the left
<Button
  tipo="Pri Default"
  text="Download"
  showIconLeft
/>

// Icon on the right
<Button
  tipo="Pri Default"
  text="Next"
  showIconRight
/>

// Icons on both sides
<Button
  tipo="Pri Default"
  text="Transfer"
  showIconLeft
  showIconRight
/>`
  },
  {
    name: 'Secondary Button',
    usage: 'Secondary Actions',
    description: 'Use secondary buttons for secondary actions that are important but not primary. They have less visual weight than primary buttons.',
    component: (
      <>
        <Button tipo="Sec Default" text="Default" />
        <Button tipo="Sec Hover" text="Hover" />
        <Button tipo="Sec Focused" text="Focused" />
        <Button tipo="Sec Disabled" text="Disabled" />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Default state
<Button tipo="Sec Default" text="Cancel" />

// With onClick handler
<Button
  tipo="Sec Default"
  text="Learn More"
  onClick={() => navigate('/docs')}
/>

// Disabled state
<Button tipo="Sec Disabled" text="Unavailable" />`
  },
  {
    name: 'Secondary Button with Icons',
    usage: 'Enhanced Secondary Actions',
    description: 'Secondary buttons can also include icons for better visual communication while maintaining their secondary hierarchy.',
    component: (
      <>
        <Button tipo="Sec Default" text="Settings" showIconLeft />
        <Button tipo="Sec Default" text="Export" showIconRight />
        <Button tipo="Sec Default" text="Share" showIconLeft showIconRight />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Secondary with left icon
<Button
  tipo="Sec Default"
  text="Settings"
  showIconLeft
/>

// Secondary with right icon
<Button
  tipo="Sec Default"
  text="Export"
  showIconRight
/>`
  },
  {
    name: 'Tertiary Button',
    usage: 'Subtle Actions',
    description: 'Use tertiary buttons for less important actions or when you need a subtle option. These have the least visual prominence.',
    component: (
      <>
        <Button tipo="Ter Default" text="Default" />
        <Button tipo="Ter Hover" text="Hover" />
        <Button tipo="Ter Focused" text="Focused" />
        <Button tipo="Ter Disabled" text="Disabled" />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Default state
<Button tipo="Ter Default" text="Skip" />

// With onClick handler
<Button
  tipo="Ter Default"
  text="View Details"
  onClick={() => setShowDetails(true)}
/>

// Disabled state
<Button tipo="Ter Disabled" text="Not Available" />`
  },
  {
    name: 'Text Button',
    usage: 'Minimal Actions',
    description: 'Text buttons are the most subtle option, used for low-priority actions or when space is limited. They appear as text until hovered.',
    component: (
      <>
        <Button tipo="Text btn Default" text="Default" />
        <Button tipo="Text btn Hover" text="Hover" />
        <Button tipo="Text btn Focused" text="Focused" />
        <Button tipo="Text btn Disabled" text="Disabled" />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Default state
<Button tipo="Text btn Default" text="Learn More" />

// With onClick handler
<Button
  tipo="Text btn Default"
  text="Show more"
  onClick={() => setExpanded(!expanded)}
/>

// Disabled state
<Button tipo="Text btn Disabled" text="Unavailable" />`
  },
  {
    name: 'Text Button with Icons',
    usage: 'Minimal Enhanced Actions',
    description: 'Text buttons with icons provide additional context while maintaining minimal visual weight. Perfect for navigation or expandable sections.',
    component: (
      <>
        <Button tipo="Text btn Default" text="Back" showIconLeft />
        <Button tipo="Text btn Default" text="Next" showIconRight />
        <Button tipo="Text btn Default" text="Expand" showIconLeft showIconRight />
      </>
    ),
    code: `import Button from './components/Button/Button'

// Text button with left icon
<Button
  tipo="Text btn Default"
  text="Go Back"
  showIconLeft
/>

// Text button with right icon
<Button
  tipo="Text btn Default"
  text="Continue"
  showIconRight
/>

// Perfect for navigation
<Button
  tipo="Text btn Default"
  text="View All"
  showIconRight
  onClick={() => navigate('/all')}
/>`
  }
]

export const buttonDescription = `
  The Button component is a fundamental building block of the Gauge Design System.
  It provides multiple variants to establish clear visual hierarchy and guide users through your interface.
  Each variant is designed for specific use cases and contexts.
`

export const buttonBestPractices = [
  {
    title: 'Use appropriate hierarchy',
    description: 'Only use one primary button per section to maintain clear focus.'
  },
  {
    title: 'Provide clear labels',
    description: 'Use action-oriented text that clearly describes what will happen when clicked.'
  },
  {
    title: 'Consider icons carefully',
    description: 'Only add icons when they enhance understanding or recognition.'
  },
  {
    title: 'Respect disabled states',
    description: 'Use disabled buttons to show unavailable actions, but provide context about why.'
  }
]
