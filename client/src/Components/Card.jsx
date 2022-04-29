import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addCart } from "../redux/actions/userCart";
import { addFav } from "../redux/actions/userFav";

const Card = ({ e, horizontal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");
  const handleAddProduct = (e, type) => {
    const sizes = {};
    e.stocks.forEach((element) => {
      sizes[element.size] = element.size;
    });
    if (token) {
      if (type === "cart") {
        console.log("addCart");
        Swal.fire({
          title: "Select a size",
          input: "select",
          inputOptions: sizes,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Add",
        }).then((result) => {
          if (result.isConfirmed) {
            const product = { productId: e.id, size: result.value };
            dispatch(addCart(token, product));
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: "Product added successfully",
              showConfirmButton: false,
              timer: 1250,
            });
          }
        });
      } else {
        console.log("addFav");
        const product = { productId: e.id };
        dispatch(addFav(token, product));
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Product added successfully",
          showConfirmButton: false,
          timer: 1250,
        });
      }
    } else {
      Swal.fire({
        title:
          type === "cart"
            ? "You must login to add products"
            : "You must login to add products to your favorites",
        text: "Do you want to login?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I want",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/home/login");
        }
      });
    }
  };
  const colors = [
    "RGB(239, 145, 155)",
    "RGB(248, 179, 146)",
    "RGB(246, 247, 176)",
    "RGB(160, 207, 162)",
    "RGB(113, 190, 231)",
    "RGB(131, 128, 179)",
  ];
  return (
    <div className={"cardOwn" + (horizontal ? " h" : "")}>
      {e.sale !== 0 && <p className="offer-ribbon" offer={e.sale + "%"}></p>}
      <div className="img">
        <NavLink
          to={`/home/${e.id}/${e.model}`}
          style={{ textDecoration: "none" }}
        >
          <img
            src={e.images[0].url ? e.images[0].url : "./Images/logo2.png"}
            alt={e.model}
          />
        </NavLink>
      </div>
      <div className="content">
        <div className="f-section">
          <NavLink
            to={`/home/${e.id}/${e.model}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <p title="Name">
              {e.brand} - {e.model}
            </p>
          </NavLink>
          <span>
            <div className="rating" title="Rating">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
              <i className="bi bi-star"></i>
            </div>
            &nbsp;
            {e.sale !== 0 && (
              <p
                title="Offer Price"
                style={
                  e.sale
                    ? { textDecoration: "line-through", color: "#999" }
                    : {}
                }
              >
                ${Math.floor((e.price * 100) / (100 - e.sale))}
              </p>
            )}
            <p title="Price">${e.price}</p>
          </span>
        </div>
        <div className="appear">
          <i
            className="bi bi-bag"
            title="Add to cart"
            onClick={() => handleAddProduct(e, "cart")}
          >
            &nbsp;
            <p>{horizontal ? "Add to cart" : ""}</p>
          </i>
          <NavLink
            to={`/home/${e.id}/${e.model}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <i className="bi bi-toggles2" title="View details"></i>
          </NavLink>
          <i
            className="bi bi-heart"
            title="Add to favorites"
            onClick={() => handleAddProduct(e, "fav")}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Card;
