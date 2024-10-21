/* eslint-disable no-use-before-define */
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import { FaFolderPlus, FaPencil } from "react-icons/fa6";
import TableComponent from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { base_url, img_base_url } from "../../constant";
import { notify } from "../../assets/notification/notification";
import { ToastContainer } from "react-toastify";
import { Table } from "antd";
import cx from "classnames";
import { edit } from "../../assets/svgIcons";
import { Loader } from "rsuite";
import { ClipLoader } from "react-spinners";
import { uploadImage } from "../../constant/uploadImage";

export default function Benefits() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title_en: "",
    title_es: "",
    icon: null,
    description_es: "",
    description_en: "",
  });
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmButton, setConfirmButton] = useState(false);
  const [rowData, setRowData] = useState({});

  const handleConfirmCloseModal = () => {
    setConfirmButton(false);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleEmptyInputs = () => {
    setFormData({
      title_en: "",
      title_es: "",
      icon: null,
      description_es: "",
      description_en: "",
    });
  };

  const getAllData = async () => {
    setGetLoading(true);
    try {
      const res = await axios.get(base_url + "benefits/get_all_for_admin");
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setGetLoading(false);
    }
  };

  const createBenefit = async () => {
    setLoading(true);
    try {
      let image = null;

      if (formData.icon) {
        image = await uploadImage(formData.icon);
        console.log(image);
        delete formData.image;
      }

      const benefitData = {
        ...formData,
        icon: image?.data?.message,
      };

      const res = await axios.post(base_url + "benefits/add_new", benefitData, {
        headers: {
          lang: "es",
        },
      });

      notify("Beneficio creado exitosamente", "success");
      getAllData();
      if (res.status == 200) {
        setIsOpenModal(false);
        handleEmptyInputs();
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateBenefit = async () => {
    setLoading(true);
    try {
      let image = null;

      if (rowData.icon instanceof File) {
        const uploadedImage = await uploadImage(rowData.icon);
        image = uploadedImage?.data?.message;
      }

      const benefitData = {
        ...rowData,
        icon: image || rowData.icon,
      };

      console.log(benefitData);
      const res = await axios.post(
        base_url + `benefits/update_one/${rowData.id}`,
        benefitData,
        {
          headers: {
            lang: "es",
          },
        }
      );

      notify("Beneficio actualizado exitosamente", "success");
      getAllData();

      if (res.status == 200) {
        setEditModal(false);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${base_url}benefits/update_status/${rowData.id}`
      );
      if (res.status === 200) {
        notify("Estado del beneficio actualizado exitosamente", "success");
        getAllData();
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
      setConfirmButton(false);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.status === 422 && error.response.data.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((message) => {
            notify(`${key}: ${message}`, "error");
          });
        });
      }
    } else {
      console.error("Error updating data:", error);
      notify("Network or server error. Please try again later.", "error");
    }
  };

  const columns = [
    {
      title: "Ícono ",
      dataIndex: "icon",
      key: "icon",
      render: (img) => <img src={img} alt="" />,
    },
    {
      title: "Título en inglés",
      dataIndex: "title_en",
      key: "title_en",
      render: (text) => <div className="text-center">{text}</div>,
    },

    {
      title: "Título español",
      dataIndex: "title_es",
      key: "title_es",
      render: (text, row) => <div className="text-center">{text}</div>,
    },
    {
      title: "Descripción en Español",
      dataIndex: "description_es",
      key: "description_es",
      render: (text, row) => (
        <div title={row.description_es} className="text-center ellipsis">
          {text}
        </div>
      ),
    },
    {
      title: "Descripción en Inglés",
      dataIndex: "description_en",
      key: "description_en",
      render: (text, row) => (
        <div title={row.description_en} className="text-center ellipsis">
          {text}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "hidden",
      key: "hidden",
      render: (text, row) => (
        <div className="text-center">
          <div
            className={cx("fw-bolder", {
              "text-success": row.hidden == 0,
              "text-danger": row.hidden != 0,
            })}
          >
            {row.hidden == 0 ? "Mostrado" : "Oculta"}
          </div>
        </div>
      ),
    },
    {
      title: "Comportamiento",
      key: "Comportamiento",

      render: (text, row) => (
        <div className="d-flex align-items-center gap-2 justify-content-center">
          <button
            onClick={() => {
              setRowData(row);
              setConfirmButton(true);
            }}
            className=" btn-sm btn btn-info text-white"
          >
            cambiar estado
          </button>
          <button
            onClick={() => {
              setEditModal(true);
              setRowData(row);
              console.log(rowData);
            }}
            className=" btn-sm btn btn-primary text-white"
          >
            {edit}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
      <Modal
        title={"Agregar beneficio"}
        show={isOpenModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: createBenefit,
          children: loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader size={20} color="#fff" loading={loading} />
            </div>
          ) : (
            "Agregar"
          ),
          style: { backgroundColor: "#36b9cc" },
          props: {
            disabled: loading,
          },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerca",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <ClipLoader size={50} color="rgb(54, 185, 204)" loading={loading} />
          </div>
        ) : (
          <form className="modal_form">
            {formData.icon ? (
              <div>
                <div>
                  <img
                    src={URL.createObjectURL(formData.icon)}
                    alt=""
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  className="btn btn-danger my-2"
                  onClick={() => setFormData({ ...formData, icon: null })}
                >
                  Eliminar
                </div>
              </div>
            ) : (
              <CustomInput
                label="Icon"
                name="icon"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.files[0] })
                }
              />
            )}

            <CustomInput
              label="Descripción en español"
              name="description_es"
              placeholder="Ingrese la descripción en español..."
              onChange={(e) =>
                setFormData({ ...formData, description_es: e.target.value })
              }
              value={formData.description_es || ""}
            />

            <CustomInput
              label="Título español"
              name="title_es"
              placeholder="Ingrese el título en español..."
              onChange={(e) =>
                setFormData({ ...formData, title_es: e.target.value })
              }
              value={formData.title_es || ""}
            />

            <CustomInput
              label="Descripción en inglés"
              name="description_en"
              placeholder="Introduzca la descripción en inglés..."
              onChange={(e) =>
                setFormData({ ...formData, description_en: e.target.value })
              }
              value={formData.description_en || ""}
            />

            <CustomInput
              label="Título en inglés"
              name="title_en"
              placeholder="Ingrese el título en inglés..."
              onChange={(e) =>
                setFormData({ ...formData, title_en: e.target.value })
              }
              value={formData.title_en || ""}
            />
          </form>
        )}
      </Modal>

      <Modal
        title={"Actualizar beneficio"}
        show={editModal}
        onClose={() => setEditModal(false)}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: updateBenefit,
          children: loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader size={20} color="#fff" loading={loading} />
            </div>
          ) : (
            "Agregar"
          ),
          style: { backgroundColor: "#36b9cc" },
          props: {
            disabled: loading,
          },
        }}
        cancelButton={{
          onClick: () => setEditModal(false),
          children: "Cerca",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <ClipLoader size={50} loading={loading} color="rgb(54, 185, 204)" />
          </div>
        ) : (
          <form className="modal_form">
            {rowData?.icon ? (
              <div>
                <div>
                  <img
                    src={
                      rowData.icon instanceof File
                        ? URL.createObjectURL(rowData.icon)
                        : rowData.icon
                    }
                    alt=""
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  className="btn btn-danger my-2"
                  onClick={() => setRowData({ ...rowData, icon: null })}
                >
                  Eliminar
                </div>
              </div>
            ) : (
              <CustomInput
                label="Icon"
                name="icon"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRowData({ ...rowData, icon: e.target.files[0] })
                }
              />
            )}

            <CustomInput
              label="Descripción en español"
              name="description_es"
              placeholder="Ingrese la descripción en español..."
              onChange={(e) =>
                setRowData({ ...rowData, description_es: e.target.value })
              }
              value={rowData.description_es || ""}
            />

            <CustomInput
              label="Título español"
              name="title_es"
              placeholder="Ingrese el título en español..."
              onChange={(e) =>
                setRowData({ ...rowData, title_es: e.target.value })
              }
              value={rowData.title_es || ""}
            />

            <CustomInput
              label="Descripción en inglés"
              name="description_en"
              placeholder="Introduzca la descripción en inglés..."
              onChange={(e) =>
                setRowData({ ...rowData, description_en: e.target.value })
              }
              value={rowData.description_en || ""}
            />

            <CustomInput
              label="Título en inglés"
              name="title_en"
              placeholder="Ingrese el título en inglés..."
              onChange={(e) =>
                setRowData({ ...rowData, title_en: e.target.value })
              }
              value={rowData.title_en || ""}
            />
          </form>
        )}
      </Modal>

      <Modal
        title={"confirmar estado de actualización"}
        show={confirmButton}
        onClose={handleConfirmCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: updateStatus,
          children: loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader size={20} color="#fff" loading={loading} />
            </div>
          ) : (
            "Actualizar"
          ),
          style: { backgroundColor: "#36b9cc" },
          props: {
            disabled: loading,
          },
        }}
        cancelButton={{
          onClick: handleConfirmCloseModal,
          children: "Cerca",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <ClipLoader size={50} color="rgb(54, 185, 204)" loading={loading} />
          </div>
        ) : (
          <h1 className="">Estás seguro de eso?</h1>
        )}
      </Modal>
      <div className="race_page">
        <FormCard header="Benefits">
          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={() => setIsOpenModal(true)}
              text="Agregar beneficio"
              icon={<FaFolderPlus />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>

      <div className="search_table_container">
        {getLoading ? (
          <div className="d-flex align-items-center justify-content-center">
            <ClipLoader
              size={50}
              loading={getLoading}
              color="rgb(54, 185, 204)"
            />
          </div>
        ) : (
          <Table
            className="custom-header"
            columns={columns}
            dataSource={data}
          />
        )}
      </div>

      <ToastContainer />
    </>
  );
}
