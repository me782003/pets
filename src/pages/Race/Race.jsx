import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import "./style.css";
import { FaFile } from "react-icons/fa";
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

export default function Race() {
  const [showModeal, setShowModal] = useState({
    editModal: false,
    updatedStatus: false,
    openModal: false,
  });

  const headers = ["ESPECIE EN", "ESPECIE ES" , "RAZA EN", "RAZA ES" , "Estado", "Acciones"];
  const [rowData, setRowData] = useState({});

  const [data, setData] = useState([]);
  const [especeiData, setEspeceiData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [espSelection, setEspSelection] = useState([
    {
        value:0 ,
        label:"all"
      }
    ]);
  const [ filterValues , setFilterValues] = useState({
    razaEnValue:"",
    razaEsValue:""
  })
  const [language, setLanguage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [createdValue, setCreatedValue] = useState({
    razaEnValue: "",
    razaEsValue: "",
  });

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
    });
    setCreatedValue({ ...createdValue, razaEnValue: "", razaEsValue: "" });
  }

  function handleSubmitRaceForm(e) {
    e.preventDefault();
    createDataRaza();
    setCreatedValue({ ...createdValue, razaEnValue: "", razaEsValue: "" });
    setShowModal({ ...showModeal, openModal: false });
  }

  // function to get all data and show it

  const get_all_data = () => {
    axios
      .get(base_url + "get_all_raza_for_admin")
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data.Raza)) {
          setData(res.data.Raza);
          setFilteredData(res.data.Raza)
          console.log(res.data.Raza.length);
        }
      })
      .catch((error) => console.log(error));
  };
  const [espFormSelection, setEspFormSelection] = useState([]);
  let task = [];
  // to get all especie
  const getAllEspSelection = () => {
    axios
      .get(base_url + `get_all_especie_for_admin`)
      .then((res) => {
        if (res.status === 200) {
          if (Array.isArray(res.data)) {
            if (res.data.length !== 0) {
              if(espSelection.length === 1){
                setEspFormSelection(res.data);
                setEspSelection([
                ...espSelection,
                ...res.data.map((item) => ({
                  value: item.id,
                  label: { language } === "en" ? item.title_en : item.title_es,
                }))
              ]);
            }
              console.log(espSelection)
              console.log(espSelection.length)
            }
          }
        }
      })
      .catch((eror) => console.log(eror));
  };
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
    console.log(createdData)
    setIsDisabled(true);
    if (createdData.title_en !== "" && createdData.title_es !== "") {
      try {
        axios.post(base_url + "create_raza", createdData).then((res) => {
          setIsDisabled(false);
          notify(res.data.message);
          get_all_data();
        });
      } catch (error) {
        notify(error);
        console.log(error);
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
  const handleRazaEditBtn = async (e) => {
    setShowModal({ ...showModeal, editModal: false });
    setIsDisabled(true);
    try {
      const res = await axios.post(
        `${base_url}update_raza/${rowData.id}`,
        updatedData
      );
      // setIsDisabled(false);
      notify(res.data.message);
      get_all_data();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  };

  // to delete the data
  const notify = (message) => toast(message);
  const handleRazaDeleteBtn = (id) => {
    setIsDisabled(true);
    axios
      .post(base_url + `delete_raza/${id}`)
      .then((res) => {
        notify(res.data.message);
        setIsDisabled(false);
        get_all_data();
      })
      .catch((error) => {
        console.log(error);
        setIsDisabled(false);
      });
    console.log("after dlete");
  };

  //to update the status
  const handleDepartUpdateBtn = (e) => {
    setIsDisabled(true);
    axios
      .get(base_url + `update_raza_status/${rowData.id}`)
      .then((res) => {
        setShowModal({ ...showModeal, updatedStatus: false });
        notify(res.data.message);
        setIsDisabled(false);
        get_all_data();
      })
      .catch((error) => {
        console.log(error);
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

    if (filterValues.razaEnValue !== ""  || filterValues.razaEsValue !== "") {
      let newData = [];
      newData = data.filter((obj) =>
        obj.title_en
          .toLowerCase()
          .includes(filterValues.razaEnValue.toLocaleLowerCase()) ||
          obj.title_es.toLocaleLowerCase().includes(filterValues.razaEsValue.toLocaleLowerCase())
      );
      setFilteredData(newData);
    } 
    else {
      setFilteredData(data);
    }
  }, [filterValues.razaEnValue, filterValues.razaEsValue ,  data]);

  useEffect(() => {
    get_all_data();
    get_all_EspeceiData();
    getAllEspSelection();
  }, []);

  return (
    <>
      <ToastContainer />({/* model that create raza */}
      <Modal
        title="Registrar Raza"
        show={showModeal.openModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: handleSubmitRaceForm,
          children: " Guardar",
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        <form className="modal_form">
          <div className="modal_input_group">
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
          </div>
          <CustomInput
            label="Raza es"
            placeholder="Escriba el nombre de la raza..."
            onChange={(e) =>
              setCreatedValue({ ...createdValue, razaEsValue: e.target.value })
            }
            value={createdValue.razaEsValue}
          />
        </form>
      </Modal>
      {/* model that show edit modal */}
      <Modal
        title={"Editar Title"}
        show={showModeal.editModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: (e) => handleRazaEditBtn(e),
          children: " Guardar",
          style: { backgroundColor: "#36b9cc" },
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: { backgroundColor: "#858796" },
        }}
      >
        <form className="modal_form">
          <CustomInput
            label={"raza es"}
            placeholder="Escriba el nombre de la departamento..."
            onChange={(e) =>
              setRowData({ ...rowData, title_en: e.target.value })
            }
            value={rowData.title_en}
          />
          <CustomInput
            label={"raza es"}
            placeholder="Escriba el nombre de la departamento..."
            onChange={(e) =>
              setRowData({ ...rowData, title_es: e.target.value })
            }
            value={rowData.title_es}
          />
        </form>
      </Modal>
      <div className="race_page">
        <FormCard header="Especies y Razas">
          <FromGroup>
            <CustomInput
              label={"Raza"}
              placeholder="Raza"
              onChange={(e) =>{ 
                setFilterValues({...filterValues , razaValue:e.target.value})
              }}
            />
          </FromGroup>

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
      <div className="race_table">
        {/* data is an array that contain all data */}
        <TableComponent header={headers}>
          {filteredData.map((item) => (
            <tr>
              <td>{item.especie_title_es}</td>
              <td>{item.especie_title_en}</td>
              <td>{item.title_en}</td>
              <td>{item.title_es}</td>
              <td>{item.hidden}</td>
              <td>
                <div className="edit_btns justify-content-center">
                  <button
                    onClick={() => {
                      handleOpenEidtModal(item);
                      setRowData(item);
                    }}
                    disabled={isDisabled}
                  >
                    <FaPencil />
                  </button>
                  <button
                    className="update_status_benefit"
                    onClick={() => {
                      // to open the confirm form
                      setShowModal({ ...showModeal, updatedStatus: true });
                      setRowData(item);
                    }}
                  >
                    actualizar
                  </button>
                  <button
                    onClick={() => handleRazaDeleteBtn(item.id)}
                    disabled={isDisabled}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Modal show when click to update status */}

          <Modal
            title="change status"
            show={showModeal.updatedStatus}
            onClose={() =>
              setShowModal({ ...showModeal, updatedStatus: false })
            }
            showCloseBtn={true}
            size="900px"
            confirmButton={{
              onClick: handleDepartUpdateBtn,
              children: " Guardar",
              style: { backgroundColor: "#36b9cc" },
              props: { disabled: isDisabled },
            }}
            cancelButton={{
              //   no errors here
              onClick: () =>
                setShowModal({ ...showModeal, updatedStatus: false }),
              // onClick: handleCloseModal,
              // console.log(showModeal.updatedStatus)
              children: "CerRar",
              style: { backgroundColor: "#858796" },
            }}
          >
            <h1>¿Estás seguro de ocultar este elemento?</h1>
          </Modal>
        </TableComponent>
      </div>
    </>
  );
}
