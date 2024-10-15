import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import { FaFolderPlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import TableComponent from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { base_url, img_base_url } from "../../constant";
import { notify } from "../../assets/notification/notification";
import { ToastContainer } from "react-toastify";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

export default function AddAnimal() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [razaData, setRazaData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [districtData, setDistrctData] = useState([]);
  const [data, setData] = useState([]);

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
    is_sterillized: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const headers = [
    "Imagen del Animal",
    "Nombre",
    "Apellido",
    "Fecha de Nacimiento",
    "Sexo",
    "Esterilizado",
    "Calificado",
    "Tipo",
    "Color",
    "Dirección",
    "Acciones",
  ];

  const sterillized = [
    {
      value: 0,
      title: "Hidden",
    },
    {
      value: 1,
      title: "Displayed",
    },
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
        f_name: item.f_name,
        l_name: item.l_name,
        pet_image: null,
        dob: item.dob,
        sex: item.sex,
        qualified: item.qualified,
        type: item.type,
        coat_color: item.coat_color,
        address: item.address,
      });
    } else {
      setEditMode(false);
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
      });
    }
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setCurrentId(null);
  };

  const getAnimalData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${img_base_url}animals/all_animals`);
      if (res.status === 200 && Array.isArray(res.data.result)) {
        setData(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRazaData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(base_url+`get_all_raza_for_admin`);
      if (res.status === 200 && Array.isArray(res.data.Raza)) {
        setRazaData(res.data.Raza);
        if (res.data.Raza.length > 0) {
          setFormData({ ...formData, raza: res.data.Raza[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(base_url+`get_all_departmento_for_admin`);
      if (res.status === 200 && Array.isArray(res.data.Departments)) {
        setDepartmentData(res.data.Departments);
        if (res.data.Departments.length > 0) {
          setFormData({ ...formData, department: res.data.Departments[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProvinciaData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        base_url+`departmento_prov/${formData.department}`
      );
      if (res.status === 200 && Array.isArray(res.data)) {
        setProvinceData(res.data);

        if (res.data.length > 0) {
          setFormData({ ...formData, province: res.data[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDistrictData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(base_url+`prov_dis/${formData.province}`);
      if (res.status === 200 && Array.isArray(res.data)) {
        setDistrctData(res.data);

        if (res.data.length > 0) {
          setFormData({ ...formData, district: res.data[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("image", formData.pet_image);

      const imgRes = await axios.post(img_base_url + "img_upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          lang: "es",
        },
      });

      if (imgRes.data.status === "success") {
        const imageUrl = imgRes.data.result.image;

        const animalData = {
          ...formData,
          pet_image: imageUrl,
        };

        const res = await axios.post(
          img_base_url + "animals/admin_add_animal",
          animalData,
          {
            headers: {
              lang: "es",
            },
          }
        );

        notify("Animal añadido con éxito", "success");
        getAnimalData();
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAnimal = async () => {
    setLoading(true);
    try {
      let iconUrl = formData.pet_image;

      if (formData.pet_image && formData.pet_image.name) {
        const formDataImage = new FormData();
        formDataImage.append("image", formData.pet_image);

        const { data: imgRes } = await axios.post(
          img_base_url + "img_upload",
          formDataImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              lang: "es",
            },
          }
        );

        iconUrl = imgRes.result.image;
      }

      const animalData = {
        ...formData,
        pet_image: iconUrl,
      };

      await axios.post(
        img_base_url + `animals/admin_update_animal/${currentId}`,
        animalData,
        {
          headers: {
            lang: "es",
          },
        }
      );

      notify("animal actualizado con éxito!", "success");
      getAnimalData();
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnimal = async (e) => {
    setLoading(true);
    try {
      const res = await axios.post(
        img_base_url + `animals/admin_delete_animal/${e}`,
        {
          headers: {
            lang: "es",
          },
        }
      );
      notify("animal actualizado con éxito!", "success");
      getAnimalData();
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
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
      formData.pet_image === null ||
      formData.sex === "" ||
      formData.dob === "" ||
      formData.f_name === "" ||
      formData.l_name === "" ||
      formData.type === "" ||
      formData.coat_color === ""
    ) {
      notify("Por favor completa la información", "error");
      return;
    }
    if (editMode) {
      await updateAnimal();
    } else {
      await addAnimal();
    }
    setIsOpenModal(false);
  };

  useEffect(() => {
    getAnimalData();
    getRazaData();
    getDepartmentData();
  }, []);

  useEffect(() => {
    getProvinciaData();
  }, [formData.department]);

  useEffect(() => {
    getDistrictData();
  }, [formData.province]);

  return (
    <>
      <Modal
        title={editMode ? "Editar animal" : "agregar animal"}
        show={isOpenModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        style={{ height: "100%", overflow: "auto" }}
        confirmButton={{
          onClick: handleSubmitForm,
          loading: loading,
          children: editMode ? "Actualizar" : "Agregar",
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
        <form className="modal_form">
          <CustomInput
            label="Pet Image"
            name="pet_image"
            type="file"
            onChange={handleInputChange}
          />

          <CustomInput
            label="fecha de nacimiento"
            name="dob"
            placeholder="introduzca la fecha de nacimiento del animal..."
            onChange={handleInputChange}
            value={formData.dob}
          />

          <CustomInput
            label="Nombre de Pila"
            name="f_name"
            placeholder="Ingrese el título en inglés..."
            onChange={handleInputChange}
            value={formData.f_name}
          />

          <CustomInput
            label="Apellido"
            name="l_name"
            placeholder="ingrese el apellido del animal..."
            onChange={handleInputChange}
            value={formData.l_name}
          />

          <CustomInput
            label="Sexo"
            name="sex"
            placeholder="introduzca el sexo animal..."
            onChange={handleInputChange}
            value={formData.sex}
          />

          <CustomSelect
            data={departmentData.map((it) => {
              return {
                label: it.title_es,
                value: it.id,
              };
            })}
            label={"Departamento"}
            placeholder="TODOS"
            value={
              departmentData
                .map((it) => {
                  return { label: it.title_es, value: it.id };
                })
                .filter((item) => item.value == formData?.department)[0]?.label
            }
            onChange={(e) => {
              setFormData({ ...formData, department: e.value });
            }}
          />

          <CustomSelect
            data={razaData.map((it) => {
              return {
                label: it.title_es,
                value: it.id,
              };
            })}
            label={"Raza"}
            placeholder="TODOS"
            value={
              razaData
                .map((it) => {
                  return { label: it.title_es, value: it.id };
                })
                .filter((item) => item.value == formData?.raza)[0]?.label
            }
            onChange={(e) => {
              setFormData({ ...formData, raza: e.value });
            }}
          />

          <CustomSelect
            data={provinceData.map((it) => {
              return {
                label: it.title_es,
                value: it.id,
              };
            })}
            value={
              provinceData &&
              Array.isArray(provinceData) &&
              provinceData.length > 0
                ? provinceData
                    .map((it) => {
                      return { label: it.title_es, value: it.id };
                    })
                    .filter((e) => e.value == formData?.province)[0]?.label
                : ""
            }
            label={"Provincia"}
            placeholder="TODOS"
            onChange={(e) => {
              setFormData({ ...formData, province: e.value });
            }}
          />

          <CustomSelect
            data={districtData.map((item) => {
              return {
                label: item.title_es,
                value: item.id,
              };
            })}
            value={
              districtData &&
              Array.isArray(districtData) &&
              districtData.length > 0
                ? districtData
                    .map((it) => {
                      return { label: it.title_es, value: it.id };
                    })
                    .filter((e) => e.value == formData?.province)[0]?.label
                : ""
            }
            label={"Distrito"}
            placeholder="TODOS"
            onChange={(e) => {
              setFormData({ ...formData, district: e.value });
            }}
          />

          <CustomSelect
            data={sterillized.map((e) => {
              return {
                label: e.title,
                value: e.value,
              };
            })}
            label={"Sterillized"}
            placeholder="sterillized"
            onChange={(e) => {
              setFormData({ ...formData, is_sterillized: e.value });
            }}
          />

          <CustomInput
            label="Tipo de animal"
            name="type"
            placeholder="introduzca el tipo de animal..."
            onChange={handleInputChange}
            value={formData.type}
          />

          <CustomInput
            label="Color animal"
            name="coat_color"
            placeholder="introduce el color del animal..."
            onChange={handleInputChange}
            value={formData.coat_color}
          />
          <CustomInput
            label="Calificado"
            name="qualified"
            placeholder="Ingrese el título en inglés..."
            onChange={handleInputChange}
            value={formData.qualified}
          />

          <CustomInput
            label="DIRECCIÓN"
            name="address"
            placeholder="ingrese la dirección..."
            onChange={handleInputChange}
            value={formData.address}
          />
        </form>
      </Modal>
      <div className="race_page">
        <FormCard header="Agregar Animal">
          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={() => handleOpenModal()}
              text="Agregar Animal"
              icon={<FaFolderPlus />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>
      <div className="race_table">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableComponent header={headers}>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.pet_image} alt="" />
                </td>
                <td>{item.f_name}</td>
                <td>{item.l_name}</td>
                <td>{item.dob}</td>
                <td>{item.sex}</td>
                <td>{item.is_sterillized}</td>
                <td>{item.qualified}</td>
                <td>{item.type}</td>
                <td>{item.coat_color}</td>
                <td>{item.address}</td>
                <td>
                  <div className="edit_btns justify-content-center">
                    <button onClick={() => handleOpenModal(item)}>
                      <FaPencil />
                    </button>

                    <button onClick={() => deleteAnimal(item.id)}>
                      <FaRegTrashCan />
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