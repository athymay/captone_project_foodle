import { useContext, useState } from 'react';

import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../AppContext';
import CalendarTab from './CalendarTab';
import IngredientsTab from './IngredientsTab';
import MyLists from './ListsTab';
import MyPantryTab from './MyPantryTab';

import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { KeyboardBackspace, SvgIconComponent } from '@mui/icons-material';

type SidebarTabName = 'Ingredients' | 'My Pantry' | 'Lists' | 'Calendar';

type SideBarTabsInfo = {
  name: SidebarTabName;
  icon: SvgIconComponent;
  tabComponent: JSX.Element;
}[];

const sidebarTabs: SideBarTabsInfo = [
  {
    name: 'Ingredients',
    icon: EggOutlinedIcon,
    tabComponent: <IngredientsTab />,
  },
  { name: 'My Pantry', icon: KitchenIcon, tabComponent: <MyPantryTab /> },
  { name: 'Lists', icon: FormatListBulletedIcon, tabComponent: <MyLists /> },
  {
    name: 'Calendar',
    icon: CalendarMonthOutlinedIcon,
    tabComponent: <CalendarTab />,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const { showSidebarTabOptions } = useContext(AppContext);

  const [currentTab, setCurrentTab] = useState<SidebarTabName | null>(null);

  function handleTabChange(name: SidebarTabName) {
    if (
      name === currentTab ||
      ['Ingredients', 'My Pantry', 'Lists'].includes(name)
    ) {
      navigate('/');
    } else if (name === 'Calendar') {
      navigate('/calendar');
    }
    setCurrentTab((prev) => (name === prev ? null : name));
  }

  return (
    <>
      <div className="sidebar">
        {showSidebarTabOptions ? (
          sidebarTabs.map(({ name, icon: SvgIcon }) => (
            <div
              key={name}
              id={`${name.replaceAll(' ', '-').toLowerCase()}-tab`}
              className={cx('tab-button', {
                'active-tab': currentTab === name,
              })}
              onClick={() => {
                handleTabChange(name);
              }}
            >
              <SvgIcon className="tab-icon" style={{ fontSize: '25pt' }} />
              {name}
            </div>
          ))
        ) : (
          <div className="tab-button" onClick={() => navigate(-1)}>
            <KeyboardBackspace
              className="tab-icon"
              style={{ fontSize: '25pt', marginTop: '12px' }}
            />
          </div>
        )}
      </div>
      {showSidebarTabOptions &&
        currentTab &&
        sidebarTabs.filter((t) => t.name === currentTab)[0].tabComponent}
    </>
  );
}

export default Sidebar;