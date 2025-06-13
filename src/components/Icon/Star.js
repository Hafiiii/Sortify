import Iconify from "react-native-iconify";

// ----------------------------------------------------------------------

export function Star1({ style = {}, ...props }) {
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