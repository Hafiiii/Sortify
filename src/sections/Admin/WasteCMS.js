// hooks
import { getAllWastes } from '../../hooks/getAllWastes';
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

export default function WasteCMS() {
    const { wastes, setWastes, loading } = getAllWastes();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.wasteName.localeCompare(b.wasteName);
        if (sortOption === 'name-desc') return b.wasteName.localeCompare(a.wasteName);
        if (sortOption === 'date-new') return b.dateAdded.toDate() - a.dateAdded.toDate();
        if (sortOption === 'date-old') return a.dateAdded.toDate() - b.dateAdded.toDate();

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={true}
            data={wastes}
            setData={setWastes}
            loading={loading}
            searchData={(item) => `${item.wasteName} ${item.wasteType}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="wastes"
            imageName="photoURL"
            storageFileName="wastes_images"
            listData={(data) => ({
                first: data.wasteName,
                third: data.wasteType,
                fifth: data.score,
                id: data.id,
                image: data.photoURL,
                date: data.dateAdded,
                sixth: data.uid,
            })}
            modalData={{
                first: 'Name',
                second: 'Category',
                fourth: 'Waste ID',
                fifth: 'Date Added',
                eight: 'Score',
                ninth: 'User ID',
            }}
        />
    );
}