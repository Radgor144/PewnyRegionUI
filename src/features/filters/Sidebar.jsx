import TimeRangePicker from './TimeRangePicker';
import FilterList from './FilterList';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <TimeRangePicker />
            <FilterList />
            <button className="submit-button" style={{ marginTop: 'auto', padding: '10px' }}>
                Zatwierdź
            </button>
        </aside>
    );
};

export default Sidebar;