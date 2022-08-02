const MyButton = ({ text, type, onClick }) => {

    //type이 positive이나 negative 둘 중 하나가 아니면 default로
    const btnType = ['positive', 'negative'].includes(type) ? type : 'default';

    return (
        <button className={["MyButton", `MyBotton_${btnType}`].join(" ")}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

MyButton.defaultProps = {
    type: "default",
};

export default MyButton;