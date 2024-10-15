import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import FormCard from "../../components/FormCard/FormCard";
import "./DeliveryMan.css";
import { FaFile, FaSearch } from "react-icons/fa";
import TableComponent from "../../components/Table/Table";
import { race } from "../../utils/race";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import FromGroup from "./../../components/FromGroup/FromGroup";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { base_url } from "../../constant";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

export default function DeliveryMan() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const headers = ["Nombre", "Teléfono", "Estado", "ACCIONES"];
  // const [isSearch, setIsSearch] = useState(false);
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [rowData, setRowData] = useState({});

  // Hmada
  const [data, setData] = useState([]);
  // const [especeiData, setEspeceiData] = useState([]);
  // const [nombreValue, setNombreValue] = useState("");
  // const [description, setDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  // const [departInputValue, setDepartInputValue] = useState("");
  const [phoneInputValue, setPhoneInputValue] = useState("");
  // const [espSelection, setEspSelection] = useState("");
  // const [espInputValueId, setEspInputValueId] = useState("");
  // const [language, setLanguage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [postedData, setPostedData] = useState({
    name: "",
    phone: "",
  });

  function handleOpenModal() {
    setIsOpenModal(true);
  }
  function handleCloseModal() {
    setIsOpenModal(false);
    setIsSubmitForm(false);
    setShowUpdateStatus(false);
  }

  function handleSubmitRaceForm(e) {
    e.preventDefault();
    setIsSubmitForm(true);
    // setIsSearch(false);
    setIsOpenModal(false);
    createDataDelivery();
  }

  // function to get all data (deleivery man information)

  const get_all_data = () => {
    axios
      .get(base_url + "get_all_delivery_for_admin")
      .then((res) => {
        console.log(res);
        if (res.status === 200 && Array.isArray(res.data.Delivery)) {
          setData(res.data.Delivery);
          setFilteredData(res.data.Delivery);
          console.log(filteredData);
        }
      })
      .catch((error) => console.log(error));
  };

  // function to post data (delievery man information) in table

  // to post data into raza
  const createDataDelivery = async () => {
    setIsDisabled(true);
    console.log(postedData);
    console.log(postedData.name === "undefined");
    if (postedData.name !== "" && postedData.phone !== "") {
      try {
        axios.post(base_url + "create_delivery", postedData).then((res) => {
          setIsDisabled(false);
          notify(res.data.message);
          get_all_data();
        });
      } catch (error) {
        console.log(error);
        setIsDisabled(false);
      }
    }
  };

  // function to update status of deleiver in table

  const handleDepartUpdateBtn = async () => {
    setLoader(true);
    setIsDisabled(true);
    console.log(updatedId);
    try {
      const res = await axios.get(
        base_url + `update_delivery_status/${updatedId}`
      );
      console.log(res.data.message);
      notify(res.data.message);
      setShowUpdateStatus(false);
      get_all_data();
    } catch (error) {
      setShowUpdateStatus(false);
      console.error(error);
    } finally {
      setLoader(false);
      setIsDisabled(false);
    }
  };

  // to delete the data
  const notify = (message) => toast(message);
  const handleDeliveryDeleteBtn = (e) => {
    console.log(e);
    setIsDisabled(true);
    axios
      .post(base_url + `delete_delivery/${e}`)
      .then((res) => {
        console.log(res.data);
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

  // handle search
  // let newData = []
  useEffect(() => {
    const newData = data.filter((item) => item.phone.includes(phoneInputValue));
    setFilteredData(newData);
  }, [phoneInputValue]);
  // console.log(especeiData)
  useEffect(() => {
    get_all_data();
    // getAllEspSelection()
  }, []);
  return (
    <>
      <ToastContainer />
      <Modal
        title="Registrar Delievery Man"
        show={isOpenModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
        confirmButton={{
          onClick: handleSubmitRaceForm,
          children: " Guardar",
          // onChange:{handleGuardarBtn},
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
            label="Name"
            placeholder="Escriba el name de la Delievery..."
            onChange={(e) =>
              setPostedData({ ...postedData, name: e.target.value })
            }
          />
          <CustomInput
            label="Phone"
            placeholder="Escriba el nombre de la Delievery..."
            onChange={(e) =>
              setPostedData({ ...postedData, phone: e.target.value })
            }
          />
        </form>
      </Modal>
      <div className="race_page">
        <FormCard header="Delivery Man">
          <FromGroup>
            <CustomInput
              label={"Phone"}
              placeholder="Phone"
              onChange={(e) => setPhoneInputValue(e.target.value)}
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
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.hidden}</td>
              <td>
                <div className="edit_btns justify-content-center">
                  <button
                    className="update_status_benefit"
                    onClick={(e) => {
                      // to open the confirm form
                      setShowUpdateStatus(true);
                      setRowData(item);
                      setUpdatedId(item.id);
                    }}
                  >
                    actualizar
                  </button>
                  <button
                    onClick={() => handleDeliveryDeleteBtn(item.id)}
                    disabled={isDisabled}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          <Modal
            title="Registrar Title"
            show={showUpdateStatus}
            onClose={handleCloseModal}
            showCloseBtn={true}
            size="900px"
            confirmButton={{
              onClick: (item) => handleDepartUpdateBtn(item),
              children: " Guardar",
              style: { backgroundColor: "#36b9cc" },
              props: { disabled: isDisabled },
            }}
            cancelButton={{
              //   no errors here
              onClick: handleCloseModal,
              children: "Cerrar",
              style: { backgroundColor: "#858796" },
            }}
          >
            {/* loadin  */}
            {loader ? (
              <Flex align="center" className="loader" gap="middle">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 48,
                      }}
                      spin
                    />
                  }
                />
              </Flex>
            ) : null}
            <h1>¿Estás seguro de ocultar este elemento?</h1>
          </Modal>
        </TableComponent>
      </div>
    </>
  );
}
