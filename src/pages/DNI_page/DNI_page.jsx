import React from "react";
import "./style.css";
import FormCard from "../../components/FormCard/FormCard";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import {Print} from "../../assets/svgIcons";

const DNI_page = () => {
  return (
    <div className='dni_page'>
      <FormCard
        header={"Imprimir DNI de Mascota"}
        children={
          <>
            <div className='dni_input'>
              <div>
                <CustomInput
                  label={"DNI"}
                  placeholder={"Escriba el DNI de la mascota..."}
                />
              </div>
            </div>
            <div className='dni_card_buttons'>
              <CustomButton
                icon={Print}
                bgColor={"#5bc0de"}
                text={"Imprimir DNI"}
              />
              <CustomButton
                icon={Print}
                bgColor={"#5bc0de"}
                text={"Certificado Registro"}
              />
              <CustomButton
                icon={Print}
                bgColor={"#5bc0de"}
                text={"Certificado responsable"}
              />
            </div>
          </>
        }
      />
    </div>
  );
};

export default DNI_page;
