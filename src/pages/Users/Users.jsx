import {FaFile, FaPen, FaSearch} from "react-icons/fa";
import FormCard from "../../components/FormCard/FormCard";
import "./style.css";
import CustomInputWithSearch from "../../components/CustomInputWithSearch/CustomInputWithSearch";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import TableComponent from "../../components/Table/Table";
import {useEffect, useRef, useState} from "react";
import Modal from "../../components/Modal/Modal";
import {users} from "../../utils/users";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaPencil,
  FaRegTrashCan,
} from "react-icons/fa6";
import checkboxImg from "../../assets/images/check-on (1).png";
import Select from "react-select";
import noPets from "../../assets/images/noPets (1).png";
import { Table } from "antd";
import useGetUsers from "../../CustomHooks/useGetUsers";
  import cx from "classnames"
import { formatDate } from "../../CustomHooks/dateFormats";
const perfilOptions = [
  {label: "ADMINISTRADOR", value: "ADMINISTRADOR"},
  {label: "CLIENTE", value: "CLIENTE"},
  {label: "ASESOR", value: "ASESOR"},
  {label: "PROPIETARIO", value: "PROPIETARIO"},
];


const tabs = [
  {
    id: "1",
    name: "Datos",
  },
  {
    id: "2",
    name: "FOTO",
  },
];

export default function Users() {
  const headers = [
    "",
    "FOTO",
    "ACTIVO",
    "PERFIL",
    "EMAIL",
    "NOMBRE",
    "APELLIDO",
  ];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const fileInputRef = useRef(null);
  const [img, setImg] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = URL.createObjectURL(event.target.files[0]);
    setImg(file);
  };

  function handleOpenModal() {
    setIsOpenModal(true);
  }

  function handleCloseModal() {
    setIsOpenModal(false);
  }

  
const {handleGetUsers , users , setUsers , originalUsers , setOriginalUsers , loading , setLoading} = useGetUsers()
  useEffect(()=>{
    handleGetUsers()
  },[])


  const columns = [
    {
      title: "Nombre de usuario",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Registrado en",
      dataIndex: "created_at",
      key: "created_at",
      render: (text , row) => <div>
          {formatDate(row.created_at)}
      </div>,
    },
    
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      render: (text , row) => <div>
        {row.phone}
      </div>
    },


   
  ];



  return (
    <>
      {isOpenModal && (
        <Modal
          size='1000px'
          style={{width: "800px"}}
          title='Registrar Usuario'
          show={isOpenModal}
          onClose={handleCloseModal}
        >
          <>
            <div className='modal_tabs'>
              {tabs?.map((tab, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`modal_tab ${
                      selectedTab == tab?.id ? "active" : ""
                    }`}
                  >
                    {tab?.name}
                  </div>
                );
              })}
            </div>

            {selectedTab == 1 ? (
              <form>
                <div className='user_input_group'>
                  <CustomInput
                    label='Nombres'
                    placeholder='Escriba el nombre...'
                    required
                  />
                  <CustomInput
                    label='Apellidos'
                    placeholder='Escriba el apellido...'
                    required
                  />
                  <div className='user-select'>
                    <label>
                      Sexo <span>(*)</span>
                    </label>
                    <select>
                      <option>Seleccionar</option>
                      <option>Masculino</option>
                      <option>Femenino</option>
                    </select>
                  </div>
                </div>

                <div className='user_input_group'>
                  <CustomInput
                    label='Fecha de Nacimiento'
                    required
                    type='date'
                  />
                  <CustomInput
                    label='Telefono'
                    placeholder='Escriba el telefono...'
                  />
                  <CustomInput
                    label='Celular'
                    placeholder='Escriba el celular...'
                  />
                </div>

                <div className='user-select user-select-search'>
                  <label>
                    Perfil <span>(*)</span>
                  </label>
                  <Select placeholder='Seleccione' options={perfilOptions} />
                </div>

                <div className='user_input_group'>
                  <CustomInput
                    label='E-mail'
                    required
                    placeholder='Escriba el e-mail...'
                    type='email'
                  />
                  <CustomInput
                    label='Contraseña'
                    required
                    placeholder='Escriba la contraseña...'
                    type='password'
                  />
                  <CustomInput
                    label='Confirmación de contraseña'
                    required
                    placeholder='Confirma la contraseña...'
                    type='password'
                  />
                </div>

                <div className='following_btn mt-4 gap-4'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() => setSelectedTab("2")}
                  >
                    <span>
                      <FaAnglesRight />
                    </span>
                    <span>Siguiente</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className='user_foto'>
                  <div>
                    <img src={img == "" ? noPets : img} />
                  </div>
                  <input
                    type='file'
                    ref={fileInputRef}
                    style={{display: "none"}}
                    onChange={handleFileChange}
                  />
                  <button onClick={handleButtonClick}>Subir</button>
                </div>

                <button
                  onClick={() => {
                    setSelectedTab(1);
                  }}
                  className='d-flex gap-2 align-items-center btn btn-sm btn-primary'
                >
                  <FaAnglesLeft />
                  <span>Atras</span>
                </button>
              </>
            )}

            <hr />

            <div className='modal_buttons '>
              <button className='confirm_button'>GUARDAR</button>
              <button className='cancel_button'>Cerrar</button>
            </div>
          </>
        </Modal>
      )}

      <div className='users_page'>
        <FormCard header='Usuarios registrados'>
          <form>
            <div
              className=''
              style={{
                width: "33.33%",
              }}
            >
              <CustomInputWithSearch
                label='Email:'
                placeholder='Buscar usuario...'
              />
            </div>
            {/* <div>
              <CustomButton
                text='Nuevo'
                onClick={handleOpenModal}
                icon={<FaFile />}
                bgColor='#858796'
              />
            </div> */}
          </form>
        </FormCard>
      </div>



      <div className='search_table_container'>
        <Table className='custom-header' columns={columns} dataSource={users} />
      </div>
{/* 
      <div className='user_table'>
        <TableComponent header={headers}>
          {users.map((user) => (
            <tr>
              <td className='edit_btns'>
                <button>
                  <FaPencil />
                </button>
                <button>
                  <FaRegTrashCan />
                </button>
              </td>
              <td className='user-img'>
                <img src={`/${user.FOTO}`} />
              </td>
              <td className='checkbox-img'>
                <img src={checkboxImg} alt='checkbox image' />
              </td>
              <td>{user.USUARIO_PERFIL.PERFIL}</td>
              <td>{user.EMAIL}</td>
              <td>{user.NOMBRE}</td>
              <td>{user.APELLIDO}</td>
            </tr>
          ))}
        </TableComponent>

        <p>Total Registros: {users.length}</p>
      </div> */}
    </>
  );
}
