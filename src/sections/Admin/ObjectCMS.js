// hooks
import { getObjects } from '../../hooks/getObjects';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
];

// ----------------------------------------------------------------------

export default function ObjectCMS() {
    const { objects, setObjects, loading } = getObjects();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.objName.localeCompare(b.objName);
        if (sortOption === 'name-desc') return b.objName.localeCompare(a.objName);

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={false}
            hasAdd={false}
            isArray={true}
            data={objects}
            setData={setObjects}
            loading={loading}
            searchData={(item) => `${item.objName}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="objects"
            listArrayData={(data) => ({
                first: data.objName,
                second: data.categoryNames,
                // id: data.id,
                // image: data.categoryURL,
                // isRecyclable: data.isRecyclable,
            })}
            // para={{
            //     first: 'objName',
            //     second: 'categoryRecycle',
            //     third: 'categoryId', // number
            //     fourth: 'categoryURL', // image
            //     fifth: 'categoryIcon',
            //     sixth: 'isRecyclable',// toggle switch
            // }}
        />
    );
}