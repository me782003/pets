import React, {useRef, useState} from "react";
import "./style.css";
import FormCard from "../../components/FormCard/FormCard";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import {Print} from "../../assets/svgIcons";
import PetComponent from "../../components/PetComponent/PetComponent";
import axios from "axios";
import {base_url} from "../../constant";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import {Hidden} from "@mui/material";
import Spinner from "../../utils/Spinner/Spinner";
import toast from "react-hot-toast";

const DNI_page = () => {
  const [dni, setDni] = useState("");

  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState(null);
  const handleDni = async () => {
    if (!dni) {
      toast.error("Introducir DNI!");
      return;
    }

    setLoading(true);

    const dataset = {
      dni: dni,
    };

    await axios
      .post(base_url + "dni_request", dataset)
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          setPetData(res.data.result);
        } else {
          alert("Error al obtener los datos");
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const contentRef = useRef();

  const reactToPrintFn = useReactToPrint({contentRef});

  return (
    <>
      <div className='dni_page'>
        <FormCard
          header={"Imprimir DNI de Mascota"}
          children={
            <>
              <div className=''>
                <div>
                  <CustomInput
                    className='department-search'
                    onChange={(e) => setDni(e.target.value)}
                    label={"DNI"}
                    value={dni}
                    placeholder={"Escriba el DNI de la mascota..."}
                  />
                </div>
              </div>
              <div className='mt-3'>
                <CustomButton
                  onClick={() => handleDni()}
                  icon={Print}
                  bgColor={"#5bc0de"}
                  text={"Imprimir DNI"}
                />
              </div>
            </>
          }
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div>
            <div
              className=''
              style={{
                display: "none",
                position: "absolute",
                opacity: "0",
              }}
            >
              <div ref={contentRef}>
                {petData && <PetComponent cols={true} data={petData} />}
              </div>
            </div>
            {
              petData &&
            <div className='d-flex cle z-big' style={{zIndex: 100}}>
              <button
                className='my-1 mx-auto btn btn-primary px-3'
                onClick={reactToPrintFn}
                >
                Imprimir
              </button>
            </div>
              }
          </div>

          {petData && (
            <>
              <PetComponent data={petData} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default DNI_page;
