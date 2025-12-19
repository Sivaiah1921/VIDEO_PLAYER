import React from 'react';
import Text from './Text';

export default {
  title: 'Atoms/Text',
  parameters: {
    component: Text,
    componentSubtitle: 'This is the new Text component. It accepts parameters for HTML tag, formatting &#x27;textStyle&#x27;, text alignment, font style, decoration and color override.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const TextWithBasicUsage = () => {
  return (
    <>
      <Text
        htmlTag='h1'
        textStyle='header-1'
      >
        header-1
      </Text>
      <Text
        htmlTag='h1'
        textStyle='header-2'
      >
        header-2
      </Text>
      <Text
        htmlTag='h1'
        textStyle='header-3'
      >
        header-3
      </Text>
      <Text
        htmlTag='h1'
        textStyle='header-4'
      >
        header-4
      </Text>
      <Text
        htmlTag='h1'
        textStyle='header-5'
      >
        header-5
      </Text>
      <Text
        htmlTag='h1'
        textStyle='header-6'
      >
        header-6
      </Text>
      <Text
        htmlTag='h1'
        textStyle='title-1'
      >
        title-1
      </Text>
      <Text
        htmlTag='h2'
        textStyle='title-2'
      >
        title-2
      </Text>
      <Text
        htmlTag='h3'
        textStyle='title-3'
      >
        title-3
      </Text>
      <Text
        htmlTag='p'
        textStyle='body-1'
      >
        body-1
      </Text>
      <Text
        htmlTag='p'
        textStyle='body-2'
      >
        body-2
      </Text>
      <Text
        htmlTag='p'
        textStyle='body-3'
      >
        body-3
      </Text>
      <Text
        htmlTag='p'
        textStyle='numberInput-2'
      >
        numberInput-2
      </Text>
    </>
  )
};

export const Playground = ( args ) => {
  return (
    <Text
      { ...args }
    />

  )

};

Playground.args = {
  textStyle: 'body2',
  htmlTag: 'p',
  textAlign: 'left',
  color: 'orange-300',
  fontStyle: 'default',
  textDecoration:'default',
  children: 'Advanced usage sample text',
  spacerValue: '01'
}
const textStyleList = ['body-1', 'body-2', 'body-3', 'eyebrow', 'subtitle-1', 'subtitle-2', 'subtitle-3', 'subtitle-4',
  'title-1', 'title-2', 'title-3', 'title-4', 'title-5', 'title-6', 'header-1', 'header-2', 'header-3', 'header-4', 'header-5', 'header-6'];

const colorList = [
  'white',
  'neutral-25',
  'neutral-50',
  'neutral-100',
  'neutral-200',
  'neutral-300',
  'neutral-400',
  'neutral-500',
  'neutral-600',
  'neutral-700',
  'neutral-800',
  'neutral-900',
  'black',
  'orange-300',
  'orange-200',
  'orange-100',
  'magenta-500',
  'magenta-400',
  'magenta-200',
  'magenta-100',
  'fire-400',
  'fire-200',
  'fire-100',
  'plum-700',
  'plum-200',
  'plum-100'
];

Playground.argTypes = {
  textStyle: {
    control: 'select',
    options: textStyleList
  },
  htmlTag: {
    control: 'select',
    options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  },
  textAlign: {
    control: 'select',
    options: ['left', 'center', 'right']
  },
  fontStyle: {
    control: 'select',
    options: ['default', 'italic']
  },
  spacerValue: {
    control: 'select',
    options: ['00', '01', '02', '03', '04', '05', '06', '07', '08']
  },
  color: {
    control: 'select',
    options: colorList
  },
  textDecoration: {
    control: 'select',
    options: ['default', 'underline', 'line-through']
  }

}
