import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import MyButton from "../components/MyButton";
import MyHeader from "./../components/MyHeader";
import DiaryList from "../components/DiaryList";

const Home = () => {

    const diaryList = useContext(DiaryStateContext);

    const [data, setData] = useState([]);
    const [curDate, setCurDate] = useState(new Date());
    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

    useEffect(() => {
        if (diaryList.length >= 1) {
            const firstDay = new Date( //이번 달 첫번째 날
                curDate.getFullYear(),
                curDate.getMonth(),
                1
            ).getTime();

            const lastDay = new Date( //이번 달 마지막 날
                curDate.getFullYear(),
                curDate.getMonth() + 1,
                0,
                23,
                59,
                59 //이 달의 마지막 시간까지!! 줘야 31일 포함 가능
            ).getTime();

            setData(
                diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
            );
        }
    }, [diaryList, curDate]); //다이어리 리스트가 바뀌거나 달이 변경될 때

    const increaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
        );
    }

    const decreaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
        );
    }

    return (
        <div>
            <MyHeader
                headText={headText}
                leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
                rightChild={<MyButton text={">"} onClick={increaseMonth} />}
            />
            <DiaryList diaryList={data} />
        </div>
    );
};

export default Home;