/* eslint-disable no-use-before-define */
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import { FaFolderPlus } from "react-icons/fa6";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import Select from "react-select";
import { globa_base_url } from "../../constant";
import { notify } from "../../assets/notification/notification";
import { ToastContainer } from "react-toastify";
import { Table } from "antd";
import cx from "classnames";
import { edit } from "../../assets/svgIcons";

import { ClipLoader } from "react-spinners";
import { uploadImage } from "../../constant/uploadImage";
import useGetAllAnimals from "../../CustomHooks/useGetAnimals";
import useGetAllRaza from "../../CustomHooks/useGetAllRaza";
import useGetDepartments from "../../CustomHooks/useGetAllDepartments";
import useGetDepProvencia from "../../CustomHooks/useGetDepProvencia";
import useGetProvDis from "../../CustomHooks/useGetProvDis";
import { FaTrash } from "react-icons/fa6";

export default function AddAnimal() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    pet_image: null,
    dob: "",
    sex: "",
    qualified: "",
    type: "",
    coat_color: "",
    address: "",
    raza: "",
    department: "",
    province: "",
    district: "",
    is_sterillized: null,
    bio: "",
    size: "",
  });

  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmButton, setConfirmButton] = useState(false);
  const [bioModal, setBioModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const getToDayDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate());
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleConfirmCloseModal = () => {
    setConfirmButton(false);
  };

  const handleCloseModal = () => {
    setFormData({
      f_name: "",
      l_name: "",
      pet_image: null,
      dob: "",
      sex: "",
      qualified: "",
      type: "",
      coat_color: "",
      address: "",
      raza: "",
      department: "",
      province: "",
      district: "",
      is_sterillized: null,
      bio: "",
      size: "",
    });
    setIsOpenModal(false);
  };
  const handleEmptyInputs = () => {
    setFormData({
      f_name: "",
      l_name: "",
      pet_image: null,
      dob: "",
      sex: "",
      qualified: "",
      type: "",
      coat_color: "",
      address: "",
      raza: "",
      department: "",
      province: "",
      district: "",
      is_sterillized: null,
      bio: "",
      size: "",
    });
  };

  const sterilized = [
    { label: "No Esterilizada", id: 0 },
    { label: "Esterilizada", id: 1 },
  ];
  const size = [
    { label: "Pequeño", id: 0 },
    { label: "Medio", id: 1 },
    { label: "Grande", id: 2 },
  ];

  const gender = [
    { label: "Masculino", id: 0 },
    { label: "Femenino", id: 1 },
  ];

  const {
    loading: animalLoading,
    handleGetAllAnimals,
    animals,
  } = useGetAllAnimals();

  const { raza, loading: razaLoading, handleGetAllRaza } = useGetAllRaza();

  const {
    handleGetDepartments,
    departments,
    loading: departmentLoading,
  } = useGetDepartments();

  const {
    handleGetDepProvs,
    loading: depProvLoading,
    depProv,
  } = useGetDepProvencia(editModal ? rowData.department : formData.department);

  const {
    handleGetProvDis,
    provDis,
    loading: provDisLaoding,
  } = useGetProvDis(editModal ? rowData.province : formData.province);

  const addAnimal = async () => {
    setLoading(true);
    try {
      let image = null;

      if (formData.pet_image) {
        image = await uploadImage(formData.pet_image);
        delete formData.pet_image;
      }

      const dataSend = {
        ...formData,
        pet_image: image?.data?.message,
      };

      const res = await axios.post(
        globa_base_url + "animals/admin_add_animal",
        dataSend,
        {
          headers: {
            lang: "es",
          },
        }
      );

      if (res.status === 200) {
        handleEmptyInputs();
        handleCloseModal();
      }

      notify("Animal agregado exitosamente", "success");
      handleGetAllAnimals();
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const editAnimal = async () => {
    setLoading(true);
    try {
      let image = null;

      if (rowData.pet_image instanceof File) {
        const uploadedImage = await uploadImage(rowData.pet_image);
        image = uploadedImage?.data?.message;
      }

      const dataSend = {
        ...rowData,
        pet_image: image || rowData.pet_image,
      };

      const res = await axios.post(
        globa_base_url + `animals/admin_update_animal/${rowData.id}`,
        dataSend,
        {
          headers: {
            lang: "es",
          },
        }
      );

      if (res.status === 200) {
        setEditModal(false);
      }

      notify("Animal actualizado exitosamente", "success");
      handleGetAllAnimals();
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnimal = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${globa_base_url}animals/admin_delete_animal/${rowData.id}`,
        {
          headers: {
            lang: "es",
          },
        }
      );

      if (res.status === 200) {
        setConfirmButton(false);
      }
      notify("¡Animal eliminado con éxito!", "success");
      handleGetAllAnimals();
    } catch (error) {
      handleErrorResponse(error);
    }
    setLoading(false);
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
      title: "Imagen del Animal",
      dataIndex: "pet_image",
      key: "pet_image",
      render: (img) => <img src={img} alt="" />,
    },
    {
      title: "Nombre",
      dataIndex: "f_name",
      key: "f_name",
      render: (text) => <div className="text-center">{text}</div>,
    },

    {
      title: "Apellido",
      dataIndex: "l_name",
      key: "l_name",
      render: (text, row) => <div className="text-center">{text}</div>,
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "dob",
      key: "dob",
      render: (text, row) => <div className="text-center">{text}</div>,
    },
    {
      title: "Sexo",
      dataIndex: "sex",
      key: "sex",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Calificado",
      dataIndex: "qualified",
      key: "qualified",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Tamaño",
      dataIndex: "size",
      key: "size",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Color",
      dataIndex: "coat_color",
      key: "coat_color",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },

    {
      title: "Esterilizado",
      dataIndex: "is_sterillized",
      key: "is_sterillized",
      render: (text, row) => (
        <div className="text-center">
          <div
            className={cx("fw-bolder", {
              "text-danger": row.is_sterillized == 0,
              "text-success": row.is_sterillized != 0,
            })}
          >
            {row.is_sterillized == 1 ? "Esterilizada" : "No Esterilizada"}
          </div>
        </div>
      ),
    },
    {
      title: "Biografía",
      key: "bio",

      render: (text, row) => (
        <div className="d-flex align-items-center gap-2 justify-content-center">
          <button
            onClick={() => {
              setRowData(row);
              setBioModal(true);
              console.log(rowData);
            }}
            className=" btn-sm btn btn-info fs-6 text-white"
          >
            Biografía
          </button>
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
            className=" btn-sm btn btn-danger fs-6 text-white"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => {
              setEditModal(true);
              setRowData(row);
              console.log(rowData);
            }}
            className=" btn-sm btn btn-primary fs-6  text-white"
          >
            {edit}
          </button>
        </div>
      ),
    },
  ];

  const filteredAnimal = animals.filter(
    (e) =>
      e.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.l_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.coat_color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.qualified.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.size.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    handleGetAllAnimals();
    handleGetAllRaza();
    handleGetDepartments();
  }, []);

  useEffect(() => {
    handleGetDepProvs(editModal ? rowData.department : formData.department);
  }, [rowData.department, formData.department]);

  useEffect(() => {
    handleGetProvDis(editModal ? rowData.province : formData.province);
  }, [rowData.province, formData.province]);

  return (
    <>
      <Modal
        title={"Agregar Annimal"}
        show={isOpenModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        style={
          loading
            ? { height: "180px", overflow: "auto" }
            : { height: "100%", overflow: "scroll" }
        }
        size="900px"
        confirmButton={{
          onClick: () => {
            addAnimal();
            console.log(
              "ijeodklms" +
                sterilized
                  ?.filter((e) => e.id == formData.is_sterillized)
                  ?.map((e) => ({
                    label: e.label,
                    value: e.id,
                  }))
            );
          },
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
          <form className="modal_form_animal">
            {formData.pet_image ? (
              <div>
                <div>
                  <img
                    src={URL.createObjectURL(formData.pet_image)}
                    alt=""
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  className="btn btn-danger my-2"
                  onClick={() => setFormData({ ...formData, pet_image: null })}
                >
                  Eliminar
                </div>
              </div>
            ) : (
              <CustomInput
                label="Imagen del Animal"
                name="pet_image"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, pet_image: e.target.files[0] })
                }
              />
            )}
            <CustomInput
              label="Nombre"
              name="f_name"
              placeholder="Nombre..."
              onChange={(e) =>
                setFormData({ ...formData, f_name: e.target.value })
              }
              value={formData.f_name || ""}
            />

            <CustomInput
              label="Apellido"
              name="l_name"
              placeholder="Apellido..."
              onChange={(e) =>
                setFormData({ ...formData, l_name: e.target.value })
              }
              value={formData.l_name || ""}
            />

            <CustomInput
              label="Fecha de nacimiento"
              max={getToDayDate()}
              type={"date"}
              placeholder="fecha de nacimiento"
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              value={formData.dob || ""}
            />

            <CustomInput
              label="Tipo"
              name="type"
              placeholder="Tipo..."
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              value={formData.type || ""}
            />

            <CustomInput
              label="Calificado"
              name="qualified"
              placeholder="Calificado..."
              onChange={(e) =>
                setFormData({ ...formData, qualified: e.target.value })
              }
              value={formData.qualified || ""}
            />

            <CustomInput
              label="Color"
              name="coat_color"
              placeholder="Color..."
              onChange={(e) =>
                setFormData({ ...formData, coat_color: e.target.value })
              }
              value={formData.coat_color || ""}
            />

            <CustomInput
              label="DIRECCIÓN"
              name="address"
              placeholder="DIRECCIÓN..."
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              value={formData.address || ""}
            />

            <div className="custom_input">
              <label htmlFor="">Esterilizada</label>

              <Select
                options={sterilized?.map((e) => ({
                  label: e.label,
                  value: e.id,
                }))}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_sterillized: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  sterilized
                    ?.filter((e) => e.id == formData.is_sterillized)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0] || null
                } // Ensure null value when form is reset
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Sexo</label>

              <Select
                options={gender?.map((e) => {
                  return {
                    label: e.label,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sex: e.label,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  gender
                    ?.filter((e) => e.label == formData.sex)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Tamaño</label>

              <Select
                options={size?.map((e) => {
                  return {
                    label: e.label,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    size: e.label,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  size
                    ?.filter((e) => e.label == formData.size)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Raza</label>

              <Select
                placeholder={"Todos"}
                options={raza?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    raza: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  raza
                    ?.filter((e) => e.id == formData.raza)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Departamento</label>

              <Select
                placeholder={"Todos"}
                options={departments?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  departments
                    ?.filter((e) => e.id == formData.department)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Provincia</label>

              <Select
                placeholder={"Todos"}
                options={depProv?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    province: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  depProv
                    ?.filter((e) => e.id == formData.province)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Distrito</label>

              <Select
                placeholder={"Todos"}
                options={provDis?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    district: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  provDis
                    ?.filter((e) => e.id == formData.district)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0] || ""
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Bio</label>
              <textarea
                type="text"
                name="bio"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                rows={1}
                value={formData.bio || ""}
              ></textarea>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        style={
          loading
            ? { height: "180px", overflow: "hidden" }
            : { height: "100%", overflow: "scroll" }
        }
        title={"Actualizar Animal"}
        show={editModal}
        onClose={() => setEditModal(false)}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: editAnimal,
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
          <form className="modal_form_animal">
            {rowData?.pet_image ? (
              <div>
                <div>
                  <img
                    src={
                      rowData.pet_image instanceof File
                        ? URL.createObjectURL(rowData.pet_image)
                        : rowData.pet_image
                    }
                    alt=""
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  className="btn btn-danger my-2"
                  onClick={() => setRowData({ ...rowData, pet_image: null })}
                >
                  Eliminar
                </div>
              </div>
            ) : (
              <CustomInput
                label="Imagen del Animal"
                name="pet_image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRowData({ ...rowData, pet_image: e.target.files[0] })
                }
              />
            )}

            <CustomInput
              label="Nombre"
              name="f_name"
              placeholder="Nombre..."
              onChange={(e) =>
                setRowData({ ...rowData, f_name: e.target.value })
              }
              value={rowData.f_name || ""}
            />
            <CustomInput
              label="Apellido"
              name="l_name"
              placeholder="Apellido..."
              onChange={(e) =>
                setRowData({ ...rowData, l_name: e.target.value })
              }
              value={rowData.l_name || ""}
            />
            <CustomInput
              label="Fecha de nacimiento"
              max={getToDayDate()}
              value={rowData.dob || ""}
              type={"date"}
              placeholder="fecha de nacimiento"
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />

            <CustomInput
              label="Tipo"
              name="type"
              placeholder="Tipo..."
              onChange={(e) => setRowData({ ...rowData, type: e.target.value })}
              value={rowData.type || ""}
            />

            <CustomInput
              label="Calificado"
              name="qualified"
              placeholder="Calificado..."
              onChange={(e) =>
                setRowData({ ...rowData, qualified: e.target.value })
              }
              value={rowData.qualified || ""}
            />

            <CustomInput
              label="Color"
              name="coat_color"
              placeholder="Color..."
              onChange={(e) =>
                setRowData({ ...rowData, coat_color: e.target.value })
              }
              value={rowData.coat_color || ""}
            />

            <CustomInput
              label="DIRECCIÓN"
              name="address"
              placeholder="DIRECCIÓN..."
              onChange={(e) =>
                setRowData({ ...rowData, address: e.target.value })
              }
              value={rowData.address || ""}
            />

            <div className="custom_input">
              <label htmlFor="">Esterilizada</label>

              <Select
                options={sterilized?.map((e) => {
                  return {
                    label: e.label,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    is_sterillized: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  sterilized
                    ?.filter((e) => e.id == rowData.is_sterillized)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0]
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Sexo</label>

              <Select
                options={gender?.map((e) => {
                  return {
                    label: e.label,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    sex: e.label,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  gender
                    ?.filter((e) => e.label == rowData.sex)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0]
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Tamaño</label>

              <Select
                options={size?.map((e) => {
                  return {
                    label: e.label,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    size: e.label,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  size
                    ?.filter((e) => e.label == rowData.size)
                    ?.map((e) => ({
                      label: e.label,
                      value: e.id,
                    }))[0]
                }
              />
            </div>

            <div className="custom_input">
              <label htmlFor="">Raza</label>

              <Select
                placeholder={"Todos"}
                options={raza?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    raza: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  raza
                    ?.filter((e) => e.id == rowData.raza)
                    ?.map((item) => ({
                      label: item.title_es,
                      value: item.id,
                    }))[0]
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Departamento</label>

              <Select
                placeholder={"Todos"}
                options={departments?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    department: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  departments
                    ?.filter((e) => e.id == rowData.department)
                    ?.map((item) => ({
                      label: item.title_es,
                      value: item.id,
                    }))[0]
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Provincia</label>

              <Select
                placeholder={"Todos"}
                options={depProv?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    province: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  depProv
                    ?.filter((e) => e.id == rowData.province)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0]
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Distrito</label>

              <Select
                placeholder={"Todos"}
                options={provDis?.map((e) => {
                  return {
                    label: e.title_es,
                    value: e.id,
                  };
                })}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    district: e.value,
                  })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px",
                  }),
                }}
                value={
                  provDis
                    ?.filter((e) => e.id == rowData.district)
                    ?.map((e) => ({
                      label: e.title_es,
                      value: e.id,
                    }))[0]
                }
              />
            </div>
            <div className="custom_input">
              <label htmlFor="">Bio</label>
              <textarea
                type="text"
                name="bio"
                value={rowData.bio || ""}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    bio: e.target.value,
                  })
                }
                rows={1}
              ></textarea>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        title={"Confirmar eliminar Animal"}
        show={confirmButton}
        onClose={handleConfirmCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: deleteAnimal,
          children: loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ClipLoader size={20} color="#fff" loading={loading} />
            </div>
          ) : (
            "Eliminar"
          ),
          style: { backgroundColor: "#cc3636" },
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
      <Modal
        title={"Biografía"}
        show={bioModal}
        onClose={() => setBioModal(false)}
        showCloseBtn={true}
        size="900px"
        cancelButton={{
          onClick: () => setBioModal(false),
          children: "Cerca",
          style: { backgroundColor: "#858796" },
        }}
      >
        {<p className="">{rowData?.bio}</p>}
      </Modal>

      
      <div className="race_page">
        <FormCard header="Animales">
          <CustomInput
            placeholder="Buscar animales..." // <-- Search input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="department-search"
          />
          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={() => setIsOpenModal(true)}
              text="Agregar "
              icon={<FaFolderPlus />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>

      <div className="search_table_container">
        {animalLoading ? (
          <div className="d-flex align-items-center justify-content-center">
            <ClipLoader
              size={50}
              loading={animalLoading}
              color="rgb(54, 185, 204)"
            />
          </div>
        ) : (
          <Table
            className="custom-header"
            columns={columns}
            dataSource={filteredAnimal}
          />
        )}
      </div>

      <ToastContainer />
    </>
  );
}
