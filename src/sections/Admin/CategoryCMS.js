// hooks
import { getCategories } from '../../hooks/getCategories';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
];

// ----------------------------------------------------------------------

export default function CategoryCMS() {
    const { categories, setCategories, loading } = getCategories();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.categoryName.localeCompare(b.categoryName);
        if (sortOption === 'name-desc') return b.categoryName.localeCompare(a.categoryName);

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={false}
            isArray={false}
            data={categories}
            setData={setCategories}
            loading={loading}
            searchData={(item) => `${item.categoryName} ${item.categoryRecycle}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="categories"
            imageName="categoryURL"
            storageFileName="category_images"
            listData={(data) => ({
                first: data.categoryName,
                third: data.categoryRecycle,
                id: data.id,
                image: data.categoryURL,
                isRecyclable: data.isRecyclable,
                fifth: data.categoryIcon,
                sixth: data.categoryId,
            })}
            modalData={{
                first: 'Name',
                second: 'How to Dispose',
                fourth: 'Category ID',
                eight: 'Icon',
                ninth: 'Category No',
                tenth: 'Recyclable',
            }}
            editData={{
                first: 'categoryName',
                second: 'categoryRecycle',
                third: 'categoryId',
                fourth: 'categoryURL',
                fifth: 'categoryIcon',
                sixth: 'isRecyclable',// toggle switch
            }}
            addData={{
                first: 'categoryName',
                second: 'categoryRecycle',
                third: 'categoryId',
                fourth: 'categoryURL',
                fifth: 'categoryIcon',
                sixth: 'isRecyclable',// toggle switch
            }}
        />
    );
}