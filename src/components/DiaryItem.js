import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";
import { DiaryDispatchContext } from "./../App.js"

const DiaryItem = ({ id, emotion, content, date }) => {

    const strDate = new Date(parseInt(date)).toLocaleDateString(); //시간 객체 생성
    const navigate = useNavigate();

    const goDetail = () => {
        navigate(`/diary/${id}`);
    }

    const goEdit = () => {
        navigate(`/edit/${id}`);
    }

    const { onRemove } = useContext(DiaryDispatchContext);

    const handleRemove = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            onRemove(id);
            navigate('/', { replace: true });
        }
    }

    return <div className="DiaryItem">
        <div
            onClick={goDetail}
            className={[
                "emotion_img_wrapper", `emotion_img_wrapper_${emotion}`
            ].join(" ")}>
            <img src={process.env.PUBLIC_URL + `/assets/emotion${emotion}.png`} />
        </div>
        <div
            onClick={goDetail}
            className="info_wrapper">
            <div className="diary_date">
                {strDate}
            </div>
            <div className="diary_content_preview">
                {content.slice(0, 25)}
            </div>
        </div>
        <div className="btn_wrapper">
            <MyButton text={"수정하기"} onClick={goEdit} /><br />
            <MyButton text={'삭제하기'} type={"negative"} onClick={handleRemove} />
        </div>
    </div>
}

export default React.memo(DiaryItem);