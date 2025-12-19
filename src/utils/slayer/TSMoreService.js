import { useAxios } from './useAxios';
import serviceConst from './serviceConst';
const { TSMORE } = serviceConst;

const TSMoreService = ( props ) => {

  const { response: tSMoreResponse, error: tSMoreError, loading: tSMoreLoading } = useAxios( {
    url: TSMORE,
    method: 'GET'
  } );

  let tSMoreData = { tSMoreResponse, tSMoreError, tSMoreLoading };

  return tSMoreData;

};

export default TSMoreService;