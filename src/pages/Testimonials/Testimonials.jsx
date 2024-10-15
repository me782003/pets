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
import { ClipLoader } from "react-spinners";

// import useGetTesto from "../../CustomHooks/useGetTesto";

import { uploadImage } from "../../constant/uploadImage";
import useGetTesto from "../../CustomHooks/UseGetTesto";

export default function Testimonials() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    text_es: "",
    text_en: "",
    name: "",
    hidden: "",
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [confirmButton, setConfirmButton] = useState(false);

  const headers = [
    "Icon",
    "Nombre",
    "Título español",
    "Título en inglés",
    "Estado",
    "Acciones",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleOpenModal = (item) => {
    if (item) {
      setEditMode(true);
      setCurrentId(item.id);
      setFormData({
        image: item.image,
        text_es: item.text_es,
        text_en: item.text_en,
        name: item.name,
      });
    } else {
      setEditMode(false);
      setFormData({
        image: null,
        text_es: "",
        text_en: "",
        name: "",
      });
    }
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setCurrentId(null);
  };
  const handleConfirmModal = (id) => {
    setConfirmButton(true);
    setCurrentId(id);
  };
  const handleConfirmCloseModal = (id) => {
    setConfirmButton(false);
    setCurrentId(null);
  };

  const { handleGetTesto, testo, loading: testoLoading } = useGetTesto();

  const createTesto = async () => {
    setLoading(true);
    try {
      let image = null;

      if (formData.image) {
        image = await uploadImage(formData.image);
        delete formData.image;
      }

      const testoData = {
        ...formData,
        image: image?.data?.result?.image,
      };

      const res = await axios.post(img_base_url + "says/add_new", testoData, {
        headers: {
          lang: "es",
        },
      });

      notify("Testimonial creado exitosamente!", "success");
      handleGetTesto();
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTesto = async () => {
    setLoading(true);
    try {
      let image = formData.image;

      if (formData.image instanceof File) {
        const uploadedImage = await uploadImage(formData.image);
        image = uploadedImage?.data?.result?.image;
      }

      const testoData = {
        ...formData,
        image,
      };

      const res = await axios.post(
        img_base_url + `says/update_one/${currentId}`,
        testoData,
        {
          headers: {
            lang: "es",
          },
        }
      );

      notify("Testimonio actualizado exitosamente!", "success");
      handleGetTesto();
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
        `${img_base_url}says/update_status/${currentId}`
      );
      if (res.status === 200) {
        notify("Estado del testimonio actualizado exitosamente", "success");
        handleGetTesto();
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
      handleConfirmCloseModal();
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (
      formData.image === null ||
      formData.name === "" ||
      formData.text_es === "" ||
      formData.text_en === ""
    ) {
      notify("Por favor completa la información", "error");
      return;
    }
    if (editMode) {
      await updateTesto();
    } else {
      await createTesto();
    }
    setIsOpenModal(false);
  };

  useEffect(() => {
    handleGetTesto();
  }, []);

  return (
    <>
      <Modal
        title={editMode ? "Editar testimonio" : "Agregar testimonio"}
        show={isOpenModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: handleSubmitForm,
          loading: loading, 
          children: editMode ? (
            loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <ClipLoader color="#fff" loading={loading} size={20} />
              </div>
            ) : (
              "Actualizar"
            )
          ) : loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader color="#fff" loading={loading} size={20} />
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
          children: "Close",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <ClipLoader color="#36b9cc" loading={loading} size={50} />
          </div>
        ) : (
          <form className="modal_form">
            {formData.image ? (
              <div>
                <div>
                  <img
                    src={formData.image}
                    alt=""
                    style={{ width: "100px", height: "80px" }}
                  />
                </div>
                <div
                  className="btn btn-danger my-2"
                  onClick={() => setFormData({ ...formData, image: null })}
                >
                  Eliminar
                </div>
              </div>
            ) : (
              <CustomInput
                label="Image"
                name="image"
                type="file"
                onChange={handleInputChange}
              />
            )}

            <CustomInput
              label="Nombre"
              name="name"
              placeholder="Introduzca la Nombre..."
              onChange={handleInputChange}
              value={formData.name}
            />

            <CustomInput
              label="Testimonial(ES)"
              name="text_es"
              placeholder="Ingrese la testimonial en español..."
              onChange={handleInputChange}
              value={formData.text_es}
            />

            <CustomInput
              label="Testimonial(EN)"
              name="text_en"
              placeholder="Ingrese el testimonio en ingles..."
              onChange={handleInputChange}
              value={formData.text_en}
            />
          </form>
        )}
      </Modal>

      <Modal
        title={"Confirmar estado de actualización"}
        show={confirmButton}
        onClose={handleConfirmCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: updateStatus,
          children: loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader color="#fff" loading={loading} size={20} />
            </div>
          ) : (
            "Actualizar"
          ),
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleConfirmCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <ClipLoader color="#36b9cc" loading={loading} size={50} />
          </div>
        ) : (
          <h1 className="">¿Estás seguro de eso?</h1>
        )}
      </Modal>


      <div className="race_page">
        <FormCard header="Testimonios">
          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={() => handleOpenModal()}
              text="Agregar testimonios"
              icon={<FaFolderPlus />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>

      <div className="race_table">
        {testoLoading || loading ? (
          <ClipLoader color="#36b9cc" loading={testoLoading} size={50} />
        ) : (
          <TableComponent header={headers}>
            {testo?.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt="" />
                </td>
                <td>{item.name}</td>
                <td>{item.text_es}</td>
                <td>{item.text_en}</td>

                <td>
                  {item.hidden === 0 ? (
                    <span className="text-success fw-bolder">Mostrado</span>
                  ) : (
                    <span className="text-danger fw-bolder">Oculta</span>
                  )}
                </td>
                <td>
                  <div className="edit_btns justify-content-center">
                    <button
                      onClick={() => handleConfirmModal(item.id)}
                      className={`update_status_benefit `}
                    >
                      Actualizar
                    </button>

                    <button
                      onClick={() => {
                        handleOpenModal(item);

                        console.log(item);
                      }}
                    >
                      <FaPencil />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </TableComponent>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
