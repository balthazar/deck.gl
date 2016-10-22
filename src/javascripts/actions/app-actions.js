import {request, text} from 'd3-request';
import {StreamParser} from '../utils/worker-utils';

export function loadContent(filename) {
  return (dispatch, getState) => {
    const {contents} = getState();
    if (filename in contents) {
      // already loaded
      return;
    }
    dispatch(loadContentStart(filename));
    text(filename, (error, response) => {
      dispatch(loadContentSuccess(filename, error ? error : response));
    });
  }
}

function loadContentStart(name) {
  return loadContentSuccess(name, '');
}

function loadContentSuccess(name, content) {
  const payload = {};
  payload[name] = content;
  return {type: 'LOAD_CONTENT', payload};
}

export function updateMap(viewport) {
  return {type: 'UPDATE_MAP', viewport};
}

export function loadData(owner, {url, worker}) {

  return (dispatch, getState) => {
    if (getState().app.owner === owner) {
      // already loading / loaded
      return;
    }

    dispatch(loadDataStart(owner));
    if (request) {
      var req = request(url);
      var dataParser = new StreamParser(worker, (data, meta) => {
        dispatch(loadDataSuccess(owner, data, meta));
      });

      req.on('progress', dataParser.onProgress)
        .on('load', dataParser.onLoad)
        .get();
    }
  };
}

function loadDataStart(owner) {
  return {type: 'LOAD_DATA_START', owner};
}

function loadDataSuccess(owner, data, meta) {
  meta = meta || {count: data.length};
  return {
    type: 'LOAD_DATA_SUCCESS',
    payload: {owner, data, meta}
  };
}

export function updateParam(name, value) {
  return {type: 'UPDATE_PARAM', payload: {name, value}};
}

export function useParams(params) {
  return {type: 'USE_PARAMS', params};
}
