import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import SearchForm from "../../components/pages/SearchPage/SearchForm";
import "./style.css";
import Modal from "./../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { Table } from "antd";
import axios from "axios";
import { base_url } from "../../constant";
import { toast } from "react-toastify";
import cx from "classnames";
import Spinner from "../../utils/Spinner/Spinner";

const SearchPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(isSubmitted);
  }, [isSubmitted]);

  const [searchLoading, setSearchloading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const handleExport = () => {
    // Step 1: Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(searchResult);

    // Step 2: Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Step 3: Write the workbook as a binary file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Step 4: Convert the binary buffer to a Blob and trigger the download
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  };

  const columns = [
    {
      title: "Imagen del Animal",
      dataIndex: "pet_image",
      key: "pet_image",
      render: (img) => <img src={img} alt="" />,
    },
    {
      title: "Nombre",
      dataIndex: "f_name",
      key: "f_name",
      render: (text) => <div className="text-center">{text}</div>,
    },

    {
      title: "Apellido",
      dataIndex: "l_name",
      key: "l_name",
      render: (text, row) => <div className="text-center">{text}</div>,
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "dob",
      key: "dob",
      render: (text, row) => <div className="text-center">{text}</div>,
    },
    {
      title: "Sexo",
      dataIndex: "sex",
      key: "sex",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Calificado",
      dataIndex: "qualified",
      key: "qualified",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Tamaño",
      dataIndex: "size",
      key: "size",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Color",
      dataIndex: "coat_color",
      key: "coat_color",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      render: (text, row) => <div className="text-center ">{text}</div>,
    },

    {
      title: "Esterilizado",
      dataIndex: "is_sterillized",
      key: "is_sterillized",
      render: (text, row) => (
        <div className="text-center">
          <div
            className={cx("fw-bolder", {
              "text-danger": row.is_sterillized == 0,
              "text-success": row.is_sterillized != 0,
            })}
          >
            {row.is_sterillized == 1 ? "Esterilizada" : "No Esterilizada"}
          </div>
        </div>
      ),
    },
  ];

  const [searChData, setSearchData] = useState({
    sex: "",
    raza: "",
    type: "",
    department: "",
    province: "",
    district: "",
    name: "",
    dni: "",
  });

  const handleSearch = async () => {
    setSearchloading(false);

    const dataset = {
      ...searChData,
      sex: searChData?.sex?.value,
    };

    console.log(dataset);
    setLoading(true);
    await axios
      .post(`${base_url}animals/filter_animals`, dataset)
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          setSearchResult(res.data.result);
        } else {
          toast.error("Hay un problema");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setSearchloading(false);
        setLoading(false);
      });
  };

  return (
    <div className="search_page">
      <div className="search_container">
        <SearchForm
          searchData={searChData}
          setSearchData={setSearchData}
          setIsSubmitted={setIsSubmitted}
          handleSearch={handleSearch}
          handleDownload={handleExport}
        />
      </div>
      {loading ? (
        <div className="my-5">
          <Spinner size={50} color="rgb(54, 185, 204)" loading={loading} />
        </div>
      ) : (
        <div className="search_table_container">
          <Table
            className="custom-header"
            columns={columns}
            dataSource={searchResult}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
