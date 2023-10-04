import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StoreContext } from './Store.jsx';
import {
  useNavigate,
} from 'react-router-dom';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
  },
  img: {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    height: '300px',
  },
  content: {
    fontFamily: "'Outfit', sans-serif",
    color: '#484848',
    fontSize: '12pt',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  recipeInfo: {
    display: 'flex',
  },
  servingsContent: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  button: {
    height: 27,
    display: 'flex',
    marginTop: '20px'
  },
  btnText: {
    display: 'flex',
  }
};

export default function RecipeModal(props) {
  const { open, setOpen } = props;
  const [heartHover, setHeartHover] = React.useState(false);
  const [ingredients, setIngredients] = React.useState('')
  const handleClose = () => setOpen(false);
  const context = React.useContext(StoreContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    let formattedIngredients = context.recipe["ingredients"]
    if (formattedIngredients.length > 6) {
      formattedIngredients.slice(0, 6)
      setIngredients(formattedIngredients.slice(0, 6).join(', ') + ' + more...')
    } else {
      setIngredients(formattedIngredients.join(', '))
    }
  }, [context.recipe])

  const handleOpenFullRecipe = (e) => {
    e.stopPropagation()
    const id = context.recipe["_id"]["$oid"]
    navigate(`/full-recipe/${id}`);
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        id="recipe-modal"
      >
        <Fade in={open}>
          <Box sx={style.box}>
            <CardMedia
              id="card-img"
              component="img"
              height="194"
              image={context.recipe["image"]["url"]}
              style={style.img}
            />
            <CardContent style={style.content}>
              <div style={style.recipeInfo}>
                <div id="card-content-left">
                  <div id="recipe-name">{context.recipe["title"]}</div>
                  <div id="time-content">
                    <AccessTimeIcon className="card-icon" />
                    {context.recipe["time"] ? context.recipe["time"] : 'N/A'}
                  </div>
                  <div id="rating-content">
                    <StarIcon className="card-icon" />
                    4.5/5
                  </div>
                  <div style={style.servingsContent}>
                    <span className='bold'>
                      Servings:
                    </span>
                    {` ${context.recipe["servings"]}`}
                  </div>
                  <div>
                    <span className='bold'>
                      Ingredients:
                    </span>
                    {` ${ingredients}`}
                  </div>
                </div>
                <div id="recipe-card-btn-group">
                  <div
                    id="favourite-btn"
                    onMouseOver={() => setHeartHover(true)}
                    onMouseLeave={() => setHeartHover(false)}
                  >
                    {heartHover ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </div>
                  <div id="more-btn">
                    <MoreVertIcon />
                  </div>
                </div>
              </div>
              <div className='button-filled' style={style.button} onClick={handleOpenFullRecipe}>
                <div style={style.btnText}>View Full Recipe</div>
              </div>
          </CardContent>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
