import React from 'react';
import Link from './Link'
import Icon from '../Icon/Icon';
import { BrowserRouter } from 'react-router-dom';


export default {
  title: 'Atoms/Link',
  parameters: {
    component: Link,
    componentSubtitle: 'The Link component, or anchor element, along with its href attribute, creates a hyperlink to other web pages, files, locations within the same page or email addresses.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const LinkWithHover = () => {
  return (
    <BrowserRouter>
      <Link
        withHover
      >
        Movie
      </Link>
      <br></br>
      <Link
        withHover
        disabled
      >
        Label
      </Link>
    </BrowserRouter>
  )
};

export const LinkCompact = () => {
  return (
    <BrowserRouter>
      <Link
        compact
      >
        Label
      </Link>

      <br></br>
      <Link
        compact
        disabled
      >
        Label
      </Link>
    </BrowserRouter>
  )
};

export const LinkSecondary = () => {
  return (
    <BrowserRouter>
      <Link
        secondary
      >
        Label
      </Link>
    </BrowserRouter>
  )
};

export const LinkButtonStyles = () => {
  return (
    <BrowserRouter>
      <div style={
        {
          'display': 'flex',
          'width': 'calc(100% + var(--gap))',
          'padding': '1rem',
          'margin': 'calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap))',
          'flexDirection': 'row',
          'flexWrap': 'wrap',
          'justifyContent': 'space-between'
        }
      }
      >
        <div style={ { 'margin': '1rem 0' } }>
          Primary:&nbsp; &nbsp;
          <Link
            likeButtonPrimary
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>Primary with hover:&nbsp; &nbsp;
          <Link
            likeButtonPrimary
            likeButtonWithHover
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>Primary compact:&nbsp; &nbsp;
          <Link
            likeButtonPrimary
            likeButtonCompact
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>Primary compact with hover:&nbsp; &nbsp;
          <Link
            likeButtonPrimary
            likeButtonWithHover
            likeButtonCompact
          >
            Label
          </Link>
        </div>
      </div>
      <div style={
        {
          'display': 'flex',
          'width': 'calc(100% + var(--gap))',
          'padding': '1rem',
          'margin': 'calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap))',
          'flexDirection': 'row',
          'flexWrap': 'wrap',
          'justifyContent': 'space-between',
          'backgroundColor': 'rgb( 253, 241, 243 )'
        }
      }
      >
        <div style={ { 'margin': '1rem 0' } }>Secondary: &nbsp; &nbsp;
          <Link
            likeButtonSecondary
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>Secondary with hover: &nbsp; &nbsp;
          <Link
            likeButtonSecondary
            likeButtonWithHover
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>
          Secondary compact: &nbsp; &nbsp;
          <Link
            likeButtonSecondary
            likeButtonCompact
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>
          Secondary compact with hover: &nbsp; &nbsp;
          <Link
            likeButtonSecondary
            likeButtonWithHover
            likeButtonCompact
          >
            Label
          </Link>
        </div>
      </div>

      <div style={
        {
          'display': 'flex',
          'width': 'calc(100% + var(--gap))',
          'padding': '1rem',
          'margin': 'calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap))',
          'flexDirection': 'row',
          'flexWrap': 'wrap',
          'justifyContent': 'space-between'
        }
      }
      >
        <div style={ { 'margin': '1rem 0' } }>
          Outline: &nbsp; &nbsp;
          <Link
            likeButtonOutline
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>
          Outline with hover: &nbsp; &nbsp;
          <Link
            likeButtonOutline
            likeButtonWithHover
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>
          Outline compact: &nbsp; &nbsp;
          <Link
            likeButtonOutline
            likeButtonCompact
          >
            Label
          </Link>
        </div>
        <div style={ { 'margin': '1rem 0' } }>
          Outline compact with hover: &nbsp; &nbsp;
          <Link
            likeButtonOutline
            likeButtonWithHover
            likeButtonCompact
          >
            Label
          </Link>
        </div>
      </div>
    </BrowserRouter>
  )
};

export const LinkIcon = () => {
  return (
    <BrowserRouter>
      <div>
        <Link
          url='someurl'
          iconImage={ 'ArrowDown' }
          iconSize={ 's' }
          iconRight={ true }
        >
          Label
        </Link>
      </div>
      <div>
        <Link
          url='someurl'
          iconImage={ 'ArrowDown' }
          iconSize={ 's' }
          iconRight={ false }
        >
          Label
        </Link>
      </div>
    </BrowserRouter>
  )
};

export const Playground = ( args ) => {
  const mockFn = e => e;
  return (
    <BrowserRouter>
      <Link
        onClick={ mockFn }
        { ...args }
      >
        <Icon
          size='s'
          name={ 'Add' }
        />
        Label
      </Link>
    </BrowserRouter>
  );
}

Playground.args = {
  id: 'link',
  title: 'Connect',
  url: 'www.test.com',
  tabIndex: 3,
  target: '_blank',
  ariaLabel: 'arealabel',
  withHover: false,
  compact: false,
  secondary: false,
  disabled: false,
  likeButtonPrimary: false,
  likeButtonSecondary: false,
  likeButtonOutline: false,
  likeButtonWithHover: false,
  likeButtonCompact: false
}