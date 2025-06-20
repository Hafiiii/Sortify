// hooks
import { getAllIssues } from '../../hooks/getAllIssues';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Date Added ⬆', value: 'date-new' },
    { label: 'Date Added ⬇', value: 'date-old' },
];

// ----------------------------------------------------------------------

export default function IssueCMS() {
    const { issues, setIssues, loading } = getAllIssues();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'date-new') return b.dateAdded.toDate() - a.dateAdded.toDate();
        if (sortOption === 'date-old') return a.dateAdded.toDate() - b.dateAdded.toDate();

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={true}
            hasImage={true}
            isArray={false}
            data={issues}
            setData={setIssues}
            loading={loading}
            searchData={(item) => `${item.name} ${item.email} ${item.issueId}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="issues"
            imageName="imageURL"
            storageFileName="issue_images"
            listData={(data) => ({
                first: data.name,
                third: data.issueMessage,
                fifth: data.email,
                id: data.id,
                image: data.imageURL,
                date: data.dateAdded,
            })}
            modalData={{
                first: 'Name',
                second: 'Message',
                fourth: 'Issue ID',
                fifth: 'Date Added',
                eight: 'Email',
            }}
        />
    );
}