import React, {useEffect, useState} from "react";
import FormCard from "../../FormCard/FormCard";
import {useMediaQuery} from "../../../CustomHooks/useMediaQueries";
import CustomInputWithSearch from "../../CustomInputWithSearch/CustomInputWithSearch";
import CustomButton from "../../CustomButton/CustomButton";
import {FaPlus} from "react-icons/fa";
import {Table} from "antd";
import useGetFaqs from "../../../CustomHooks/useGetFAQs";
import cx from "classnames";
import {edit, trashIcon} from "../../../assets/svgIcons";
import Modal from "./../../Modal/Modal";
import {Loader} from "rsuite";
import {uploadImage as uploadFile} from "./../../../constant/uploadFiles";

import FromGroup from "../../FromGroup/FromGroup";
import toast from "react-hot-toast";
import axios from "axios";
import {base_url} from "../../../constant";
import Typo from "../../../utils/Typo/Typo";

const FAQs = () => {
  const [newFaq, setNewFaqs] = useState({
    title_en: "",
    title_es: "",
    answer_en: "",
    answer_es: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const {
    handleGetFaqus,
    faqs,
    setFaqs: setFaqsReq,
    loading,
    originalFaqs,
  } = useGetFaqs();

  useEffect(() => {
    handleGetFaqus();
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:786px)");

  const handleSearch = () => {};

  const [modals, setModals] = useState({
    addModal: false,
    updateModal: false,
    statusModal: false,
  });

  const columns = [
    {
      title: "Título en español",
      dataIndex: "title_es",
      key: "title_es",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Título en inglés",
      dataIndex: "title_en",
      key: "title_en",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "respuesta en español",
      dataIndex: "answer_en",
      key: "answer_en",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "respuesta en ingles",
      dataIndex: "description_en",
      key: "description_en",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Descripción en inglés",
      dataIndex: "answer_es",
      key: "answer_es",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Estado",
      dataIndex: "hidden",
      key: "hidden",
      render: (text, row) => (
        <div
          className={cx("fw-bolder", {
            "text-success": row.hidden == 0,
            "text-danger": row.hidden != 0,
          })}
        >
          {row.hidden == 0 ? "Mostrado" : "Oculta"}
        </div>
      ),
    },

    {
      title: "Comportamiento",
      key: "Comportamiento",
      render: (text, row) => (
        <div className='d-flex align-items-center gap-2'>
          <button
            onClick={() => {
              setRowData(row);
              setModals({...modals, statusModal: true});
            }}
            className=' btn-sm btn btn-info text-white'
          >
            cambiar estado
          </button>
          <button
            onClick={() => {
              setModals({...modals, updateModal: true});
              setRowData(row);
              console.log(row);
            }}
            className=' btn-sm btn btn-primary text-white'
          >
            {edit}
          </button>
          <button
            onClick={() => {
              setRowData(row);
            }}
            className=' btn-sm btn btn-danger text-white'
          >
            {trashIcon}
          </button>
        </div>
      ),
    },
  ];

  const handleAddFaq = async () => {
    if (!newFaq.title_en) {
      console.log("emty title");
      toast.error("¡Se requiere pregunta en inglés!");
      return;
    }

    if (!newFaq.title_es) {
      toast.error("¡Se requiere pregunta en español!");
      return;
    }

    if (!newFaq.answer_en) {
      toast.error("¡Se requiere respuesta en inglés!");
      return;
    }

    if (!newFaq.answer_es) {
      toast.error("¡Se requiere respuesta en español!");
      return;
    }

    const datasend = {
      ...newFaq,
    };

    console.log(datasend);
    setAddLoading(false);

    await axios
      .post(`${base_url}create_faqs`, datasend)
      .then((res) => {
        if (res) {
          console.log(res);
          if (res.data.status == "success") {
            toast.success(res.data.message);
            handleGetFaqus();
            setModals({...modals, addModal: false});
          } else {
            toast.error(res.data.message);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAddLoading(false));
  };

  const handleUpdateQuestion = async () => {
    setUpdateLoading(true);

    if (!rowData.title_en) {
      toast.error("¡Se requiere pregunta en inglés!");
      return;
    }

    if (!rowData.title_es) {
      toast.error("¡Se requiere pregunta en español!");
      return;
    }

    if (!rowData.answer_en) {
      toast.error("¡Se requiere respuesta en inglés!");
      return;
    }

    if (!rowData.answer_es) {
      toast.error("¡Se requiere respuesta en español!");
      return;
    }

    const datasend = {
      ...rowData,
    };

    await axios
      .post(`${base_url}update_faqs/${rowData.id}`, datasend)
      .then((res) => {
        if (res) {
          console.log(res);
          if (res.data.status == "success") {
            toast.success(res.data.message);
            handleGetFaqus();
            setModals({...modals, updateModal: false});
          } else {
            toast.error(res.data.message);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAddLoading(false));
  };

  const handleUpdateStatus = async () => {
    setStatusLoading(false);
    await axios
      .get(`${base_url}update_faqs_status/${rowData.id}`)
      .then((res) => {
        if (res) {
          if (res.data.status == "success") {
            toast.success(res.data.message);
            handleGetFaqus();
            setModals({...modals, statusModal: false});
          } else {
            toast.error(res.data.message);
          }
        }
      });
  };

  return loading ?  
      "Loading..."
  : (
    <div>
      <Modal
        title='Agregar preguntas frecuentes'
        size='1000px'
        style={{overflow: "auto"}}
        confirmButton={{
          children: addLoading ? <Loader /> : "GUARDAR",
          style: {backgroundColor: "#36b9cc"},
          props: {disabled: addLoading},
          onClick: () => {
            handleAddFaq();
          },
        }}
        cancelButton={{
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
        show={modals.addModal}
        onClose={() => setModals({...modals, addModal: false})}
        showCloseBtn={true}
        animation={true}
      >
        <FromGroup gap={"20px"} rowCount={2}>
          {/* first row */}
          <FromGroup.Input
            value={newFaq.title_en}
            onChange={(e) => setNewFaqs({...newFaq, title_en: e.target.value})}
            required={true}
            placeholder={"Título de la pregunta en inglés"}
            label={"Título de la pregunta en inglés"}
          />
          <FromGroup.Input
            value={newFaq.title_es}
            onChange={(e) => setNewFaqs({...newFaq, title_es: e.target.value})}
            required={true}
            placeholder={"Título de la pregunta en español"}
            label={"Título de la pregunta en español"}
          />
          <FromGroup.Input
            value={newFaq.answer_en}
            onChange={(e) => setNewFaqs({...newFaq, answer_en: e.target.value})}
            required={true}
            type='text'
            placeholder={"Título de la respuesta en inglés"}
            label={"Título de la respuesta en inglés"}
          />
          <FromGroup.Input
            value={newFaq.answer_es}
            onChange={(e) => setNewFaqs({...newFaq, answer_es: e.target.value})}
            required={true}
            placeholder={"Descripción de funciones en español"}
            label={"Descripción de funciones en español"}
          />
        </FromGroup>
      </Modal>
      
      <Modal
        title='Pregunta de actualización'
        size='1000px'
        style={{overflow: "auto"}}
        confirmButton={{
          children: addLoading ? <Loader /> : "GUARDAR",
          style: {backgroundColor: "#36b9cc"},
          props: {disabled: addLoading},
          onClick: () => {
            handleUpdateQuestion();
          },
        }}
        cancelButton={{
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
        show={modals.updateModal}
        onClose={() => setModals({...modals, updateModal: false})}
        showCloseBtn={true}
        animation={true}
      >
        <FromGroup gap={"20px"} rowCount={2}>
          {/* first row */}
          <FromGroup.Input
            value={rowData.title_en}
            onChange={(e) => setRowData({...rowData, title_en: e.target.value})}
            required={true}
            placeholder={"Título de la pregunta en inglés"}
            label={"Título de la pregunta en inglés"}
          />
          <FromGroup.Input
            value={rowData.title_es}
            onChange={(e) => setRowData({...rowData, title_es: e.target.value})}
            required={true}
            placeholder={"Título de la pregunta en español"}
            label={"Título de la pregunta en español"}
          />
          <FromGroup.Input
            value={rowData.answer_en}
            onChange={(e) =>
              setRowData({...rowData, answer_en: e.target.value})
            }
            required={true}
            type='text'
            placeholder={"Título de la respuesta en inglés"}
            label={"Título de la respuesta en inglés"}
          />
          <FromGroup.Input
            value={rowData.answer_es}
            onChange={(e) =>
              setRowData({...rowData, answer_es: e.target.value})
            }
            required={true}
            placeholder={"Descripción de funciones en español"}
            label={"Descripción de funciones en español"}
          />
        </FromGroup>
      </Modal>
      
      <Modal
        title='Estado de actualización'
        size='1000px'
        style={{overflow: "auto"}}
        confirmButton={{
          children: addLoading ? <Loader /> : "GUARDAR",
          style: {backgroundColor: "#36b9cc"},
          props: {disabled: statusLoading},
          onClick: () => {
            console.log("hello");
            handleUpdateStatus();
          },
        }}
        cancelButton={{
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
        show={modals.statusModal}
        onClose={() => setModals({...modals, statusModal: false})}
        showCloseBtn={true}
        animation={true}
      >
        <Typo variant={"h3"} my={"20px"}>
          ¿Realmente quieres cambiar de estado?
        </Typo>
      </Modal>

      <FormCard
        drawer={true}
        header={"Preguntas frecuentes"}
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
                  onClick={() => setModals({...modals, addModal: true})}
                  icon={<FaPlus />}
                  text={"AGREGAR MASCOTA"}
                  bgColor={"#3574d1"}
                />
              </div>
            </form>
          </>
        }
      />

      <div className='search_table_container'>
        <Table className='custom-header' columns={columns} dataSource={faqs} />
      </div>
    </div>
  );
};

export default FAQs;
