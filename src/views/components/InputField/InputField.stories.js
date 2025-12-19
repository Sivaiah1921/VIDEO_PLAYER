import React from 'react'
import InputField from './InputField'

export default {
  title: 'Atoms/InputField',
  parameters: {
    component: InputField,
    componentSubtitle: 'The InputField component is to capture user input.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const BasicUsage = ( args )=>(
  <InputField
    { ...args }
  />
)

BasicUsage.args = {
  type: 'text',
  label: 'First Name',
  autoComplete: 'on',
  autoCorrect: 'on',
  maxLength: 32,
  disabled: false
};

BasicUsage.argTypes = {
  type: {
    control: 'select',
    options: ['text', 'number', 'password', 'email', 'tel', 'date']
  }
}
