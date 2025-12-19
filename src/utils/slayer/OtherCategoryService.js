import serviceConst from './serviceConst'
import { useAxios } from './useAxios';

export const OtherCategoryService = ( props ) => {
  const { OTHER_CATEGORIES } = serviceConst;
  let fetchCategories = {};
  const homeParams = {
    url: OTHER_CATEGORIES,
    method: 'GET'
  }
  const { fetchData, response, error, loading } = useAxios( homeParams );
  fetchCategories = { fetchData: ( newHomeParams ) => {
    fetchData( Object.assign( homeParams, newHomeParams ) )
  }, response, error, loading };

  return [fetchCategories];
}