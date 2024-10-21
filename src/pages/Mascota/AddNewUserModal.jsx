import React, {useState} from "react";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import {base_url} from "../../constant";
import {Check, SearchIconify} from "../../assets/svgIcons";
import FromGroup from "../../components/FromGroup/FromGroup";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import toast from "react-hot-toast";

const AddNewUserModal = ({open, newPit, setNewPet, setOpen , handleGetUsers , handleCloseModal:closeAll}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const dataset = {
      name: newPit.name,
      email: newPit.email,
      phone: newPit.phone,
      password: newPit.password,
    };
    await axios
      .post(`${"https://camp-coding.site/pets/api/"}user/sign_up` , dataset)
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          toast.success("Usuario añadido exitosamente");
          handleGetUsers();
          setOpen(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setOpen(false);
    closeAll();
  };

  return (
    <Modal
      title='Seleccionar propietario'
      size='600px'
      confirmButton={{
        onClick: handleSubmit,
        children: "Registro",
      }}
      show={open}
      onClose={handleCloseModal}
      showCloseBtn={true}
      animation={true}
    >
      <div className='d-flex flex-column gap-4'>
        {/* first row */}
        <CustomInput
          onChange={(e) =>
            setNewPet({
              ...newPit,
              name: e.target.value,
            })
          }
          value={newPit.name}
          required={true}
          label={"Nombre:"}
        />
        <CustomInput
          onChange={(e) =>
            setNewPet({
              ...newPit,
              email: e.target.value,
            })
          }
          value={newPit.email}
          required={true}
          label={"Email:"}
        />
        <CustomInput
          onChange={(e) =>
            setNewPet({
              ...newPit,
              phone: e.target.value,
            })
          }
          value={newPit.phone}
          required={true}
          type='number'
          label={"Phone"}
        />
        <CustomInput
          onChange={(e) =>
            setNewPet({
              ...newPit,
              password: e.target.value,
            })
          }
          value={newPit.password}
          required={true}
          type='password'
          label={"Password"}
        />
      </div>
    </Modal>
  );
};

export default AddNewUserModal;
