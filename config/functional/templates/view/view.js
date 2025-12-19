/**
 * {{ componentDescription }}
 *
 * @module views/components/{{ properCase componentName }}
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
{{#if isCSSNeeded}}
import './{{ properCase componentName }}.scss';
{{/if}}
{{#if isGridNeeded}}
import Grid from '../GridContainer/GridContainer';
{{/if}}

/**
 * Represents a {{ componentName }} component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns {{ properCase componentName }}
 */
export const {{ properCase componentName }} = function( props ){
  return (
    <div className='{{ properCase componentName }}'>
      {{#if isGridNeeded}}
      <Grid
        fullContent={ <div></div> }
        fullContentBackgroundColor='orange'
      >
        { props.example }
      </Grid>
      {{else}}
      { props.example }
      {{/if}}
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world'
};

{{ properCase componentName }}.propTypes = propTypes;
{{ properCase componentName }}.defaultProps = defaultProps;

export default {{ properCase componentName }};
