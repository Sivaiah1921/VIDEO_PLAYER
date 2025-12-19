/*TODO fix the implementation so that the build command will generate a seperate CSS file from our sass includes.  The goal is that whenever a generator is used to create a component/container that the SCSS will be manually added to the main theme .scss file
*/
export const componentsSCSS = function(path){
	return {
		type: 'modify',
		path: '../../src/theme/theme.scss',
		pattern: '../../src/components/\/[a-z]+\.scss///g,
	}
};
