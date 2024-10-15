import {FaCheckCircle, FaSearch, FaUserPlus} from "react-icons/fa";
import "./style.css";
import {FaCircleXmark, FaFile} from "react-icons/fa6";
import {useEffect, useState} from "react";
import Modal from "../../components/Modal/Modal";
import CustomInput from "../../components/CustomInput/CustomInput";
import Alert from "../../components/Alert/Alert";
import CustomInputWithSearch from "../../components/CustomInputWithSearch/CustomInputWithSearch";
import FormCard from "../../components/FormCard/FormCard";
import CustomButton from "./../../components/CustomButton/CustomButton";
import TableLayout from "./../../components/TableLayout/index";
import Datos from "../../components/PetsModalComponents/Datos/Datos";
import Domicilio from "../../components/PetsModalComponents/Domicilio/Domicilio";
import Salud from "../../components/PetsModalComponents/Salud/Salud";
import Foto from "../../components/PetsModalComponents/Foto/Foto";
import TableComponent from "../../components/Table/Table";
// import PetsModalComponents from "../../components/PetsModalComponents/PetsModalComponents";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";
import useGetUsers from "../../CustomHooks/useGetUsers";
import {userPlus} from "../../assets/svgIcons";
import AddNewUserModal from "./AddNewUserModal";
import {toast} from "react-toastify";
import {Table, Tag} from "antd";
import {useMediaQuery} from "./../../CustomHooks/useMediaQueries";
import {AnimatePresence} from "framer-motion";
import {base_url} from "../../constant";
import axios from "axios";
import {uploadImage} from "./../../constant/uploadImage";
import useGetAgrags from "../../CustomHooks/useGetAgrags";
import Select from "react-select";
import {formatDate} from "../../CustomHooks/dateFormats";
import TimeAgo from "react-timeago";
import cx from "classnames";
const tabs = [
  {
    id: "1",
    name: "Datos",
  },
  {
    id: "2",
    name: "Domicilio",
  },
  {
    id: "3",
    name: "Salud",
  },
  {
    id: "4",
    name: "Foto",
  },
];

export default function Mascota() {
  const headers = [
    "OPCION",
    "FOTO",
    "DNI RUMP",
    "ESTADO",
    "NOMBRE",
    "SEXO",
    "TAMAÑO",
    "COLOR",
    "TIPO",
    "RAZA",
  ];

  const [addUserModal, setAddUserModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [alert, setAlert] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRegisteredModal, setIsRegisteredModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [addLoading, setAddloading] = useState(false);
  const [ptesDasta, setptesDasta] = useState([]);

  const [newPit, setNewPet] = useState({
    user_id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    f_name: "",
    l_name: "",
    sex: "",
    departmento_id: "",
    provincia_id: "",
    districto_id: "",
    micro: "",
    bio: "",
    type: "",
    raza: "",
    qualified: "",
    coat_color: "",
    dob: "",
    officials: "",
    resPersons: [{name: "", dni: "", phone: ""}],
    address: "",
    piso: "",
    referencia: "",
    mascota_tiene: "",
    esta_cast: "",
    visit_per: "",
    cuenta_con_vac_sext: "",
    cuenta_con_vac_trip_fel: "",
    cuenta_con: "",
    fecha_de_date: "",
    posee_alg_alerg: "",
    posee_alg_enf: "",
    pet_img: null,
    size: "",
    is_sterillized: "",
    animail_f_name: "",
    animail_l_name: "",
    hide_as_stri: "",
  });

  useEffect(() => {
    console.log(newPit);
  }, [newPit]);

  const handleSelectPit = () => {
    if (newPit.user_id) {
      setIsRegisteredModal(true);
      setIsModalOpen(false);
      return;
    }

    toast.error("Elige un usuario primero");
  };

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitted(true);
    if (email === "") {
      setAlert("Correo: Ingrese un correo válido");
    } else {
      setAlert("");
      setIsRegisteredModal(true);
      setIsModalOpen(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setAlert("");
    setIsSubmitted(false);
  }

  function handleCloseRegisterModal() {
    setIsRegisteredModal(false);
  }

  const {handleGetUsers, users} = useGetUsers();
  const {loading, getAgrags, originalData, setAgrags, agrags} = useGetAgrags();

  useEffect(() => {
    handleGetUsers();
    getAgrags();
  }, []);

  const columns = [
    {
      title: "Imagen",
      dataIndex: "pet_img",
      key: "pet_img",
      render: (text, row) => <img width={150} src={row?.pet_img} alt='' />,
    },

    {
      title: "nombre de mascota",
      render: (text, row) => <div>{row?.useranimal?.animal?.f_name}</div>,
    },
    {
      title: "Apellidos",
      render: (text, row) => <div>{row?.useranimal?.animal?.l_name}</div>,
    },
    {
      title: "Sexo",
      render: (text, row) => <div>{row?.useranimal?.animal?.sex}</div>,
    },
    {
      title: "microchip",
      render: (text, row) => (
        <Tag color='gray'>{row.micro ?? "no tiene microchip"}</Tag>
      ),
    },
    {
      title: "Fecha de nacimiento",
      render: (text, row) => (
        <div>{formatDate(row?.useranimal?.animal?.dob)}</div>
      ),
    },
    {
      title: "creado_en",
      render: (text, row) => (
        <div>
          <Tag color='cyan'>
            <TimeAgo date={new Date(row?.useranimal?.animal?.created_at)} />
          </Tag>
        </div>
      ),
    },
    {
      title: "Tamaño",
      render: (text, row) => <div>{row?.useranimal?.animal?.size}</div>,
    },
    {
      title: "DIRECCIÓN",
      render: (text, row) => <div>{row?.useranimal?.animal?.address}</div>,
    },

    {
      title: "Color",
      render: (text, row) => <div>{row?.useranimal?.animal?.coat_color}</div>,
    },
    // progress...
    {
      title: "Calificación",
      render: (text, row) => <div>{row?.useranimal?.animal?.qualified}</div>,
    },
    // progress...
    {
      title: "Raza",
      render: (text, row) => <div>{row?.useranimal?.animal?.raza?.title_es}</div>,
    },
    {
      title: "Biografía",
      render: (text, row) => <div>{row?.useranimal?.animal?.bio}</div>,
    },
    {
      title: "Piso",
      render: (text, row) => <div>{row?.piso ?? "__"}</div>,
    },
    {
      title: "Referencia",
      render: (text, row) => <div>{row?.referencia}</div>,
    },
    // progress...
    {
      title: "Especie",
      render: (text, row) => <div>{row?.type}</div>,
    },
    {
      title: "Departamento",
      render: (text, row) => <div>{row?.departmento?.title_es ?? "__"}</div>,
    },
    {
      title: "Provincia", 
      render: (text, row) => <div>{row?.provincia?.title_es ?? "__"}</div>,
    },
    {
      title: "Distrito",
      render: (text, row) => <div>{row?.districto?.title_es ?? "__"}</div>,
    },
    {
      title: "¿La mascota está castrada?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.esta_cast == 1,
            "text-danger": row.esta_cast != 1,
          })}
        >
          {row.esta_cast == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿Visita periodicamente al veterinario?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.visit_per == 1,
            "text-danger": row.visit_per != 1,
          })}
        >
          {row.visit_per == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿Cuenta con vacunación séxtuple?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.cuenta_con_vac_sext == 1,
            "text-danger": row.cuenta_con_vac_sext != 1,
          })}
        >
          {row.cuenta_con_vac_sext == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿Cuenta con vacunación triple felina?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.cuenta_con_vac_trip_fel == 1,
            "text-danger": row.cuenta_con_vac_trip_fel != 1,
          })}
        >
          {row.cuenta_con_vac_trip_fel == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿Cuenta con limpieza dental?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.cuenta_con == 1,
            "text-danger": row.cuenta_con != 1,
          })}
        >
          {row.cuenta_con == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿Posee alguna alergia? ",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.posee_alg_alerg == 1,
            "text-danger": row.posee_alg_alerg != 1,
          })}
        >
          {row.posee_alg_alerg == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: " ¿Posee alguna enfermedad?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row.posee_alg_enf == 1,
            "text-danger": row.posee_alg_enf != 1,
          })}
        >
          {row.posee_alg_enf == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿El animal es estéril?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row?.useranimal?.animal?.is_sterillized == 1,
            "text-danger": row?.useranimal?.animal?.is_sterillized != 1,
          })}
        >
          {row?.useranimal?.animal?.is_sterillized == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },
    {
      title: "¿El animal es estéril?",
      render: (text, row) => (
        <div
          className={cx("fs-4 text-center", {
            "text-success  ": row?.useranimal?.animal?.is_sterillized == 1,
            "text-danger": row?.useranimal?.animal?.is_sterillized != 1,
          })}
        >
          {row?.useranimal?.animal?.is_sterillized == 1 ? <FaCheckCircle /> : <FaCircleXmark/>
          }
        </div>
      ),
    },

    {
      title: "Más detalles...",
      render: (text, row) => (
          <button className="btn btn-primary">Más detalles</button>
      ),
    },


   
  ];

  const isSmallScreen = useMediaQuery("(max-width:786px)");

  const handAddPit = async () => {
    setAddloading(true);

    let image = null;
    if (newPit.pet_img) {
      image = await uploadImage(newPit.pet_img);
      delete newPit.pet_img;
    }
    console.log(image);

    //  return

    const concatOfficials = newPit.resPersons
      .map((item) => [item.name, item.dni, item.phone].join("**"))
      .join("**pets**");

    const datasend = {
      ...newPit,
      pet_img: image?.data?.message || "",
      sex: newPit?.sex?.value,
      size: newPit.size.value,
      type: newPit.type.value,
      provincia_id: newPit.provincia_id.value,
      qualified: newPit.qualified.value,
      raza: newPit.raza.value,
      esta_cast: newPit.esta_cast.value,
      departmento_id: newPit.departmento_id.label,
      districto_id: newPit.districto_id.label,
      visit_per: newPit.visit_per.label,
      cuenta_con_vac_sext: newPit.cuenta_con_vac_sext.value,
      cuenta_con_vac_trip_fel: newPit.cuenta_con_vac_trip_fel.value,
      officials: concatOfficials,
      cuenta_con: newPit.cuenta_con.value,
      is_sterillized: newPit.is_sterillized.value,
      posee_alg_alerg: newPit.posee_alg_alerg.value,
      posee_alg_enf: newPit.posee_alg_enf.value,
    };

    console.log(datasend);
    // return
    await axios
      .post(`${base_url}agrag_animal`, datasend)
      .then((res) => {
        if (res) {
          console.log(res);
          if (res.data.status == "success") {
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setAddloading(false);
      });
  };

  return (
    <>
   
      <Modal
        title='Seleccionar propietario'
        size='1000px'
        style={{height: "600px", overflow: "auto"}}
        confirmButton={{
          children: "GUARDAR",
          style: {backgroundColor: "#36b9cc"},
          onClick: () => {
            handAddPit();
          },
          props: {
            className: selectedTab !== "4" ? "d-none " : "text-white",
          },
        }}
        cancelButton={{
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
        show={isRegisteredModal}
        onClose={handleCloseRegisterModal}
        showCloseBtn={true}
        animation={true}
      >
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

        <AnimatePresence mode='wait'>
          {selectedTab == 1 && (
            <Datos
              setNewPet={setNewPet}
              newPit={newPit}
              setSelectedTab={setSelectedTab}
            />
          )}
          {selectedTab == 2 && (
            <Domicilio
              setNewPet={setNewPet}
              newPit={newPit}
              setSelectedTab={setSelectedTab}
            />
          )}
          {selectedTab == 3 && (
            <Salud
              setNewPet={setNewPet}
              newPit={newPit}
              setSelectedTab={setSelectedTab}
            />
          )}
          {selectedTab == 4 && (
            <Foto
              setNewPet={setNewPet}
              newPit={newPit}
              setSelectedTab={setSelectedTab}
            />
          )}
        </AnimatePresence>

        {/* <PetsModalComponents /> */}
      </Modal>

      {isModalOpen && (
        <Modal
          title='Seleccionar propietario'
          size='600px'
          confirmButton={{
            style: {backgroundColor: "#36b9cc"},
            onClick: handleSelectPit,
            props: {
              disabled: !newPit.user_id,
              className: ` ${!newPit.user_id ? "opacity-50" : ""} text-white`,
            },
            children: (
              <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <FaUserPlus />
                <span>Seleccionar</span>
              </div>
            ),
          }}
          cancelButton={{
            style: {backgroundColor: "#858796"},
            onClick: handleCloseModal,
            children: <span>Cerrar</span>,
          }}
          show={isModalOpen}
          onClose={handleCloseModal}
          showCloseBtn={true}
          animation={true}
        >
          {isSubmitted && alert && <Alert bgColor='#fdf3d8' color='#806520' />}
          <form onSubmit={handleSubmit}>
            <label>Correo</label>
            <Select
              onChange={(e) => setNewPet({...newPit, user_id: e.value})}
              label={":"}
              placeholder='Ingrese el correo del propietario:'
              options={users.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
            />

            <CustomButton
              onClick={() => setAddUserModal(true)}
              className={"mt-3"}
              icon={userPlus}
              text={"Agregar nuevo usuario"}
            />
          </form>
        </Modal>
      )}

      <AddNewUserModal
        newPit={newPit}
        handleGetUsers={handleGetUsers}
        setNewPet={setNewPet}
        open={addUserModal}
        setOpen={setAddUserModal}
      />
      <FormCard
        drawer={true}
        header={"Mantenimiento de Mascota"}
        children={
          <>
            <form onSubmit={handleSearch}>
              <div style={{width: isSmallScreen ? "100%" : "40.33%"}}>
                <CustomInputWithSearch
                  placeholder='Ingrese DNI mascota...'
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </div>

              <div className='mt-3'>
                <CustomButton
                  onClick={handleOpenModal}
                  icon={<FaFile />}
                  text={"AGREGAR MASCOTA"}
                  bgColor={"#D1A535"}
                />
              </div>
            </form>
          </>
        }
      />

      <div className='search_table_container'>
        <Table
          className='custom-header'
          columns={columns}
          dataSource={agrags}
        />
      </div>
      {/* 
      <div className='mascota_table'>
        <TableComponent header={headers} />












      </div> */}
    </>
  );
}
