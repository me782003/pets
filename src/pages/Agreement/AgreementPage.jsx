import React, {useState} from "react";
import FormCard from "../../components/FormCard/FormCard";
import {arrowLeft, arrowRight, filterIcon} from "../../assets/svgIcons";
import CustomInput from "./../../components/CustomInput/CustomInput";
import "./style.css";
import CustomButton from "./../../components/CustomButton/CustomButton";
import TableComponent from "../../components/Table/Table";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import {Form, InputGroup} from "react-bootstrap";
import FromGroup from "../../components/FromGroup/FromGroup";
import Modal from "../../components/Modal/Modal";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { convenios } from "../../utils/convenios";

const AgreementPage = () => {
  const [newAgreementModal, setNewAgreementModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [isSearch , setIsSearch] = useState(false); 

  const tabs = [
    {
      id: "1",
      name: "Datos",
    },
    {
      id: "2",
      name: "Domicilio",
    },
  ];
  
  const tipoData = [
    {label:"TODOS"},
    {label:"Clínica Veterinaria"},
    {label:"Pet shop"},{label:"Pet shop y Spa"},
    {label:"Veterinaria"},
    {label:"Veterinaria Pet Shop"},
    {label:"Veterinaria"},
    {label:"Veterinaria Pet Shop"}
  ]
 
    
  return (
    <div className='agreement_container'>
      <FormCard
        header={"Maintenance of Agreements"}
        children={
          <>
            <div className='agreemetns_inputs'>
              <div>
                <CustomSelect 
                  label={"Tipo"}
                  data = {tipoData}

                />
              </div>
              <CustomInput label={"Nombre"} />
            </div>
            <div className='agreement_card_buttons'>
              <CustomButton bgColor={"#5bc0de"} text={"Buscar"} onClick={() => {setIsSearch(true)}} />
              <CustomButton
                onClick={() => setNewAgreementModal(true)}
                bgColor={"gray"}
                text={"Nuevo"}
              />
            </div>
          </>
        }
      />

      <div className='agreement_table_container'>
        <TableComponent
          header={[
            "",
            "PTO. AUTOR.",
            "NOMBRE",
            "TELEFONO	",
            "BENEFICIO",
            "DIRECCION",
          ]}
        >
           { isSearch &&  convenios.map(item => (
            <tr>
               <td className="edit_btns">
                   <button><FaPencil /></button>
                   <button><FaRegTrashCan /></button>
              </td>
              <td>{item.PUNTO_AUTORIZADO ? "No" : "Si"}</td>
              <td>{item.NOMBRE}</td>
              <td>{item.TELEFONO}</td>
              <td>{item.BENEFICIO}</td>
              <td>{item.DIRECCION}</td>
            </tr>
           ))}
          </TableComponent>
      </div>

      {/* modal that show when clicking on nueovo*/}
      <Modal
        size={"90%"}
        show={newAgreementModal}
        showCloseBtn
        title={"Register Agreement"}
        onClose={() => setNewAgreementModal(false)}
        children={
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
              <div>
                <FromGroup>
                  <CustomSelect required={true} label={"Tipo"}  data = {tipoData}/>
                  <FromGroup.Input
                    required={true}
                    label={"Nombre"}
                    placeholder='Nombe de la clinica'
                  />
                  <FromGroup.Input
                    required={true}
                    label={"Telefono"}
                    placeholder='Telefono de la clinica'
                  />
                </FromGroup>

                <div className=' row mt-3'>
                  <div className='col-2 d-flex algin-items-center'>
                    <CustomInput
                      style={{
                        width: "fit-content",
                        transform: "scale(3)",
                        transformOrigin: "top left",
                        marginInline: "auto",
                        // marginRight:'30px'
                      }}
                      type='checkbox'
                      label={"Punto autorizado"}
                      // placeholder={"Escriba una referencia del evento..."}
                      // textarea={true}
                    />
                  </div>
                  <div className='col-10'>
                    <CustomInput
                      label={"Detalle"}
                      placeholder={"Escriba una referencia del evento..."}
                      textarea={true}
                    />
                  </div>
                </div>

                <div className="following_btn mt-4">
                  <button className="btn btn-sm btn-primary" onClick={()=>setSelectedTab("2")}>
                    <span>{arrowRight}</span>
                    <span>Siguiente</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                <FromGroup>
                  <CustomSelect data={[{name:"Amazonas"},{name:"Áncash"} ,{name:"Apurímac"},{name:"Arequipa"},{name:"Ayacucho"},{name:"Cajamarca"},{name:"Callao"},{name:"Cusco"},{name:"Huancavelica"},{name:"Huánuco"}]} required={true} label={"Departamento"} />
                  <CustomSelect required={true} label={"Provincia"} />
                  <FromGroup.Input
                    required={true}
                    label={"Nombre"}
                    placeholder='Nombe de la clinica'
                  />
                  
                </FromGroup>
                <CustomInput label={"Dirección"} required={true} placeholder={"Dirección/Departamento/Interior"}/>

                <div className="row">
                  <div className="col">
                <CustomInput label={"Latitud"}  placeholder={"Latitud en google maps"}/>
                  </div>
                  <div className="col">

                <CustomInput label={"Longitud"} placeholder={"Longitud en google maps"}/>
                  </div>
                </div>

                <div className="following_btn mt-4">
                  <button className="btn btn-sm btn-primary" onClick={()=>setSelectedTab("1")}>
                    <span>{arrowLeft}</span>
                    <span>Altras</span>
                  </button>
                </div>
               




              </div>
            )}

<hr />

<div className='modal_buttons '>
  <button className='confirm_button'>GUARDAR</button>
  <button className='cancel_button'>Cerrar</button>
</div>
          </>
        }
      />
    </div>
  );
};

export default AgreementPage;
