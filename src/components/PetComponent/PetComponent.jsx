import React, {useRef} from "react";
import "./style.css";
import topCard from "../../assets/images/petCardTop.png";
import petImage from "../../assets/images/with_pet_2.jpg";
import {useReactToPrint} from "react-to-print";
import cx from "classnames";
const PetComponent = ({data , cols}) => {

  return (
    <div>
      <div className= {cx('pet_card_container row gy-4 ' , {"container" : !cols})}>
        <div className={cx("left-section col-12 col-lg-6" , {"col-12" : cols})}>
          <h2 className='header'>DNI RUMP Virtual</h2>
          <div className='rump-card'>
            <div className='rc_image'>
              <img src={topCard} alt='Dog' />
            </div>

            <div className='row px-3'>
              <div className='col-2 d-flex flex-column justify-content-between'>
                <div className='text-danger '>{data?.dni}</div>
                <div className='pet_image_card_sm mb-4'>
                  <img src={petImage} alt='' />
                </div>
              </div>
              <div className='col-6'>
                <div
                  className='text-primary'
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Apellidos
                </div>
                <div className='text-dark fw-bolder'>{data?.l_name}</div>
                <div
                  className='text-primary'
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Nombers
                </div>
                <div className='text-dark fw-bolder'>{data?.f_name}</div>
                <div
                  className='text-primary'
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Sexo
                </div>
                <div className='text-dark fw-bolder'>{data?.sex}</div>
                <div className='d-flex  gap-3'>
                  <div>
                    <div
                      className='text-primary'
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      Fecha de nacimiento
                    </div>

                    <div className='text-dark fw-bolder'>{data?.dob}</div>
                    <div
                      className='text-primary'
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      Fecha de Inscripción
                    </div>

                    <div className='text-dark fw-bolder'>
                      {new Date().toISOString().split("T")[0]}
                    </div>
                  </div>
                  <div>
                    <div
                      className='text-primary'
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      Fecha de finalización
                    </div>

                    <div className='text-dark fw-bolder'>
                      {
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 5)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-4'>
                <div className='pet_image_card'>
                  <img src={petImage} alt='' />
                </div>
              </div>
            </div>

            {/* <div className="card-body">
            <div className="info">
              <p className="label">Apellidos</p>
              <p className="value">Guevara Hernández</p>
              <p className="label">Nombres</p>
              <p className="value">Oso Peluso</p>
              <p className="label">Sexo</p>
              <p className="value">Macho</p>
              <p className="label">Castrado</p>
              <p className="value">No</p>
              <p className="label">Fecha de nacimiento</p>
              <p className="value">15 10 2022</p>
              <p className="label">Fecha de inscripción</p>
              <p className="value">29 03 2023</p>
              <p className="label">Fecha de emisión</p>
              <p className="value">19 08 2024</p>
              <p className="label">Fecha de caducidad</p>
              <p className="value">19 08 2025</p>
            </div>
            <div className="photo">
              <img src="dog-photo.jpg" alt="Dog" />
            </div>
          </div> */}
          </div>
        </div>

        <div className= {cx("right-section  col-12 col-lg-6" , {"col-12" : cols})}>
          <div className='card-details'>
            <div className='d-flex gap-3 flex-wrap justify-content-between'>
              <div>
                <strong>Departamento</strong>{" "}
                <div>{data?.departmento?.title_es}</div>
              </div>
              <div>
                <strong>Provincia</strong>{" "}
                <div>{data?.provincia?.title_es}</div>
              </div>
              <div>
                <strong>Distrito</strong> <div>{data?.districto?.title_es}</div>
              </div>
            </div>

            <div>
              <strong>Dirección</strong> <div>{data?.address}</div>
            </div>
            {data?.responses?.map((item, index) => {
              return (
                <div>
                  <strong>Responsable {index + 1}</strong>{" "}
                  <div>{item?.name}</div>
                </div>
              );
            })}
            <div>
              <strong>Raza</strong> <div>{data?.raza?.title_es}</div>
            </div>
            <div>
              <strong>Color</strong> <div>{data?.coat_color}</div>
            </div>
            <div>
              <strong>Clasificación</strong> <div>{data?.qualified}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetComponent;
