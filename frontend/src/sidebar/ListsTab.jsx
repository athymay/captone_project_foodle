import "./components.css"
import React, { useContext } from 'react';
import ListTabButton from './ListTabButton';
import PromptLogin from '../pages/auth/PromptLogin';

import { AppContext } from '../AppContext';

function MyLists() {
  const { token } = useContext(AppContext);
  const [lists, setLists] = React.useState([]);

  const fetchLists = React.useCallback(async () => {
    const response = await fetch(`/api/user/myLists`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const lists = await response.json();
    var myLists = JSON.parse(lists);

    var first = "Favourites";
    myLists.sort(function(x,y){ return x.name === first ? -1 : y.name === first ? 1 : 0; });
    setLists(myLists);
  }, [token]);

  React.useEffect(() => {
    if (token) {
      fetchLists();
    }
  }, [fetchLists]);

  return (
    <div className="side-drawer">
      <div className="heading_box">
        <div className="heading">My Lists</div>
      </div>
      <hr />
      {token == null ? (
        <PromptLogin />
      ) : (
        <div className="ingredients-box">
          {lists.length < 1 ? (
            <ListTabButton name={'Favourites'} />
          ) : (
            <div>
              {lists.map((val) => {
                return <ListTabButton key={val.name} name={val.name} />;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyLists;
