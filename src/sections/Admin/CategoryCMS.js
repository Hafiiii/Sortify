// hooks
import { getCategories } from '../../hooks/getCategories';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    // { label: 'Total Points ⬆', value: 'point-asc' },
    // { label: 'Total Points ⬇', value: 'point-desc' },
];

// ----------------------------------------------------------------------

export default function CategoryCMS() {
    const { categories, setCategories, loading } = getCategories();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.categoryName.localeCompare(b.categoryName);
        if (sortOption === 'name-desc') return b.categoryName.localeCompare(a.categoryName);
        // if (sortOption === 'point-asc') return (a.totalPoints || 0) - (b.totalPoints || 0);
        // if (sortOption === 'point-desc') return (b.totalPoints || 0) - (a.totalPoints || 0);

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={false}
            hasAdd={true}
            isArray={false}
            data={categories}
            setData={setCategories}
            loading={loading}
            searchData={(item) => `${item.categoryName} ${item.categoryRecycle}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="categories"
            storageFileName="category_images"
            listData={(data) => ({
                first: data.categoryName,
                third: data.categoryRecycle,
                id: data.id,
                image: data.categoryURL,
                isRecyclable: data.isRecyclable,
            })}
            para={{
                first: 'categoryName',
                second: 'categoryRecycle',
                third: 'categoryId', // number
                fourth: 'categoryURL', // image
                fifth: 'categoryIcon',
                sixth: 'isRecyclable',// toggle switch
            }}
        />
    );
}