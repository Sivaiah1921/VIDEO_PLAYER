/**
 * This component provides the list of languages can be supported for the program
 *
 * @module views/components/LanguageList
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './LanguageList.scss';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';

/**
 * Represents a LanguageList component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LanguageList
 */
export const LanguageList = function( props ){
  const { LanguageList } = props;
  return (
    LanguageList && LanguageList.length > 0 &&
    <div className='LanguageList'>
      <div className='LanguageList__item'>
        <Icon name='Audio'></Icon>
      </div>
      { LanguageList?.map( ( args, index ) => (
        <div key={ index }
          className='LanguageList__item'
        >
          <Text textStyle='subtitle-1'
            htmlTag='p'
          >{ args }</Text>
        </div>
      )
      )
      }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {array} LanguageList - language list
 */
export const propTypes =  {
  LanguageList: PropTypes.array
};



LanguageList.propTypes = propTypes;
export default LanguageList;
