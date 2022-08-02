export const getStringDate = (date) => { //현재 날짜를 초기값으로
    return date.toISOString().slice(0, 10);
}