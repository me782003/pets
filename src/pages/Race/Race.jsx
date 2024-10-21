import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import "./style.css";
import { FaFile, FaTrash } from "react-icons/fa";
import TableComponent from "../../components/Table/Table";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import FromGroup from "./../../components/FromGroup/FromGroup";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { base_url } from "../../constant";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetAllRaza from "../../CustomHooks/useGetAllRaza";
import { Table } from "antd";
import cx from "classnames";
import Spinner from "../../utils/Spinner/Spinner";
import { useMediaQuery } from "../../CustomHooks/useMediaQueries";
import CustomInputWithSearch from "../../components/CustomInputWithSearch/CustomInputWithSearch";
import { edit } from "../../assets/svgIcons";

export default function Race() {
  const [showModeal, setShowModal] = useState({
    editModal: false,
    updatedStatus: false,
    openModal: false,
    deleteModal: false,
  });

  const isSmallScreen = useMediaQuery("(max-width:786px)");

  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [especeiData, setEspeceiData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filterValues, setFilterValues] = useState({
    razaEnValue: "",
    razaEsValue: "",
  });
  const [language, setLanguage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [createdValue, setCreatedValue] = useState({
    razaEnValue: "",
    razaEsValue: "",
  });

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  function handleOpenModal() {
    setShowModal({ ...showModeal, openModal: true });
  }
  const handleOpenEidtModal = () => {
    setShowModal({ ...showModeal, editModal: true });
  };
  function handleCloseModal() {
    setShowModal({
      ...showModeal,
      openModal: false,
      updatedStatus: false,
      editModal: false,
      deleteModal: false,
    });
    setCreatedValue({ ...createdValue, razaEnValue: "", razaEsValue: "" });
  }

  function handleSubmitRaceForm(e) {
    e.preventDefault();
    createDataRaza();
    setCreatedValue({ ...createdValue, razaEnValue: "", razaEsValue: "" });
    // setShowModal({ ...showModeal, openModal: false });
  }

  // function to get all data and show it

  const notify = (message, success) => {
    if ((success = "success")) {
      toast.success(message);
    } else if ((success = "error")) {
      toast.error(message);
    }
  };

  const {
    handleGetAllRaza,
    raza,
    setRaza,
    originalRaza,
    setOriginalRaza,
    loading: gettingLoading,
  } = useGetAllRaza();

  const columns = [
    {
      title: "Titulo en español",
      dataIndex: "title_es",
      key: "title_es",
      render: (text, row) => {
        return <div className={"text-center"}>{row.title_es}</div>;
      },
    },
    {
      title: "T itulo en ingles",
      dataIndex: "title_en",
      key: "title_en",
      render: (text, row) => {
        return <div className={"text-center"}>{row.title_en}</div>;
      },
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
      dataIndex: "",
      key: "",
      render: (text, row) => (
        <div className="justify-content-center d-flex align-items-center gap-2">
          <button
            onClick={() => {
              handleOpenEidtModal(true);
              setRowData(row);
            }}
            disabled={isDisabled}
            className="btn-sm btn btn-primary fs-6 text-white"
          >
            {edit}
          </button>
          <button
            className="update_status_benefit"
            onClick={() => {
              // to open the confirm form
              setRowData(row);
              setShowModal({ ...showModeal, updatedStatus: true });
            }}
          >
            actualizar
          </button>
          <button
            onClick={() => {
              setRowData(row);
              setShowModal({ ...showModeal, deleteModal: true });
            }}
            disabled={isDisabled}
            className=" btn-sm btn btn-danger fs-6 text-white"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];
  // const get_all_data = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(base_url + "get_all_raza_for_admin");

  //     if (res.status === 200 && Array.isArray(res.data.Raza)) {
  //       setData(res.data.Raza);
  //       setFilteredData(res.data.Raza);
  //       console.log("Data length:", res.data.Raza.length);
  //     } else {
  //       console.warn("Unexpected response format or no data found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message || error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [espFormSelection, setEspFormSelection] = useState([]);
  let task = [];

  // to set esp form selection
  const espFormData = espFormSelection.map((item) => {
    let textContent;
    if (language === "en") {
      textContent = item.title_en;
    } else {
      textContent = item.title_es;
    }
    return <option>{textContent}</option>;
  });

  // to get all option in especeiData
  const get_all_EspeceiData = () => {
    // console.log("get_all_especie_for_admin");
    axios
      .get(base_url + "get_all_especie_for_admin")
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          setEspeceiData(res.data);
          // console.log(especeiData);
        }
      })
      .catch((error) => console.log(error));
  };

  // created data values
  const createdData = {
    especie_id: 2,
    title_en: createdValue.razaEnValue,
    title_es: createdValue.razaEsValue,
  };

  // to post data into raza
  const createDataRaza = async () => {
    console.log(createdData);
    setLoading(true);
    setIsDisabled(true);
    if (createdData.title_en !== "" && createdData.title_es !== "") {
      try {
        const res = await axios.post(base_url + "create_raza", createdData);
        if (res.status === 200) {
          notify(res.data.message, "success");
          handleGetAllRaza();
          handleCloseModal();
        }
      } catch (error) {
        notify(error.message, "error");
        console.error(error);
      } finally {
        setLoading(false);
        setIsDisabled(false);
      }
    }
  };

  // to edit the data
  const updatedData = {
    especie_id: rowData.especie_id,
    title_en: rowData.title_en,
    title_es: rowData.title_es,
  };
  const handleRazaEditBtn = async () => {
    setLoading(true);
    setIsDisabled(true);

    try {
      const res = await axios.post(
        `${base_url}update_raza/${rowData.id}`,
        updatedData
      );
      notify(res.data.message, "success");
      handleGetAllRaza();
      handleCloseModal();
    } catch (error) {
      notify(error.message, "error");
      console.error(error);
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  // to delete the data

  const handleRazaDeleteBtn = (id) => {
    setIsDisabled(true);
    setLoading(true);

    axios
      .post(base_url + `delete_raza/${id}`)
      .then((res) => {
        notify(res.data.message, "success");
        handleGetAllRaza();
        handleCloseModal();
      })
      .catch((error) => {
        notify(error.message, "error");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setIsDisabled(false);
      });
  };
  //to update the status
  const handleDepartUpdateBtn = () => {
    setIsDisabled(true);
    setLoading(true);

    axios
      .get(base_url + `update_raza_status/${rowData.id}`)
      .then((res) => {
        notify(res.data.message, "success");
        setShowModal({ ...showModeal, updatedStatus: false });
        handleGetAllRaza();
        handleCloseModal();
      })
      .catch((error) => {
        notify(error.message, "error");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setIsDisabled(false);
      });
  };

  // handle search
  useEffect(() => {
    // console.log(filterValues.razaEnValue)
    // console.log(filterValues.raza)
    // If User Choose All Data
    // if(filterValues.razaEnValue === 0){
    // setFilteredData(data)
    // return
    // }
    // console.log("g")
    //  filterValues.razaEsValue !== "") { {
    // .toLowerCase()
    // .includes(filterValues.razaEsValue.toLocaleLowerCase())

    if (filterValues.razaEnValue !== "" || filterValues.razaEsValue !== "") {
      let newData = [];
      newData = data.filter(
        (obj) =>
          obj.title_en
            .toLowerCase()
            .includes(filterValues.razaEnValue.toLocaleLowerCase()) ||
          obj.title_es
            .toLocaleLowerCase()
            .includes(filterValues.razaEsValue.toLocaleLowerCase())
      );
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  }, [filterValues.razaEnValue, filterValues.razaEsValue, data]);

  useEffect(() => {
    // get_all_data();
    // get_all_EspeceiData();
    // getAllEspSelection();

    handleGetAllRaza();
  }, []);

  useEffect(() => {
    if (
      originalRaza &&
      originalRaza.length > 0 &&
      Array.isArray(originalRaza)
    ) {
      if (searchValue.length >= 1) {
        const newData = originalRaza.filter((item) => {
          if (
            searchValue &&
            !item?.title_es?.includes(searchValue) &&
            !item?.title_en?.includes(searchValue)
          ) {
            return false;
          }
          return true;
        });
        setRaza(newData);
      } else {
        setRaza(originalRaza);
      }
    }
  }, [searchValue, originalRaza]);

  return (
    <>
      <ToastContainer />
      <Modal
        title="Registrar Raza"
        show={showModeal.openModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: handleSubmitRaceForm,
          children: loading ? (
            <Spinner size={20} color="#fff" loading={loading} />
          ) : (
            "Guardar"
          ),
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <Spinner size={50} color="rgb(54, 185, 204)" loading={loading} />
        ) : (
          <form className="modal_form">
            <CustomInput
              label="Raza es"
              placeholder="Escriba el nombre de la raza..."
              onChange={(e) =>
                setCreatedValue({
                  ...createdValue,
                  razaEsValue: e.target.value,
                })
              }
              value={createdValue.razaEsValue}
            />
            <CustomInput
              label="Raza en"
              placeholder="Escriba el nombre de la raza..."
              onChange={(e) =>
                setCreatedValue({
                  ...createdValue,
                  razaEnValue: e.target.value,
                })
              }
              value={createdValue.razaEnValue}
            />
          </form>
        )}
      </Modal>
      <Modal
        title="Estado de actualización"
        show={showModeal?.updatedStatus}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: () => handleDepartUpdateBtn(),
          children: loading ? (
            <Spinner size={20} color="#fff" loading={loading} />
          ) : (
            "Guardar"
          ),
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <Spinner size={50} color="rgb(54, 185, 204)" loading={loading} />
        ) : (
          <h3 className="my-3">
            {rowData.hidden == 1
              ? "¿Estás segura de que quieres mostrar este artículo?"
              : "¿Estás seguro de que deseas ocultar este artículo?"}
          </h3>
        )}
      </Modal>
      {/* model that show edit modal */}
      <Modal
        title={"Actualizar Raza"}
        show={showModeal.editModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: (e) => handleRazaEditBtn(e),
          children: loading ? (
            <Spinner size={20} color="#fff" loading={loading} />
          ) : (
            "Guardar"
          ),
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <Spinner size={50} color="rgb(54, 185, 204)" loading={loading} />
        ) : (
          <form className="modal_form">
            <CustomInput
              label={"Raza es"}
              placeholder="Escriba el nombre de la departamento..."
              onChange={(e) =>
                setRowData({ ...rowData, title_es: e.target.value })
              }
              value={rowData.title_es}
            />
            <CustomInput
              label={"Raza en"}
              placeholder="Escriba el nombre de la departamento..."
              onChange={(e) =>
                setRowData({ ...rowData, title_en: e.target.value })
              }
              value={rowData.title_en}
            />
          </form>
        )}
      </Modal>

      <Modal
        title={"Confirmación de eliminación..."}
        show={showModeal.deleteModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: (e) => handleRazaDeleteBtn(rowData.id),
          props:{className:"btn btn-danger"},
          children: loading ? (
            <Spinner size={20} color="#fff" loading={loading} />
          ) : (
            "Borrar"
          ),
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        {loading ? (
          <Spinner size={50} color="rgb(54, 185, 204)" loading={loading} />
        ) : (
          <h3 className="my-3">
            ¿Estás seguro de que deseas eliminar este artículo?
          </h3>
        )}
      </Modal>
      <div className="race_page">
        <FormCard header="Especies y Razas">
          <div style={{ width: isSmallScreen ? "100%" : "40.33%" }}>
            <CustomInputWithSearch
              placeholder="Buscando..."
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>

          <div className="mt-4 d-flex align-items-center gap-4">
            <CustomButton
              textColor="#333"
              onClick={handleOpenModal}
              text="Nuevo"
              icon={<FaFile />}
              color={"#222"}
              bgColor="#fff"
            />
          </div>
        </FormCard>
      </div>
      {gettingLoading ? (
        <Spinner size={50} color="rgb(54, 185, 204)" loading={gettingLoading} />
      ) : (
        <div className="search_table_container">
          <Table
            className="custom-header"
            columns={columns}
            dataSource={raza}
          />
        </div>
      )}
    </>
  );
}
