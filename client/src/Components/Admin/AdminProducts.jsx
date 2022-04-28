import ConfirmPanel from "./ConfirmPanel";
import ShoeForm from "./ShoeForm";
import {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import bringAllData from "../../redux/actions/bringAllData";
import {deleteShoe} from "../../redux/actions/productsAdmin";
import {roleUser} from "../../redux/actions/Loginregister";
import "../../Css/AdminProducts.scss";
import {useNavigate} from "react-router-dom";
import {getAllCategories, getAllGenders} from "../../redux/actions/getAllUtils";
import Loading from "../Loading";
import search from "../../redux/actions/search";
import usePagination from "../../hooks/usePagination";
const CardProduct = ({shoe, editShoeFunctions}) => {
  //console.log(editShoeFunctions);
  const {setFunc} = editShoeFunctions;
  const {openEditorFunc} = editShoeFunctions;
  const dispatch = useDispatch();
  const [confirmDialog, setConfirmDialog] = useState(false);

  return (
    <div className="product-card">
      {confirmDialog && (
        <ConfirmPanel
          textoDisplay={"Are You Sure You Want To Delete It Permanently?"}
          handleDelete={() => {
            dispatch(deleteShoe(shoe.id));
            setConfirmDialog(false);
          }}
          cancelDelete={() => setConfirmDialog(false)}
        />
      )}
      <img src={shoe.images[0].url} alt="" />
      <p>{shoe.brand + " - " + shoe.model}</p>
      <p>$ {shoe.price}</p>
      <p style={{visibility: "hidden"}}>Status</p>
      {shoe.createdAt && (
        <p>{shoe.createdAt.substring(0, shoe.createdAt.indexOf("T"))}</p>
      )}
      <div className="actions">
        <button
          onClick={() => {
            setFunc(shoe);
            openEditorFunc();
          }}
        >
          <i className="bi bi-pen"></i>Edit
        </button>
        <button onClick={() => setConfirmDialog(true)}>
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [ShoeToEdit, setShoeToEdit] = useState();
  const dispatch = useDispatch();
  const handleShoeToEdit = (param) => {
    if (param) {
      let newShoe = {};
      console.log("-------------------------New Shoe-------------------------");
      Object.keys(param).map((e) => {
        let value = param[e];
        switch (e) {
          case "price":
            return (newShoe = {...newShoe, [e]: value});
          case "id":
            return (newShoe = {...newShoe, [e]: value});

          case "model":
            return (newShoe = {...newShoe, [e]: value});

          case "description":
            return (newShoe = {...newShoe, [e]: value});

          case "sale":
            return (newShoe = {...newShoe, [e]: value});

          case "color":
            return (newShoe = {...newShoe, [e]: value});

          case "brand":
            return (newShoe = {...newShoe, [e]: value});

          case "gender":
            return (newShoe = {...newShoe, [e]: value});

          case "category":
            return (newShoe = {...newShoe, [e]: value});

          case "images":
            value = value.map((e) => {
              return {url: e.url};
            });
            return (newShoe = {...newShoe, [e]: value});
          case "stocks":
            value = value.map((e) => {
              return {size: e.size, amount: e.amount};
            });
            return (newShoe = {...newShoe, stock: value});
          default:
            return;
        }
      });
      setShoeToEdit(newShoe);
      console.log(newShoe);
      console.log("-------------------------New Shoe-------------------------");
    } else setShoeToEdit(param);
  };
  const {allData, loading} = useSelector((state) => state.admin);
  const {categories, genders, role} = useSelector((state) => state.root);
  const {Pagination, dataPerPage} = usePagination(allData, 12, 4);
  const navigate = useNavigate();
  const [shoeDialog, setShoeDialog] = useState(false);
  useEffect(() => {
    if (!allData.length) dispatch(bringAllData(true));

    if (!categories.length || !genders.length) {
      dispatch(getAllGenders());
      dispatch(getAllCategories());
    }
  }, [allData.length, categories.length, genders.length, dispatch, shoeDialog]);
  shoeDialog
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      const token = window.localStorage.getItem("token");
      dispatch(roleUser(token));
      if (role.admin === false) {
        navigate("/home");
      }
    }
  }, [dispatch, navigate, role.admin]);
  const [searchParam, setSearchParam] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(search(searchParam, true));
  };
  return (
    <div className="admin-container">
      {shoeDialog && (
        <ShoeForm
          handleShoeDialog={() => {
            handleShoeToEdit(undefined);
            setShoeDialog(false);
          }}
          shoeObject={ShoeToEdit}
        />
      )}

      <div className="products-section-container">
        <div className="add-section">
          <h1>Products list</h1>
          <form
            className="searchOwn"
            onSubmit={handleSearch}
            onClick={() => {
              //dispatch(resetState());
              //dispatch(resetFilters());
            }}
          >
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <input
              type="text"
              placeholder="SEARCH"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />
          </form>
          <button onClick={() => setShoeDialog(true)}>
            <i className="bi bi-plus"></i> Add New Shoe
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="products-cards-container">
            {allData.length > 0 ? (
              dataPerPage().map((shoe, id) => (
                <CardProduct
                  key={id}
                  shoe={shoe}
                  editShoeFunctions={{
                    setFunc: (param) => handleShoeToEdit(param),
                    openEditorFunc: () => {
                      setShoeDialog(true);
                    },
                  }}
                />
              ))
            ) : (
              <h2>No results</h2>
            )}
            <Pagination />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
