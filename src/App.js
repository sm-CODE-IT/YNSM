import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useEffect, useReducer, useRef } from 'react';

import Home from './pages/Home'
import Edit from './pages/Edit'
import New from './pages/New'
import Diary from './pages/Diary'
import './App.css';

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const reducer = (state, action) => { //모든 데이터 수정
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        it.id === action.data.id ?  ...action.data  : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem('diary', JSON.stringify(newState)); //로컬스토리지에  newState 저장
  return newState;
};

const App = () => {
  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const localData = localStorage.getItem('diary');
    if (localData&&localData.length) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      ); //내림차순 정렬
      if (diaryList&&diaryList.length != 0) {
        dataId.current = parseInt(diaryList[0].id) + 1; //새로운 아이디 = 가장 큰 아이디 + 1
        dispatch({ type: 'INIT', data: diaryList });
      }
    } else {
      dispatch({ type: 'INIT', data: [] });
    }
  }, []);

  //console.log(new Date().getTime()); //현재 시간 확인용
  const dataId = useRef(0);

  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };

  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  //EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    < DiaryStateContext.Provider value={data} >
      <DiaryDispatchContext.Provider
        value={{
          onCreate,
          onEdit,
          onRemove,
        }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} /> //아무것도 없으면 home 페이지 반환
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/diary" element={<Diary />} />
            </Routes>
            {/* <a></a> 테그는 mpa 기능 */}
            {/* <RouteTest></RouteTest> */}
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider >
  );
}
export default App;
