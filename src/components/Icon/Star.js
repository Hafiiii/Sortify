import Iconify from "react-native-iconify";

// ----------------------------------------------------------------------

export default function Star({ style = {}, ...props }) {
    return (
        <>
            <SingleStar style={{ top: 95, right: 130 }} />
            <SingleStar style={{ top: 0, left: 160 }} />
            <SingleStar style={{ top: 90, left: 30 }} />
            <SingleStar style={{ top: 60, left: 135 }} />
            <SingleStar style={{ top: 130, right: 35 }} />
            <SingleStar style={{ top: 20, right: 155 }} />
            <SingleStar style={{ top: 130, right: 35 }} />
        </>
    );
}


function SingleStar({ style = {}, ...props }) {
    return (
        <Iconify
            icon="ph:star-four-fill"
            size={14}
            color="#fff"
            {...props}
            style={{
                position: 'absolute',
                zIndex: 1,
                top: 30,
                ...style,
            }}
        />
    );
}