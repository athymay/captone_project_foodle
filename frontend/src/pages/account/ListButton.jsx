import './account.css';
import { useNavigate, createSearchParams } from 'react-router-dom';

export default function ListButton(props) {
  const {name} = props;
  const params = {listID: name};

  const navigate = useNavigate();

  function handleListClick() {
    navigate({
      pathname: '/lists',
      search: `?${createSearchParams(params)}`,
    });
  }

  return (
    <>
      <div
        className="list-button"
        onClick={handleListClick}
      >
          <div>
          {name}
          </div>
      </div>
    </>
  );
}
