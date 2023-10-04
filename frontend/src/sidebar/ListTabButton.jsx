import './components.css';
import React from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { AppContext } from '../AppContext';
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

const ListTabButton = (props) => {
  const { name } = props;
  const navigate = useNavigate();
  const params = {listID: name};

  const { token, setShowSidebarTabOptions } = React.useContext(AppContext);

  const handleListClick = (e) => {
    setShowSidebarTabOptions(false);
    navigate({
      pathname: '/lists',
      search: `?${createSearchParams(params)}`,
    });
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    removeList()
  }

  const removeList = React.useCallback(async () => {
    const response = await fetch(
      `/api/user/mylists/removeList?list_name=${name}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await response.json();

    const element = document.getElementById(name);
    element.remove();
  }, [name, token]);

  return (
    <div id={name}>
      {name === 'Favourites' ? (
        <div
          className="pantry-list-button"
          id="list-button"
          onClick={handleListClick}
        >
          <div>{name}</div>
          <FavoriteIcon />
        </div>
      ) : (
        <div
          className="pantry-list-button"
          id="list-button"
          onClick={handleListClick}
        >
          <div>{name}</div>
          <DeleteIcon onClick={handleRemove} />
        </div>
      )}
    </div>
  );
};
export default ListTabButton;
