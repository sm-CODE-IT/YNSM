import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmotionItem from "./EmotionItem";
import MyButton from "./MyButton";
import MyHeader from "./MyHeader";
import { DiaryDispatchContext } from "./../App.js"
import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";
import Uploader from "./uploader";

const DiaryEditor = ({ isEdit, originData }) => {
    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);
    const [files, setFiles] = useState();
    const navigate = useNavigate();
    const [date, setDate] = useState(getStringDate(new Date())); //현재 날짜를 초기값으로

    const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);

    const handleClickEmote = useCallback((emotion) => {
        setEmotion(emotion);
    }, []);

    const handleSubmit = () => {
        if (content.length < 1) {
            contentRef.current.focus();
            return;
        }

        if (window.confirm(isEdit ? "일기를 수정하시겠습니까? " : "새로운 일기를 작성하시겠습니까?")) {
            if (!isEdit) {
                onCreate(date, content, emotion);
            }
            else {
                onEdit(originData.Id, date, content, emotion);
            }
            
        }
        navigate("/", { replace: true });
    };

    //삭제 함수
    const handleRemove = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            onRemove(originData.id);
            
        }
        navigate('/', { replace: true }); //홈으로 돌려보냄 + 뒤로가기로 접근X
    }

    useEffect(() => {
        if (isEdit) {
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    }, [isEdit, originData]);

    //사진 업로드하기!!!!!!!!
     const onLoadFile = (e) => {
         const file = e.target.files;
         setFiles(file);

         // const formdata = new FormData(); //생성자 객체 생성
         // formdata.append('uploadImage', files[0]); //새로운 이미지 추가

     };

     const _image = useRef();
     useEffect(() => {
         if (files) {
             const imgEl = _image.current;
             const reader = new FileReader();

             reader.onLoad = () => (
                 imgEl.style.backgroundImage = `url(${reader.result})`
             );

             reader.readAsDataURL(files[0]);
         };
     }, [files]);

    return (
        <div className="DiaryEditor">
            <MyHeader
                headText={isEdit ? "일기 수정하기" : "새 일기쓰기"}
                leftChild={
                    <MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)} />
                }
                rightChild={
                    isEdit && (
                        <MyButton text={'삭제하기'} type={"negative"} onClick={handleRemove} />
                    )
                }
            />

            <div>
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input
                            className="input_date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                </section>
                <section>
                    <h4>오늘의 감정</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((it) => (
                            <EmotionItem
                                key={it.emotion_id}{...it}
                                onClick={handleClickEmote}
                                isSelected={it.emotion_id === emotion}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <h4>오늘의 일기</h4>
                    <div className="input_box text_wrapper">
                        <textarea
                            placeholder="오늘은 어땠나요?"
                            ref={contentRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </section>
                <section>
                    <h4>오늘의 사진</h4>
                    <Uploader />
                    {/* <div className="input_box photo_wrapper">
                        <form>
                            <input type="file" id="image" accept="image/*" onChange={onLoadFile} />
                        </form>
                        <div className="img_box" ref={_image}>
                            <img src="" alt="" />
                        </div>
                    </div> */}
                </section>
                <section>
                    <div className="control_box">
                        <MyButton
                            text={"취소하기"}
                            onClick={() => navigate(-1)} />
                        <MyButton
                            text={"작성 완료"}
                            type={"positive"}
                            onClick={handleSubmit} />
                    </div>
                </section>
            </div >
        </div >
    );
}

export default DiaryEditor