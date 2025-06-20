import Iconify from "react-native-iconify";

// ----------------------------------------------------------------------

export function Star1({ style = {}, ...props }) {
    return (
        <>
            <SingleStar style={{ top: 15, right: 110 }} />
            <SingleStar style={{ top: -15, left: 130 }} />
            <SingleStar style={{ top: 45, left: 20 }} />
            <SingleStar style={{ top: 30, left: 105 }} />
            <SingleStar style={{ top: 75, right: 95 }} />
            <SingleStar style={{ top: 20, right: 155 }} />
            <SingleStar style={{ top: 110, right: 15 }} />
        </>
    );
}

export function Star2({ style = {}, ...props }) {
    return (
        <>
            <SingleStar style={{ top: 0, right: 100 }} />
            <SingleStar style={{ top: 60, right: 40 }} />
            <SingleStar style={{ top: 135, right: 80 }} />
            <SingleStar style={{ top: 0, left: 65 }} />
            <SingleStar style={{ top: 70, left: 85 }} />
            <SingleStar style={{ top: 120, left: 45 }} />
            <SingleStar style={{ top: 150, left: 115 }} />
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
                zIndex: 0,
                top: 30,
                ...style,
            }}
        />
    );
}