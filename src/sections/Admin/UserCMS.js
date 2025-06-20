// hooks
import { getAllUsers } from '../../hooks/getAllUsers';
// components
import SkeletonCMS from './SkeletonCMS';

// ----------------------------------------------------------------------

const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Points ⬆', value: 'point-asc' },
    { label: 'Points ⬇', value: 'point-desc' },
    { label: 'Date Joined ⬆', value: 'date-new' },
    { label: 'Date Joined ⬇', value: 'date-old' },
];

// ----------------------------------------------------------------------

export default function UserCMS() {
    const { users, setUsers, loading } = getAllUsers();

    const getSortFunction = (sortOption) => (a, b) => {
        if (sortOption === 'name-asc') return a.firstName.localeCompare(b.firstName);
        if (sortOption === 'name-desc') return b.firstName.localeCompare(a.firstName);
        if (sortOption === 'point-asc') return (a.totalPoints || 0) - (b.totalPoints || 0);
        if (sortOption === 'point-desc') return (b.totalPoints || 0) - (a.totalPoints || 0);
        if (sortOption === 'date-new') return b.dateJoined.toDate() - a.dateJoined.toDate();
        if (sortOption === 'date-old') return a.dateJoined.toDate() - b.dateJoined.toDate();

        return 0;
    };

    return (
        <SkeletonCMS
            hasDate={true}
            isArray={false}
            data={users}
            setData={setUsers}
            loading={loading}
            searchData={(item) => `${item.firstName} ${item.lastName} ${item.uid} ${item.email} ${item.phoneNumber}`}
            sortOptions={sortOptions}
            getSortFunction={getSortFunction}
            title="users"
            imageName="photoURL"
            storageFileName="profile_images"
            listData={(data) => ({
                first: data.firstName,
                second: data.lastName,
                third: data.email,
                fourth: data.phoneNumber,
                id: data.id,
                image: data.photoURL,
                points: data.totalPoints,
                score: data.totalScore,
                date: data.dateJoined,
                fifth: data.gender,
                sixth: data.birthday,
            })}
            modalData={{
                first: 'Name',
                second: 'Email',
                third: 'Contact No',
                fourth: 'User ID',
                fifth: 'Date Joined',
                sixth: 'Total Points',
                seventh: 'Total Score',
                eight: 'Gender',
                ninth: 'Birthday',
            }}
            editData={{
                first: 'firstName',
                second: 'lastName',
                fourth: 'photoURL',
                seventh: 'phoneNumber',
                eight: 'birthday'
            }}
        />
    );
}