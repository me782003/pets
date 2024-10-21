import FormCard from "../../components/FormCard/FormCard";
import "./Order.css";
import TableComponent from "../../components/Table/Table";
import {useEffect, useState} from "react";
import Modal from "../../components/Modal/Modal";
import FromGroup from "./../../components/FromGroup/FromGroup";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";
import {base_url} from "../../constant";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {LoadingOutlined} from "@ant-design/icons";
import {Flex, Spin, Table} from "antd";

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
    {label: "all orders"},
    {label: "pending"},
    {label: "rejected"},
    {label: "accepted"},
    {label: "on_delivary"},
    {label: "delivared"},
    {label: "canceled"},
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
  const [checkedValue, setCheckedValue] = useState("");

  // to active the checked btn
  const handleCheckedStatusBtn = (item) => {
    if (
      orderStateArr.indexOf(item) > orderStateArr.indexOf(rowData.order_status)
    ) {
      setCheckedValue(item);
    } else {
      setCheckedValue("");
      notify("check onatoher value");
    }
  };
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
          setCheckedValue("");
        })
        .catch((error) => {
          console.log(error);
          setIsDisabled(false);
          setCheckedValue("");
        });
    } else {
      setIsDisabled(true);
      setLoader(false);
      notify("check onother value");
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

  const columns = [
    {
      title: "Nombre",
      dataIndex: "title",
      key: "title",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.user.name}
        </div>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "Teléfono",
      key: "Teléfono",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.user.phone}
        </div>
      ),
    },
    {
      title: "Correo electrónico",
      dataIndex: "Correo electrónico",
      key: "Correo electrónico",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.user.email}
        </div>
      ),
    },
    {
      title: "Ubicación",
      dataIndex: "Correo electrónico",
      key: "Correo electrónico",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.location}
        </div>
      ),
    },
    {
      title: "Número nacional",
      dataIndex: "Correo electrónico",
      key: "Correo electrónico",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.national_number}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "Correo electrónico",
      key: "Correo electrónico",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.order_status}
        </div>
      ),
    },
    {
      title: "Valor del pedido",
      dataIndex: "Valor del pedido",
      key: "Valor del pedido",
      render: (text, row) => (
        <div className='text-center' color='green'>
          {row.order_value}
        </div>
      ),
    },
    {
      title: "Comportamiento",
      dataIndex: "Valor del pedido",
      key: "Valor del pedido",
      render: (text, row) => (
        <div className='edit_btns'>
          {/* update button */}
          <button
            // className="update_status_benefit"
            onClick={() => {
              // to open the confirm form
              setShowUpdateOrderStatus(true);
              // to save the datea
              setRowData(row);
              console.log(row.order_status);
              setUpdatedStatusId(row.id);
              // save the status for this row to active it
              setPreviousState(row.order_status);
            }}
          >
            actualizar
          </button>
          {/* show button */}
          <button
            className='update_status_benefit'
            onClick={() => {
              // to open the confirm form
              // setShowUpdateOrderStatus(true);
              setShowOrderDetails(true);
              handleShowOrderDetails();
              // setUpdatedStatusId(row.id);
              // setPreviousState(row.order_status)
              setRowData(row);
              console.log(row.id);
              setOrderDetails(row.orderprods);
              console.log(row.orderprods);
            }}
          >
            espectáculo
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      {/* MODAL THAT SHOWN WHEN CLICK ON UPDATE */}
      <Modal
        title='Cambiar el estado del pedido'
        show={showUpdateOrderStatus}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size='900px'
        confirmButton={{
          onClick: handleSubmitRaceForm,
          children: " Guardar",
          style: {backgroundColor: "#36b9cc"},
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
      >
        {/* loadin  */}
        {loader ? (
          <Flex align='center' className='loader' gap='middle'>
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
        <div className='changeStatus-btns flex-wrap my-3'>
          {buttons.map((item, i) => (
            <button
              key={i}
              value={item}
              className={
                item === rowData.order_status || item === checkedValue
                  ? "active"
                  : ""
              }
              onClick={(e) => {
                setChangeOrderStatus(e.target.value);
                handleCheckedStatusBtn(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </Modal>

      {/* MODAL THAT SHOWN WHEN CLICK ON SHOW */}
      <Modal
        title='Order Details'
        show={showOrderDetails}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size='900px'
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
                <td>
                  <img src={item.product.image} alt='' />
                </td>
              </tr>
            </>
          ))}
        </table>
      </Modal>

      <div className='depart_page'>
        <FormCard header={"orders " + data.length}>
          <FromGroup>
            <CustomSelect
              data={statusSelection}
              label={"Status"}
              placeholder='order status'
              onChange={(e) => setStatusInputValue(e.label)}
            />
          </FromGroup>
        </FormCard>
      </div>

      <div className='search_table_container'>
        <Table className='custom-header' columns={columns} dataSource={data} />
      </div>
    </>
  );
}
