/**
 * @param { Object } vars - Variables exported from a Sass file
 * @returns { Object } - Javascript object with grouped variables according to SASS map function
 */
export const objectifySassVars = ( vars ) => {
  if( !vars ){
    return false;
  }
  const varsObject = {};
  const sassVars = Object.entries( vars );

  sassVars?.forEach( ( [name, value] ) => {
    const [prop, subprop] = name.split( '-' );
    const noQuotesValue = typeof value === 'string' && value.includes( '"' ) ? value.replace( /['"]+/g, '' ) : value;
    if( !subprop ){
      varsObject[prop] = noQuotesValue;
    }
    else {
      varsObject[prop] = varsObject[prop] || {};
      varsObject[prop][subprop] = noQuotesValue;
    }
  } );
  return varsObject;
};