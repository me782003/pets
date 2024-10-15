import FormCard from "../../components/FormCard/FormCard";
import "./Order.css";
import TableComponent from "../../components/Table/Table";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import FromGroup from "./../../components/FromGroup/FromGroup";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";
import { base_url } from "../../constant";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

export default function Order() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const headers = [
    "Nombre",
    "Teléfono",
    "Correo electrónico",
    "Ubicación",
    "Número nacional",
    "Estado",
    "Valor del pedido",
    "ACCIONES",
  ];

  const [isSearch, setIsSearch] = useState(false);
  const [showUpdateOrderStatus, setShowUpdateOrderStatus] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [rowData, setRowData] = useState({});
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // Hmada
  const [data, setData] = useState([]);
  const [updatedStatusId, setUpdatedStatusId] = useState("");
  const [statusInputValue, setStatusInputValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [previousState, setPreviousState] = useState("");
  const [changeOrderStatus, setChangeOrderStatus] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const buttons = [
    "pending",
    "rejected",
    "accepted",
    "on_delivary",
    "delivared",
  ];
  //data in status selection input
  const statusSelection = [
    { label: "all orders" },
    { label: "pending" },
    { label: "rejected" },
    { label: "accepted" },
    { label: "on_delivary" },
    { label: "delivared" },
    { label: "canceled" },
  ];
  let orderStateArr = [
    "pending",
    "rejected",
    "accepted",
    "on_delivary",
    "delivared",
  ];
  const [orderDetails, setOrderDetails] = useState([]);
  const [language, setLanguage] = useState("");

  function handleCloseModal() {
    setIsOpenModal(false);
    setIsSubmitForm(false);
    setShowUpdateOrderStatus(false);
    setShowOrderDetails(false);
  }

  function handleSubmitRaceForm(e) {
    e.preventDefault();
    setIsSubmitForm(true);
    // setIsSearch(false);
    setIsOpenModal(false);
    handleOrderStatusChange();
  }

  // to get all data (order) in table
  const get_all_data = () => {
    axios
      .get(base_url + "orders/get_all_orders")
      .then((res) => {
        console.log(res.data.result);
        if (res.status === 200 && Array.isArray(res.data.result)) {
          setData(res.data.result);
          setFilteredData(res.data.result);
          console.log(filteredData);
        }
      })
      .catch((error) => console.log(error));
  };
  const [checkedValue , setCheckedValue] = useState("")


  // to active the checked btn
  const handleCheckedStatusBtn = (item)=>{
    if (
      orderStateArr.indexOf(item) >
      orderStateArr.indexOf(rowData.order_status)
    ){
      setCheckedValue(item)
    }else{
      setCheckedValue("")
      notify("check onatoher value")
    }
  }
  //to update order status
  const notify = (m) => toast(m);
  const handleOrderStatusChange = () => {
    setIsDisabled(true);
    if (
      orderStateArr.indexOf(rowData.order_status) <
      orderStateArr.indexOf(changeOrderStatus)
    ) {
      axios
        .post(base_url + `orders/change_status/${updatedStatusId}`, {
          status: changeOrderStatus,
        })
        .then((res) => {
          notify(res.data.message);
          setShowUpdateOrderStatus(false);
          setIsDisabled(false);
          get_all_data();
          setCheckedValue("")
        })
        .catch((error) => {
          console.log(error);
          setIsDisabled(false);
          setCheckedValue("")
        });
    } else {
      setIsDisabled(true);
      setLoader(false);
      notify("check onother value")
    }
  };

  // function to show order details
  const handleShowOrderDetails = () => {
    console.log("Ge");
    // console.log(orderDetails)
  };

  //handle search
  useEffect(() => {
    if (statusInputValue === "all orders") {
      setFilteredData(data);
    } else {
      const newData = data.filter(
        (item) => item.order_status === statusInputValue
      );
      setFilteredData(newData);
      // console.log(newData)
    }
  }, [statusInputValue]);

  useEffect(() => {
    get_all_data();
  }, []);
  return (
    <>
      <ToastContainer />
      {/* MODAL THAT SHOWN WHEN CLICK ON UPDATE */}
      <Modal
        title="change order status"
        show={showUpdateOrderStatus}
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
        <div className="changeStatus-btns">
          {buttons.map((item, i) => (
            <button
              key={i}
              value={item}
              className={item === rowData.order_status || item === checkedValue ? "active" : ""}
              onClick={(e) => {
                setChangeOrderStatus(e.target.value);
                handleCheckedStatusBtn(item)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </Modal>

      {/* MODAL THAT SHOWN WHEN CLICK ON SHOW */}
      <Modal
        title="Order Details"
        show={showOrderDetails}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size="900px"
      >
        <table>
          <tr>
            <th>name</th>
            <th>price</th>
            <th>image</th>
          </tr>
          {orderDetails.map((item, i) => (
            <>
              <tr>
                <td>
                  {language === "en"
                    ? item.product.name_en
                    : item.product.name_en}
                </td>
                <td>{item.product.price}</td>
                <td>no image</td>
              </tr>
            </>
          ))}
        </table>
      </Modal>

      <div className="depart_page">
        <FormCard header={"orders " + data.length}>
          <FromGroup>
            <CustomSelect
              data={statusSelection}
              label={"Status"}
              placeholder="order status"
              onChange={(e) => setStatusInputValue(e.label)}
            />
          </FromGroup>
        </FormCard>
      </div>
      <div className="depart_table">
        {/* TABLE THAT SHOW DATA (ORDERS) */}
        <TableComponent header={headers}>
          {filteredData.map((item) => (
            <tr>
              {/* <td>{item.id}</td> */}
              <td>{item.user.name}</td>
              <td>{item.user.phone}</td>
              <td>{item.user.email}</td>
              <td>{item.location}</td>
              <td>{item.national_number}</td>
              <td>{item.order_status}</td>
              <td>{item.order_value}</td>
              {/* <td>{item.credit_card}</td> */}
              <td className="edit_btns">
                {/* update button */}
                <button
                  // className="update_status_benefit"
                  onClick={() => {
                    // to open the confirm form
                    setShowUpdateOrderStatus(true);
                    // to save the datea
                    setRowData(item);
                    console.log(item.order_status)
                    setUpdatedStatusId(item.id);
                    // save the status for this item to active it
                    setPreviousState(item.order_status);
                  }}
                >
                  actualizar
                </button>
                {/* show button */}
                <button
                  className="update_status_benefit"
                  onClick={() => {
                    // to open the confirm form
                    // setShowUpdateOrderStatus(true);
                    setShowOrderDetails(true);
                    handleShowOrderDetails();
                    // setUpdatedStatusId(item.id);
                    // setPreviousState(item.order_status)
                    console.log(item.id);
                    setOrderDetails(item.orderprods);
                    console.log(item.orderprods);
                  }}
                >
                  espectáculo
                </button>
              </td>
            </tr>
          ))}
        </TableComponent>
      </div>
    </>
  );
}
