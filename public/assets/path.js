const scriptPath = document.getElementsByTagName( 'script' );

for ( var i = 0; i < scriptPath.length; i++ ){
  if( scriptPath[i].src.indexOf( 'path' ) !== -1 ){
    window.basePath = scriptPath[i].src.substring( 0, scriptPath[i].src.lastIndexOf( 'assets' ) );
    window.assetBasePath = scriptPath[i].src.substring( 0, scriptPath[i].src.lastIndexOf( 'path' ) );
  }
}