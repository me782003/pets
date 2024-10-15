import CustomInput from "../../components/CustomInput/CustomInput";
import FormCard from "../../components/FormCard/FormCard";
import "./Brands.css";
import TableComponent from "../../components/Table/Table";
import {useEffect, useState} from "react";
import Modal from "../../components/Modal/Modal";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {base_url} from "../../constant";
import {uploadImage} from "../../constant/uploadImage";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Brands() {
  const [showModeal, setShowModal] = useState({
    editModal: false,
    updatedStatus: false,
    openModal: false,
  });

  const headers = ["images", "Estado", "Acciones"];
  const [rowData, setRowData] = useState({});
  const [data, setData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [copiedImage , setCopiedImage] = useState("");

  const handleOpenEidtModal = () => {
    setShowModal({...showModeal, editModal: true});
  };
  function handleCloseModal() {
    setShowModal({
      ...showModeal,
      openModal: false,
      updatedStatus: false,
      editModal: false,
    });
  }

  // to get all images in brands
  const get_all_data = () => {
    axios
      .get(base_url + "brands/get_for_admin")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  // created new image
  const createImage = async () => {
    const formData = new FormData();
    formData.append("image", newImage);
    setIsDisabled(true);
    if (newImage !== "") {
      try {
        axios
          .post("https://camp-coding.site/pets/api/img_upload", formData)
          .then((res) => {
            setIsDisabled(false);
            notify(res.data.message);
            console.log(res.data.result.image);
            setNewImageUrl(res.data.result.image);
            setNewImage("")
          });
      } catch (error) {
        notify(error);
        console.log(error);
        setIsDisabled(false);
      }
    }
  };

  //   TO POST IMAGE URL
  useEffect(() => {
    //   console.log(json.string newImageUrl)
    console.log(newImageUrl);
    console.log(JSON.stringify(newImageUrl));
    if (newImageUrl !== "") {
      axios
        .post("https://camp-coding.site/pets/api/admins/brands/add_new", {
          image: JSON.stringify(newImageUrl),
        })
        .then((res) => {
          console.log(res.data.message);
          notify(res.data.message);
          get_all_data();
        });
    }
  }, [newImageUrl]);

  // to edit the data
  const handleImageEditBtn = async (e) => {
    console.log("edit function")

    // let image = null;
    if(rowData.image !== null){
      toast.error("nothing changed")
      setShowModal({...showModeal , editModal:false})
      return
    }
    if(editedImage === ""){
      setRowData({...rowData , image:copiedImage})
      toast.error("nothing changed upload an image")
      setShowModal({...showModeal , editModal:false})
      return
    }
    if (rowData.image === null&& editedImage !== "") {
      // const formData = new FormData();
      // formData.append("image", editedImage);
      uploadImage(editedImage)
      console.log("first function done")
      axios.post(`${base_url}brands/update_one/${rowData.id}` , {
        image:JSON.stringify(editedImage)
      }).then(res=>{
        if(res.data.status ==="success"){
          toast.success(res.data.message)
          console.log("upload succefully")
          setShowModal({...showModeal , editModal:false})
          console.log("second function done")
        }
      })
      .catch(error=>console.log(error))
      setShowModal({...showModeal , editModal:false})

      return
    }
  };

  // to delete the data  good
  const notify = (message) => toast(message);
  const handleRazaDeleteBtn = (id) => {
    setIsDisabled(true);
    axios
      .get(base_url + `brands/delete_one/${id}`)
      .then((res) => {
        notify(res.data.message);
        setIsDisabled(false);
        get_all_data();
      })
      .catch((error) => {
        console.log(error);
        setIsDisabled(false);
      });
    console.log("after dlete");
  };

  //to update the status
  const handleDepartUpdateBtn = (e) => {
    setIsDisabled(true);
    axios
      .get(base_url + `brands/update_status/${rowData.id}`)
      .then((res) => {
        setShowModal({...showModeal, updatedStatus: false});
        notify(res.data.message);
        setIsDisabled(false);
        get_all_data();
      })
      .catch((error) => {
        console.log(error);
        setIsDisabled(false);
      });
  };

  useEffect(() => {
    get_all_data();
  }, []);

  return (
    <>
      <ToastContainer />
      {/* model that show edit modal */}
      <Modal
        title={"Editar Title"}
        show={showModeal.editModal}
        onClose={handleCloseModal}
        showCloseBtn={true}
        size='900px'
        
        confirmButton={{
          onClick: (e) => handleImageEditBtn(e),
          children: " Guardar",
          style: {backgroundColor: "#36b9cc"},
        }}
        cancelButton={{
          onClick: handleCloseModal,
          children: "Cerrar",
          style: {backgroundColor: "#858796"},
        }}
      >
        <form className='modal_form'>
          {rowData.image ? (
            <div className='d-flex flex-column gap-3'>
              <img src={rowData?.image}  alt=""/>
              <div>
                <button
                  onClick={() => {
                    setCopiedImage(rowData.imaeg)
                    setRowData({...rowData, image: null})
                  }
                  }
                  className='btn btn-danger'
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <CustomInput
              label='Image'
              name='Image'
              type='file'
              onChange={(e) => setEditedImage(e.target.files[0]) }
            />
          )}
        </form>
      </Modal>
      <div className='race_page'>
        <FormCard header='Brands'>
          <form className='modal_form'>
            <CustomInput
              label='Image'
              name='Image'
              type='file'
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </form>
          <div className='mt-4 d-flex align-items-center gap-4'>
            <button 
              className="btn btn-danger"
              disabled = {isDisabled}
              onClick={() => createImage()}
              >
              Add
            </button>
          </div>
        </FormCard>
      </div>
      <div className='race_table'>
        {/* data is an array that contain all data */}
        <TableComponent header={headers}>
          {data.map((item) => (
            <tr>
              <td><img src={item.image} alt ="brands _image"/></td>
              <td>{item.hidden === 1?"SHOW":"HIDDEN"}</td>
              <td>
                <div className='edit_btns justify-content-center'>
                  <button
                    onClick={() => {
                      handleOpenEidtModal(item);
                      setRowData(item);
                    }}
                    disabled={isDisabled}
                  >
                    <FaPencil />
                  </button>
                  <button
                    className='update_status_benefit'
                    onClick={() => {
                      // to open the confirm form
                      setShowModal({...showModeal, updatedStatus: true});
                      setRowData(item);
                    }}
                  >
                    actualizar
                  </button>
                  <button
                    onClick={() => handleRazaDeleteBtn(item.id)}
                    disabled={isDisabled}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Modal show when click to update status */}

          <Modal
            title='change status'
            show={showModeal.updatedStatus}
            onClose={() => setShowModal({...showModeal, updatedStatus: false})}
            showCloseBtn={true}
            size='900px'
            confirmButton={{
              onClick: handleDepartUpdateBtn,
              children: " Guardar",
              style: {backgroundColor: "#36b9cc"},
              props: {disabled: isDisabled},
            }}
            cancelButton={{
              //   no errors here
              onClick: () =>
                setShowModal({...showModeal, updatedStatus: false}),
              // onClick: handleCloseModal,
              // console.log(showModeal.updatedStatus)
              children: "CerRar",
              style: {backgroundColor: "#858796"},
            }}
          >
            <h1>¿Estás seguro de ocultar este elemento?</h1>
          </Modal>
        </TableComponent>
      </div>
    </>
  );
}
