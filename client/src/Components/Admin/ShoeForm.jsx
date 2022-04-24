import {useState, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {postProduct} from "../../redux/actions/productsAdmin";
import "../../Css/ShoeForm.scss";
import Input from "./Input";
import Selection from "./Selection";
import {useSelector} from "react-redux";
import {brands, colors, sizes} from "../data";

const ShoeForm = ({handleShoeDialog}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [stock, setStock] = useState({amount: 0, size: 0});
  const [data, setData] = useState({
    model: "", //input
    brand: "", //input
    category: "", //select
    gender: "", //select
    color: "", //select
    description: "", //textarea
    price: 0, //input
    sale: 0, //input
    stock: [], //size -> select | amount -> input
    images: ["", "", "", ""], //input
  });
  const handleSubmit = () => {
    setErrors({
      ...errors,
      model: validation(data.model, "model"),
      category: validation(data.category, "category"),
      gender: validation(data.gender, "gender"),
      brand: validation(data.brand, "brand"),
      description: validation(data.description, "description"),
      color: validation(data.color, "color"),
      price: validation(data.price, "price"),
      sale: validation(data.sale, "sale"),
      images: validation(data.images, "images"),
      //stocks: data.stocks.length < 1 ? "Almost 1 needed" : "",
    });
    if (
      Object.values(errors).some((e) => e.length && e !== "Can be Null") ||
      Object.values(data).some((d) => d === "")
    )
      return;
    //dispatch(addPokemon(data));
    //navigate("/home");
    handleShoeDialog();
  };
  const validation = (param, type) => {
    if (!param || param === "")
      return type !== "images" ? "Is required" : "Can't be Null";
    switch (type) {
      case "images":
        let notNull = false;
        console.log("Soy Las Imagenes: ", param);
        param.map((e) => {
          if (e.length > 1) {
            notNull = true;
          }
        });
        return notNull ? "" : "Can't be Null";
      case "imageUrl":
        return !/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
          param
        )
          ? "Insert a valid URL"
          : "";
      case "price":
        if (!/^[0-9]+$/.test(param)) {
          return "Must be just digits";
        } else if (param > 100000) return "Can't exceeds 100000";
        break;
      case "sale":
        if (!/^[0-9]+$/.test(param)) {
          return "Must be just digits";
        } else if (param > 99) return "Can't exceeds 99%";
        break;
      default:
        return !/^[a-zA-Zs]*$/.test(param)
          ? "Must be just characters"
          : param.length < 3
          ? "Minimum length 3"
          : type === "description"
          ? param.length > 200
            ? "Maximum length 200"
            : ""
          : param.length > 20
          ? "Maximum length 20"
          : "";
    }
    return "";
  };
  const handleInputChange = (e) => {
    if (e.target.name === "price" || e.target.name === "sale") {
      setData({...data, [e.target.name]: Number(e.target.value)});
    } else setData({...data, [e.target.name]: e.target.value});
    setErrors({
      ...errors,
      [e.target.name]: validation(e.target.value, e.target.name),
    });
  };

  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current)
      initialMount.current = false;
      /*  setErrors({
        ...errors,
        stock: data.stocks.length < 1 ? "Almost 1 needed" : "",
      }); */
    else;
  }, [data.stocks]);
  const {categories, genders} = useSelector((state) => state.root);
  const handleSelectChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setColor(e.target.value);
  };
  const [addImgDialog, setAddImgDialog] = useState({
    on: false,
    pos: 0,
    url: "",
  });
  const deleteImage = (img) => {
    setData({...data, images: data.images.filter((i) => i !== img)});
  };

  const handleImagesChange = () => {
    setErrors({
      ...errors,
      imageUrl: validation(addImgDialog.url, "imageUrl"),
    });
    if (
      (data.images.some((e) => !e) || data.images.length < 4) &&
      data.images.indexOf(addImgDialog.url) < 0
    ) {
      if (errors.imageUrl.length) {
        setData({
          ...data,
          images: data.images.map((e, i) => {
            return i === addImgDialog.pos ? addImgDialog.url : e;
          }),
        });
      }
    }
    if (errors.imageUrl.length) {
      setAddImgDialog({...addImgDialog, on: false});
    }
  };
  const [color, setColor] = useState("white");
  return (
    <div className="create-container">
      <div className="form-container">
        <h2>
          Add new shoe
          <span>
            <button onClick={() => handleShoeDialog()}>
              <i className="bi bi-x-circle-fill"></i>Cancel
            </button>
            <button className="save-btn" onClick={handleSubmit}>
              <i className="bi bi-upload"></i>Save
            </button>
          </span>
        </h2>

        <form action="">
          <div className="leftside">
            <div className="model">
              <h4 className="input-name">
                Model <p>{errors.model}</p>
              </h4>
              <Input
                name={"model"}
                error={errors[data.model]}
                setData={handleInputChange}
              />
            </div>
            <div className="category-gender">
              <span>
                <h4 className="input-name">
                  Category <p>{errors.category}</p>
                </h4>
                {categories.length && (
                  <Selection
                    options={categories.map((e) => Object.values(e)[0])}
                    type={"category"}
                    handleChange={handleSelectChange}
                  />
                )}
              </span>
              <span>
                <h4 className="input-name">
                  Gender <p>{errors.gender}</p>
                </h4>
                {genders.length && (
                  <Selection
                    options={genders.map((e) => Object.values(e)[0])}
                    type={"gender"}
                    handleChange={handleSelectChange}
                  />
                )}
              </span>
            </div>
            <div className="brands">
              <h4 className="input-name">
                Brand <p>{errors.brand}</p>
              </h4>
              <Selection
                options={brands}
                type={"brand"}
                handleChange={handleSelectChange}
              />
            </div>
            <div className="description">
              <h4 className="input-name">
                Description <p>{errors.description}</p>
              </h4>
              <textarea
                className="txtarea"
                cols="30"
                rows="10"
                name="description"
                onChange={(e) => {
                  setData({...data, description: e.target.value});
                  setErrors({
                    ...errors,
                    description: validation(e.target.value, e.target.name),
                  });
                }}
              ></textarea>
            </div>
          </div>
          <div className="rightside">
            {/* --------------------------------- IMAGES --------------------------------- */}
            <div className="images">
              <h4 className="input-name">
                Images <p>{errors.images}</p>
              </h4>
              <div className="images-container">
                {data.images.map((img, i) => {
                  return (
                    <div
                      className={img ? "imagent show" : "imagent"}
                      key={i}
                      style={img ? {backgroundImage: `url(${img})`} : {}}
                    >
                      <button
                        type="button"
                        onClick={() => setAddImgDialog({on: true, pos: i})}
                      >
                        <i className="bi bi-plus-circle-fill"></i>Add image
                      </button>
                    </div>
                  );
                })}
              </div>
              {addImgDialog.on && (
                <div className="add-images">
                  <button
                    onClick={() =>
                      setAddImgDialog({...addImgDialog, on: false})
                    }
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                  <span>
                    <input
                      type="text"
                      placeholder="Image URL"
                      onChange={(e) =>
                        setAddImgDialog({
                          ...addImgDialog,
                          url: e.target.value,
                        })
                      }
                    />
                    <button type="button" onClick={() => handleImagesChange()}>
                      Add image
                    </button>
                  </span>
                  {errors.imageUrl && (
                    <p className="error-msg">{errors.imageUrl}</p>
                  )}
                </div>
              )}
            </div>
            {/* --------------------------------- IMAGES --------------------------------- */}
            <div className="stock-color-section">
              <div className="stock-container">
                <div className="stock">
                  <span>
                    <h4 className="input-name">Size</h4>
                    <Selection
                      options={sizes}
                      type={"size"}
                      handleChange={(e) =>
                        setStock({...stock, size: e.target.value})
                      }
                    />
                  </span>
                  <span>
                    <h4 className="input-name">Amount</h4>
                    <span>
                      <Input
                        name={"amount"}
                        error={errors[data.stock.amount]}
                        setData={(e) =>
                          setStock({...stock, amount: e.target.value})
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            stock: [
                              ...data.stock,
                              {amount: stock.amount, size: stock.size},
                            ],
                          })
                        }
                      >
                        <i className="bi bi-save"></i>
                      </button>
                    </span>
                  </span>
                </div>
                <div className="color">
                  <h4 className="input-name">Color</h4>
                  <span>
                    <Selection
                      options={colors}
                      type={"color"}
                      handleChange={handleSelectChange}
                    />
                    <div className="color-show" style={{"--c": color}}></div>
                  </span>
                </div>
              </div>
              {data.stock.length > 0 && (
                <div className="stocks-container">
                  {data.stock.map((stock, i) => {
                    return (
                      <div className="stock-card" key={i}>
                        <span>
                          Amount
                          <p>{stock.size}</p>
                        </span>
                        <div className="line-divisor"></div>
                        <p>Size{stock.amount}</p>
                        <button type="button">
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="price-sale">
              <span>
                <h4 className="input-name">
                  Price <p>{errors.price}</p>{" "}
                </h4>
                <Input
                  name={"price"}
                  error={errors[data.price]}
                  setData={handleInputChange}
                />
              </span>
              <span>
                <h4 className="input-name">
                  Sale <p>{errors.sale}</p>
                </h4>
                <Input
                  name={"sale"}
                  error={errors[data.sale]}
                  setData={handleInputChange}
                />
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShoeForm;
