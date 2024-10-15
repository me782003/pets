import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import "./style.css";
import { FaFolderPlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Button } from "react-bootstrap";
import "rsuite/Button/styles/index.css";
import { Loader } from "rsuite";

export const Products = () => {
  const [data, setData] = useState([]);
  const [Img, setImg] = useState();

  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [FAQSModal, setFAQSModal] = useState(false);
  const [NewProduct, setNewProduct] = useState(false);
  const [EditProduct, setEditProduct] = useState(false);
  const [RowDataFeaturs, setRowDataFeaturs] = useState();
  const [RowDataFAQS, setRowDataFAQS] = useState();

  const [AddNewProductData, setAddNewProductData] = useState({
    name_en: "",
    name_es: "",
    description_en: "",
    description_es: "",
    image: "",
    price: "",
    features: "",
    faqs: "",
  });

  const [RowData, setRowData] = useState();

  const headers = [
    "Imagen",
    "Nombre en Inglés",
    "Nombre en Español",
    "Descripción en Inglés",
    "Descripción en Español",
    "Características",
    "Preguntas Frecuentes",
    "#",
  ];

  const Featuresheaders = ["Descripción en Inglés", "Descripción en Español"];

  const FAQSheaders = [
    "Pregunta en Inglés",
    "Pregunta en Español",
    "Respuestas en Inglés",
    "Respuestas en Español",
  ];

  const [inputPairs, setInputPairs] = useState([
    { feature_description_en: "", feature_description_es: "" },
  ]);

  const handleInputChange = (index, field, event) => {
    const newInputPairs = [...inputPairs];
    newInputPairs[index][field] = event.target.value;
    setInputPairs(newInputPairs);
  };

  const handleAddInputPair = () => {
    setInputPairs([
      ...inputPairs,
      { feature_description_en: "", feature_description_es: "" },
    ]);
  };

  const handleRemoveInputPair = (indexToRemove) => {
    setInputPairs(inputPairs.filter((_, index) => index !== indexToRemove));
  };

  const [FAQSInputs, setFAQSInputs] = useState([
    {
      FAQS_description_en: "",
      FAQS_description_es: "",
      ques_en: "",
      ques_es: "",
    },
  ]);

  const handleFAQSChange = (index, field, event) => {
    const newInputFAQs = [...inputPairs];
    newInputFAQs[index][field] = event.target.value;
    setFAQSInputs(newInputFAQs);
  };

  const handleAddFAQSPair = () => {
    setFAQSInputs([
      ...FAQSInputs,
      {
        FAQS_description_en: "",
        FAQS_description_es: "",
        ques_en: "",
        ques_ens: "",
      },
    ]);
  };

  const handleRemoveFAQSPair = (indexToRemove) => {
    setFAQSInputs(FAQSInputs.filter((_, index) => index !== indexToRemove));
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const get_all_data = async () => {
    setLoading(true);
    axios
      .get("https://camp-coding.site/pets/api/user/get_products")
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          setData(res.data);
          console.log(data);
        } else if (res.data.status === "faild") {
          toast.error(res.data.message);
        } else {
          toast.error("someThing went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    get_all_data();
    console.log(data);
  }, []);

  const UploadNewImg = async () => {
    if (Img) {
      const formData = new FormData();
      formData.append("image", Img);

      try {
        const response = await axios.post(
          "https://camp-coding.site/pets/api/img_upload",
          formData
        );

        setRowData({
          ...RowData,
          image: response.data.result.image,
        });
        // imgUrl = response.data.result.image
        console.log(response);

        console.log(response.data.result.image);
        console.log(response.result.image);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handelAddNewProduct = async () => {
    console.log(AddNewProductData);
    setLoading(true);

    console.log(Img);
    let imgUrl = null;

    if (Img) {
      const formData = new FormData();
      formData.append("image", Img);

      try {
        const response = await axios.post(
          "https://camp-coding.site/pets/api/img_upload",
          formData
        );

        imgUrl = response.data.result.image;
        console.log(response);

        console.log(response.data.result.image);
        console.log(response.result.image);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }

    console.log(imgUrl);

    // let AllFeaturs = values.join("**")
    const joinedDescriptions = inputPairs.map((item) => {
      return item.feature_description_en + "**" + item.feature_description_es;
    });

    const joinedFAQS = FAQSInputs.map((item) => {
      return (
        item.ques_en +
        "**" +
        item.ques_es +
        "**" +
        item.FAQS_description_en +
        "**" +
        item.FAQS_description_es
      );
    });

    console.log(joinedDescriptions);

    let featuresValues = joinedDescriptions.join("**pets**");
    console.log(featuresValues);

    let FAQSValues = joinedFAQS.join("**pets**");

    const dataSendAddProd = {
      name_en: AddNewProductData.name_en,
      name_es: AddNewProductData.name_es,
      description_en: AddNewProductData.description_en,
      description_es: AddNewProductData.description_es,
      image: imgUrl,
      price: AddNewProductData.price,
      features: featuresValues,
      product_faqs: FAQSValues,
    };

    console.log(dataSendAddProd);
    console.log(inputPairs);
    console.log(FAQSInputs);

    axios
      .post(
        "https://camp-coding.site/pets/api/admins/create_product",
        dataSendAddProd
      )
      .then((res) => {
        if ((res.data.status = "success")) {
          console.log(res);
          toast.success("product add successfully");
          get_all_data();
          setNewProduct(false);
        } else if ((res.data.status = "faild")) {
          toast.error(res.data.message);
        } else {
          toast.error("someThing went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const handelEditProduct = () => {
    console.log(RowData);

    const joinedDescriptions = inputPairs.map((item) => {
      return item.feature_description_en + "**" + item.feature_description_es;
    });

    const joinedFAQS = FAQSInputs.map((item) => {
      return (
        item.ques_en +
        "**" +
        item.ques_es +
        "**" +
        item.FAQS_description_en +
        "**" +
        item.FAQS_description_es
      );
    });

    console.log(joinedDescriptions);

    let featuresValues = joinedDescriptions.join("**pets**");
    console.log(featuresValues);

    let FAQSValues = joinedFAQS.join("**pets**");

    const dataSendAddProd = {
      name_en: RowData?.name_en,
      name_es: RowData?.name_es,
      description_en: RowData?.description_en,
      description_es: RowData?.description_es,
      image: RowData?.image,
      price: RowData?.price,
      features: featuresValues,
      product_faqs: FAQSValues,
    };

    console.log(dataSendAddProd);
    console.log(RowDataFAQS);
    console.log(RowDataFeaturs);

    axios
      .post(
        `https://camp-coding.site/pets/api/admins/update_product/${RowData.id}`,
        dataSendAddProd
      )
      .then((res) => {
        if ((res.data.status = "success")) {
          console.log(res);
          toast.success("product add successfully");
          get_all_data();
          setEditProduct(false);
        } else if ((res.data.status = "faild")) {
          toast.error("faild to edit product");
        } else {
          toast.error("someThing went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {
        <Modal
          title={"Características"}
          show={isOpenModal}
          onClose={handleCloseModal}
          showCloseBtn={true}
          size="900px"
        >
          <div className="race_table">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <TableComponent header={Featuresheaders}>
                {RowData?.features?.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.feature_description_en}</td>
                    <td>{item?.feature_description_es}</td>
                  </tr>
                ))}
              </TableComponent>
            )}
          </div>
        </Modal>
      }

      {
        <Modal
          title={"Preguntas Frecuentes"}
          show={FAQSModal}
          // animation={true}
          onClose={() => setFAQSModal(false)}
          showCloseBtn={true}
          size="900px"
        >
          <div className="race_table">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <TableComponent header={FAQSheaders}>
                {RowData?.faqs?.length > 0 ? (
                  RowData.faqs.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.ques_en}</td>
                      <td>{item?.ques_es}</td>
                      <td>{item?.ans_en}</td>
                      <td>{item?.ans_es}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" rowSpan="5">
                      Sin datos
                    </td>
                  </tr>
                )}
              </TableComponent>
            )}
          </div>
        </Modal>
      }

      <div className="race_page">
        <FormCard header="Especies y Productos">
          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={() => setNewProduct(true)}
              text="Agregar"
              icon={<FaFolderPlus />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>
      <div className="race_table" style={{ height: "70vh" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableComponent header={headers}>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: "80px", height: "80px" }}
                  />
                </td>
                <td>{item.name_en}</td>
                <td>{item.name_es}</td>
                <td>{item.description_en}</td>
                <td>{item.description_es}</td>
                <td>
                  <div className="d-flex justify-content-center ">
                    <button
                      className="btn btn-success update_status_benefit"
                      onClick={() => {
                        console.log(item.id);
                        let seLectedRow = data.find((row) => row.id == item.id);
                        console.log(seLectedRow.features);
                        setRowData(seLectedRow);

                        setIsOpenModal(true);
                      }}
                    >
                      Vista
                    </button>
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-center ">
                    <button
                      className="btn btn-success update_status_benefit"
                      onClick={() => {
                        console.log(item.id);
                        let seLectedRow = data.find((row) => row.id == item.id);
                        console.log(seLectedRow.faqs);
                        setRowData(seLectedRow);

                        setFAQSModal(true);
                      }}
                    >
                      Vista
                    </button>
                  </div>
                </td>
                <td>
                  <div className="edit_btns justify-content-center">
                    <button
                      onClick={() => {
                        setEditProduct(true);
                        let seLectedRow = data.find((row) => row.id == item.id);
                        setRowData(seLectedRow);
                        setRowDataFeaturs(seLectedRow.features);
                        setRowDataFAQS(seLectedRow.faqs);
                      }}
                    >
                      <FaPencil />
                    </button>
                    <button
                      onClick={() => {
                        let seLectedRow = data.find((row) => row.id == item.id);
                        setRowData(seLectedRow);
                      }}
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </TableComponent>
        )}
      </div>
      {
        <Modal
          title={"Add new product"}
          show={NewProduct}
          // animation={true}
          onClose={() => setNewProduct(false)}
          showCloseBtn={true}
          size="900px"
          style={{ height: "100%", overflow: "auto" }}
        >
          <CustomInput
            label="imagen"
            type={"file"}
            placeholder="imagen"
            // accept={"png"}
            required={true}
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
            // value={title_es}
          />
          <CustomInput
            label="English Name"
            placeholder="English Name...."
            required={true}
            onChange={(e) => {
              setAddNewProductData({
                ...AddNewProductData,
                name_en: e.target.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="Nombre en español"
            placeholder="Nombre en español...."
            required={true}
            onChange={(e) => {
              setAddNewProductData({
                ...AddNewProductData,
                name_es: e.target.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="English Description"
            placeholder="English Description...."
            required={true}
            onChange={(e) => {
              setAddNewProductData({
                ...AddNewProductData,
                description_en: e.target.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="Descripción en español"
            placeholder="Descripción en español...."
            required={true}
            onChange={(e) => {
              setAddNewProductData({
                ...AddNewProductData,
                description_es: e.target.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="price"
            required={true}
            placeholder="0.0"
            onChange={(e) => {
              setAddNewProductData({
                ...AddNewProductData,
                price: e.target.value,
              });
            }}
            // value={title_es}
          />
          <div>
            <div>
              <form
                style={{
                  border: ".1px solid #6e707e",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 5px 0px #6e707e",
                }}
              >
                {inputPairs.map((inputPair, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <CustomInput
                      type="text"
                      label={"English Featurs description"}
                      value={inputPair.key}
                      onChange={(e) =>
                        handleInputChange(index, "feature_description_en", e)
                      }
                      placeholder="English Featurs"
                      style={{ marginRight: "10px" }}
                    />
                    <CustomInput
                      label={"Espaniol Descripción de características"}
                      type="text"
                      value={inputPair.value}
                      onChange={(e) =>
                        handleInputChange(index, "feature_description_es", e)
                      }
                      placeholder="Espaniol Descripción"
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRemoveInputPair(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddInputPair}
                  className="btn btn-success"
                  style={{
                    width: "90%",
                    margin: "10px auto",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Add More
                </Button>

                <div>{/* <button type="submit">Submit</button> */}</div>
              </form>
            </div>

            <div>
              <form
                title="FAQs"
                style={{
                  border: ".1px solid #6e707e",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 5px 0px #6e707e",
                }}
              >
                {FAQSInputs.map((FAQSPair, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <CustomInput
                      type="text"
                      label={"FAQS Question en"}
                      value={FAQSPair.ques_en}
                      onChange={(e) => handleFAQSChange(index, "ques_en", e)}
                      placeholder="FAQS Question en...?"
                      style={{ marginRight: "10px" }}
                    />

                    <CustomInput
                      label={"FAQS Question es"}
                      type="text"
                      value={FAQSPair.ques_es}
                      onChange={(e) => handleFAQSChange(index, "ques_es", e)}
                      placeholder="FAQS Question es...?"
                    />

                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px 0",
                      }}
                    >
                      <span className="faq_span">
                        <label htmlFor="">FAQS descreption es</label>

                        <textarea
                          label={"FAQS descreption en"}
                          style={{
                            width: "100%",
                            padding: "10px",
                          }}
                          type="text"
                          value={FAQSPair.FAQS_description_en}
                          onChange={(e) =>
                            handleFAQSChange(index, "FAQS_description_en", e)
                          }
                          placeholder="Enter value"
                        />
                      </span>

                      <span className="faq_span">
                        <label htmlFor="">FAQS descreption es</label>
                        <textarea
                          style={{
                            width: "100%",
                            padding: "10px",
                          }}
                          type="text"
                          value={FAQSPair.FAQS_description_es}
                          onChange={(e) =>
                            handleFAQSChange(index, "FAQS_description_es", e)
                          }
                          placeholder="Enter value"
                        />
                      </span>
                    </span>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRemoveFAQSPair(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddFAQSPair}
                  className="btn btn-success"
                  style={{
                    width: "90%",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Add More
                </Button>

                <div>{/* <button type="submit">Submit</button> */}</div>
              </form>
            </div>
          </div>
          <Button style={{ float: "right" }} onClick={handelAddNewProduct}>
            {loading ? <Loader /> : "agregar"}
          </Button>
        </Modal>
      }

      {
        <Modal
          title={"Edit product"}
          show={EditProduct}
          // animation={true}
          onClose={() => setEditProduct(false)}
          showCloseBtn={true}
          size="900px"
          style={{ height: "100%", overflow: "auto" }}
        >
          <img
            src={RowData?.image}
            alt=""
            style={{ width: "80px", height: "80px" }}
          />
          <CustomInput
            label="imagen"
            type={"file"}
            placeholder="imagen"
            required={true}
            onChange={(e) => {
              setImg(e.target.files[0]);
              setRowData({
                ...RowData,
                image: e?.target?.files[0],
              });
            }}
            // value={title_es}
          />
          <button
            className="btn btn-success"
            style={{
              width: "90%",
              display: "flex",
              justifyContent: "center",
              margin: "10px auto",
            }}
            onClick={() => UploadNewImg()}
          >
            upload new image
          </button>
          <CustomInput
            label="English Name"
            placeholder="English Name...."
            required={true}
            defaultValue={RowData?.name_en}
            onChange={(e) => {
              setRowData({
                ...RowData,
                name_en: e?.target?.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="Nombre en español"
            placeholder="Nombre en español...."
            defaultValue={RowData?.name_es}
            required={true}
            onChange={(e) => {
              setRowData({
                ...RowData,
                name_es: e?.target?.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="English Description"
            placeholder="English Description...."
            defaultValue={RowData?.description_en}
            required={true}
            onChange={(e) => {
              setRowData({
                ...RowData,
                description_en: e?.target?.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="Descripción en español"
            placeholder="Descripción en español...."
            defaultValue={RowData?.description_es}
            required={true}
            onChange={(e) => {
              setRowData({
                ...RowData,
                description_es: e?.target?.value,
              });
            }}
            // value={title_es}
          />
          <CustomInput
            label="price"
            required={true}
            defaultValue={RowData?.price}
            placeholder="0.0"
            onChange={(e) => {
              setRowData({
                ...RowData,
                price: e?.target?.value,
              });
            }}
            // value={title_es}
          />
          <div>
            <div>
              <form
                style={{
                  border: ".1px solid #6e707e",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 5px 0px #6e707e",
                }}
              >
                {inputPairs.map((inputPair, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <CustomInput
                      type="text"
                      label={"English Features description"}
                      value={
                        inputPair.feature_description_en ||
                        (RowDataFeaturs
                          ? RowDataFeaturs[1]?.feature_description_en
                          : "") ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(index, "feature_description_en", e)
                      }
                      placeholder="English Features"
                      style={{ marginRight: "10px" }}
                    />
                    <CustomInput
                      label={"Espaniol Descripción de características"}
                      type="text"
                      value={
                        inputPair.feature_description_es ||
                        (RowDataFeaturs
                          ? RowDataFeaturs[index]?.feature_description_es
                          : "") ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(index, "feature_description_es", e)
                      }
                      placeholder="Espaniol Descripción"
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRemoveInputPair(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddInputPair}
                  className="btn btn-success"
                  style={{
                    width: "90%",
                    margin: "10px auto",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Add More
                </Button>
              </form>
            </div>

            <div>
              <form
                title="FAQs"
                style={{
                  border: ".1px solid #6e707e",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 5px 0px #6e707e",
                }}
              >
                {FAQSInputs.map((FAQSPair, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <CustomInput
                      type="text"
                      label={"FAQS Question en"}
                      value={
                        FAQSPair.ques_en ||
                        (RowDataFAQS ? RowDataFAQS[index]?.ques_en : "") ||
                        ""
                      }
                      onChange={(e) => handleFAQSChange(index, "ques_en", e)}
                      placeholder="FAQS Question en...?"
                      style={{ marginRight: "10px" }}
                    />

                    <CustomInput
                      label={"FAQS Question es"}
                      type="text"
                      value={
                        FAQSPair.ques_es ||
                        (RowDataFAQS ? RowDataFAQS[index]?.ques_es : "") ||
                        ""
                      }
                      onChange={(e) => handleFAQSChange(index, "ques_es", e)}
                      placeholder="FAQS Question es...?"
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px 0",
                      }}
                    >
                      <div className="faq_span">
                        <label>FAQS description en</label>
                        <textarea
                          style={{
                            width: "100%",
                            padding: "10px",
                          }}
                          value={
                            FAQSPair.FAQS_description_en ||
                            (RowDataFAQS
                              ? RowDataFAQS[index]?.FAQS_description_en
                              : "") ||
                            ""
                          }
                          onChange={(e) =>
                            handleFAQSChange(index, "FAQS_description_en", e)
                          }
                          placeholder="Enter value"
                        />
                      </div>

                      <div className="faq_span">
                        <label>FAQS description es</label>
                        <textarea
                          style={{
                            width: "100%",
                            padding: "10px",
                          }}
                          value={
                            FAQSPair.FAQS_description_es ||
                            (RowDataFAQS
                              ? RowDataFAQS[index]?.FAQS_description_es
                              : "") ||
                            ""
                          }
                          onChange={(e) =>
                            handleFAQSChange(index, "FAQS_description_es", e)
                          }
                          placeholder="Enter value"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRemoveFAQSPair(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddFAQSPair}
                  className="btn btn-success"
                  style={{
                    width: "90%",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Add More
                </Button>
              </form>
            </div>
          </div>
          <Button style={{ float: "right" }} onClick={handelEditProduct}>
            {loading ? <Loader /> : "editar"}
          </Button>
        </Modal>
      }
    </>
  );
};
