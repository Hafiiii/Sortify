// hooks
import { getAllFeedbacks } from '../../hooks/getAllFeedbacks';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Rating ⬆', value: 'rating-asc' },
    { label: 'Rating ⬇', value: 'rating-desc' },
    { label: 'Date Joined ⬆', value: 'date-new' },
    { label: 'Date Joined ⬇', value: 'date-old' },
];

// ----------------------------------------------------------------------

export default function FeedbackCMS() {
    const { feedbacks, setFeedbacks, loading } = getAllFeedbacks();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
        if (sortOption === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        if (sortOption === 'date-new') return b.dateAdded.toDate() - a.dateAdded.toDate();
        if (sortOption === 'date-old') return a.dateAdded.toDate() - b.dateAdded.toDate();

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={true}
            hasImage={false}
            isArray={false}
            data={feedbacks}
            setData={setFeedbacks}
            loading={loading}
            searchData={(item) => `${item.name} ${item.email} ${item.feedbackId}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="feedbacks"
            listData={(data) => ({
                first: data.name,
                third: data.email,
                fourth: data.feedback,
                id: data.id,
                points: data.rating,
                date: data.dateAdded,
            })}
            modalData={{
                first: 'Name',
                second: 'Email',
                third: 'Message',
                fourth: 'Feedback ID',
                fifth: 'Date Added',
                sixth: 'Rating',
            }}
        />
    );
}